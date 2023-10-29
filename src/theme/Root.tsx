import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { StoresProvider, rootStore } from "../stores/stores";
import { observer } from "mobx-react-lite";
import { msalInstance, TENANT_ID } from "../authConfig";
import Head from "@docusaurus/Head";
import siteConfig from '@generated/docusaurus.config';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useLocation, useHistory } from "@docusaurus/router";
const { TEST_USERNAME, TEST_USER_ID } = siteConfig.customFields as { TEST_USERNAME?: string, TEST_USER_ID?: string };

const useTestUserNoAuth = process.env.NODE_ENV !== 'production' && TEST_USERNAME?.length > 0;

if (useTestUserNoAuth) {
  const n = TEST_USERNAME.length >= 40 ? 0 : 40 - TEST_USERNAME.length;
  const n2 = TEST_USER_ID.length > 40 ? 0 : 40 - TEST_USER_ID.length;
  console.log([   '',
                  "┌──────────────────────────────────────────────────────────┐",
                  '│                                                          │',
                  "│   _   _                       _   _                      │",
                  "│  | \\ | |           /\\        | | | |                     │",
                  "│  |  \\| | ___      /  \\  _   _| |_| |__                   │",
                  "│  | . ` |/ _ \\    / /\\ \\| | | | __| '_ \\                  │",
                  "│  | |\\  | (_) |  / ____ \\ |_| | |_| | | |                 │",
                  "│  |_| \\_|\\___/  /_/    \\_\\__,_|\\__|_| |_|                 │",
                  '│                                                          │',
                  '│                                                          │',
                  `│   TEST_USERNAME: ${TEST_USERNAME + ' '.repeat(n)}│`,
                  `│   TEST_USER_ID:  ${TEST_USER_ID + ' '.repeat(n2)}│`,
                  '│                                                          │',
                  '│   --> enable authentication by removing "TEST_USERNAME"  │',
                  '│       and "TEST_USER_ID" from the environment            │',
                  '│       (or the .env file)                                 │',
                  "└──────────────────────────────────────────────────────────┘",
  ].join('\n'))
}


const selectAccount = () => {
  /**
   * See here for more information on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  const currentAccount = msalInstance.getAllAccounts().find((a) => a.tenantId === TENANT_ID);
  
  if (process?.env?.NODE_ENV !== 'production' && TEST_USERNAME) {
    rootStore.sessionStore.setAccount({username: TEST_USERNAME, localAccountId: TEST_USER_ID} as any);
    return
  }

  if (!currentAccount) {
    rootStore.sessionStore.setAccount(null);
  } else {
    rootStore.sessionStore.setAccount(currentAccount);
  }
};

const handleResponse = (response) => {
  /**
   * To see the full list of response object properties, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
   */
  rootStore.sessionStore.setMsalInstance(msalInstance);
  if (response !== null) {
    rootStore.sessionStore.setAccount(response.account);
  } else {
    selectAccount();
  }
};

msalInstance
  .handleRedirectPromise()
  .then(handleResponse)
  .catch((error) => {
    console.error(error);
  });

const Msal = observer(({ children }: any) => {
  if (useTestUserNoAuth) {
    return (<>{children}</>);
  }
  return (<MsalProvider instance={msalInstance}>{children}</MsalProvider>);
});

// Default implementation, that you can customize
function Root({ children }) {
  const { i18n } = useDocusaurusContext();
  const location = useLocation();
  React.useEffect(() => {
    if (window) {
      (window as any).store = rootStore;
    }
    return () => {
      rootStore.cleanup();
    }
  }, [rootStore]);

  /** this effect loads initializes all the loads...
   */
  React.useEffect(() => {
    rootStore.initialize();
  }, [rootStore?.sessionStore?.account]);

  React.useEffect(() => {
    const modalId = rootStore?.viewStore?.openEventModalId;
    /** ensure no modal is open when changing the routes */
    if (modalId) {
      rootStore.viewStore.setEventModalId();
    }
  }, [location, rootStore?.viewStore]);

  // React.useEffect(() => {
  //   console.log('openEventModalId', rootStore?.viewStore?.openEventModalId);
  // }, [rootStore?.viewStore.openEventModalId]);

  // reaction(
  //   () => rootStore?.viewStore?.openEventModalId, 
  //   (openEventModalId, prev, r) => {
  //     if (openEventModalId && openEventModalId !== prev && location.hash !== `#${openEventModalId}`) {
  //       history.push(`#${openEventModalId}`);
  //     } else {
  //       history.replace(`${location.pathname}${location.search}`);
  //     }
  //   }
  // );


  return (
    <>
      <Head>
        <meta property="og:description" content={siteConfig.tagline} />
        <meta
          property="og:image"
          content={`${siteConfig.customFields.DOMAIN}/img/og-preview.png`}
        />
      </Head>
      <StoresProvider value={rootStore}>
        <Msal>
          {children}
        </Msal>
      </StoresProvider>
    </>
  );
}

export default Root;