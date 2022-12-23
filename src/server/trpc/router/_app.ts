import { router } from "../trpc";
import { singUpRouter } from "./singup";

export const appRouter = router({
  singup: singUpRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
