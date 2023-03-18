import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { IUserCreateSchema } from "../../../utils/validators";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  /* signup: publicProcedure
    .input(IUserCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Пользователь с таким email уже существует",
        });
      }

      const hashedPassword = await hash(password, { type: 1 });

      const result = await ctx.prisma.user.create({
        data: { email, password: hashedPassword, roleId: "" },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: result.email,
      };
    }) */
});
