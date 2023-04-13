import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { roleRouter } from "./routers/role";
import { emailRouter } from "./routers/email";

export const appRouter = createTRPCRouter({
  user: userRouter,
  role: roleRouter,
  email: emailRouter,
});

export type AppRouter = typeof appRouter;
