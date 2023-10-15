import PlausibleProvider from "next-plausible";
import Head from "next/head";
import "../styles.css";
import "../tailwind.css";
import { trpc } from "../utils/trpc";
// Create a client
import { DndContext } from "@dnd-kit/core";

function MyApp({ Component, pageProps, config }) {
  return (
    <>
      <PlausibleProvider domain="imita.io">
        <Head>
          <meta property="og:site_name" content="Imita" />
        </Head>

        <div className="min-h-screen">
          <DndContext>
            <Component {...pageProps} />
          </DndContext>
        </div>
      </PlausibleProvider>
    </>
  );
}

export default trpc.withTRPC(MyApp);
