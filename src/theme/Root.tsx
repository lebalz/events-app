import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { StoresProvider, rootStore } from "../stores/stores";
import { observer } from "mobx-react-lite";
import { msalInstance, TENANT_ID } from "../authConfig";
import Head from "@docusaurus/Head";
import siteConfig from '@generated/docusaurus.config';
const { TEST_USERNAME } = siteConfig.customFields as { TEST_USERNAME?: string };

const selectAccount = () => {
  /**
   * See here for more information on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  const currentAccount = msalInstance.getAllAccounts().find((a) => a.tenantId === TENANT_ID);
  if (!currentAccount) {
    return;
  }else {
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
  if (process.env.NODE_ENV !== 'production' && TEST_USERNAME?.length > 0) {
    console.warn('USING DEV MODE WITH TESTUSER', TEST_USERNAME);
    return (<>{children}</>);
  }
  return (<MsalProvider instance={msalInstance}>{children}</MsalProvider>);
});

// Default implementation, that you can customize
function Root({ children }) {
  React.useEffect(() => {
    if (!(window as any).store) {
      (window as any).store = rootStore;
    }
    rootStore.load();
  }, [rootStore]);

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && TEST_USERNAME) {
      rootStore.sessionStore.setAccount({username: TEST_USERNAME} as any);
    }
  }, [rootStore?.sessionStore])

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