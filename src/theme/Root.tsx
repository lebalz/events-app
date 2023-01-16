import React from "react";
import { MsalProvider } from "@azure/msal-react";

import { StoresProvider, rootStore } from "../stores/stores";
import { observer } from "mobx-react-lite";
import { msalConfig, msalInstance, TENANT_ID } from "../authConfig";
import { PublicClientApplication } from "@azure/msal-browser";
import useIsBrowser from "@docusaurus/useIsBrowser";
import Head from "@docusaurus/Head";
import {useLocation, useHistory} from '@docusaurus/router';

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
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
});

// Default implementation, that you can customize
function Root({ children }) {
  const isBrowser = useIsBrowser();
  if (isBrowser && !(window as any).store) {
    (window as any).store = rootStore;
  }
  return (
    <div className="dummy">
      <Head>
        <meta property="og:description" content="Informatik Gymnasium Biel-Seeland" />
        <meta
          property="og:image"
          content="https://ofi.gbsl.website/img/og-preview.png"
        />
      </Head>
      <StoresProvider value={rootStore}>
        <Msal>
          {children}
        </Msal>
      </StoresProvider>
    </div>
  );
}

export default Root;