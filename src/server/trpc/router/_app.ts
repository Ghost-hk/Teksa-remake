import { router } from "../trpc";
import { singUpRouter } from "./singup";
import { testRout } from "./test";
import { postsRouter } from "./posts";
import { profileRouter } from "./profile";

export const appRouter = router({
  singup: singUpRouter,
  test: testRout,
  posts: postsRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
