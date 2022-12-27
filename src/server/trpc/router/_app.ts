import { router } from "../trpc";
import { singUpRouter } from "./singup";
import { testRout } from "./test";
import { postsRouter } from "./posts";

export const appRouter = router({
  singup: singUpRouter,
  test: testRout,
  posts: postsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
