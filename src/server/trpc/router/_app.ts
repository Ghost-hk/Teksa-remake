import { router } from "../trpc";
import { authRouter } from "./auth";
import { singUpRouter } from "./singup";

export const appRouter = router({
  auth: authRouter,
  singup: singUpRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
