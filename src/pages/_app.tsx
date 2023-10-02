import React, { ComponentType } from "react";
import Head from "next/head";

import { AppShell, NavigationStatusProvider } from "@eco/stratos-appShell";
import { Config } from "../../stratos-config";
import { UserProvider } from "@eco/stratos-auth";




import "../styles/style.css";

function MyApp({ Component, pageProps }) {

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <link
          rel="icon"
          href="https://static-assets.dtn.com/branding/dtn/v1/dtn-favicon-32.png"
        />
        <title>{Config.branding.name}</title>
      </Head>
      <NavigationStatusProvider
        initialStatus={{
          status: [
            {
              id: "nav-statuses",
            },
          ],
        }}
      >
        <AppShell navigation={Config.navItems} branding={Config.branding}>
          <UserProvider errorPath="" showApps={true}>
              <Component {...pageProps} />
          </UserProvider>
        </AppShell>
      </NavigationStatusProvider>
    </React.Fragment>
  );

}

// Opt out of static optimization for runtime env vars
// https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
MyApp.getInitialProps = async () => {
  return {};
};



export default MyApp;
