import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { roleRouter } from "./routers/role";

export const appRouter = createTRPCRouter({
  user: userRouter,
  role: roleRouter,
});

export type AppRouter = typeof appRouter;
