import { emailRouter } from "./routers/email";
import { roleRouter } from "./routers/role";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  role: roleRouter,
  email: emailRouter,
});

export type AppRouter = typeof appRouter;
