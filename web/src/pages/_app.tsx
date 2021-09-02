import PlausibleProvider from "next-plausible";
import Head from "next/head";
import React from "react";
import { SWRConfig } from "swr";
import "../styles.css";
import "../tailwind.css";
import { UserProvider } from "../user-context";

// Create a client

function MyApp({ Component, pageProps, config }) {
  return (
    <>
      <SWRConfig
        value={{
          revalidateOnFocus: true,
          revalidateOnMount: true,
          revalidateOnReconnect: false,
        }}
      >
          <UserProvider>
        <PlausibleProvider domain="goimitate.com">
          <Head>
            <meta property="og:site_name" content="Imitate" />
          </Head>

          <div className="min-h-screen">
            <Component {...pageProps} />
          </div>
        </PlausibleProvider>
        </UserProvider>
      </SWRConfig>
    </>
  );
}

export default MyApp;
