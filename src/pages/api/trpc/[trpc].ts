import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers/appRouter";

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
  onError(err) {
    console.error(err);
  },
});

export const config = {
  api: {
    bodyParser: {
      // really high
      sizeLimit: "200mb",
    },
  },
};
