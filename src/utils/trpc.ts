import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../server/routers/appRouter";
import { isDevelopment } from "./env";

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  // @ts-ignore
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,

          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnMount: true,
            refetchOnWindowFocus: isDevelopment ? true : false,
            refetchOnReconnect: isDevelopment ? true : false,
            getNextPageParam: (_props: unknown) => {
              const props = _props as {
                nextCursor?: number;
              };
              return props.nextCursor;
            },
          },
          mutations: {
            retry: false,
            onError: (err: Error) => {
              alert("Error: " + err.message);
            },
          },
        },
      },
      transformer: superjson,
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});

import superjson from "superjson";
