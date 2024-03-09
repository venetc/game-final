import { add } from "date-fns";

import { createTRPCRouter, publicProcedure } from "../trpc";

import { sendPasswordReset } from "src/email/sendPasswordReset";
import { sendPasswordResetSchema } from "src/utils/validators";

import type { ResetPasswordRequest } from "@prisma/client";

export const emailRouter = createTRPCRouter({
  sendPasswordResetLink: publicProcedure
    .input(sendPasswordResetSchema)
    .meta({ description: "Send password reset email" })
    .mutation(async ({ input, ctx }) => {
      const { email } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { role: true },
      });

      if (!user) {
        return {
          status: 201,
          message: "Если пользователь с этим email существует, то он получит письмо с ссылкой на восстановление пароля",
        };
      }

      const previousRequests = await ctx.prisma.resetPasswordRequest.findMany({
        where: {
          email: user.email.toLowerCase(),
          expires: {
            gt: new Date(),
          },
        },
      });

      let passwordRequest: ResetPasswordRequest;

      if (previousRequests && previousRequests[0]) {
        passwordRequest = previousRequests[0];
      } else {
        const expiry = add(new Date(), { hours: 1 });
        const createdResetPasswordRequest = await ctx.prisma.resetPasswordRequest.create({
          data: {
            email: user.email.toLowerCase(),
            expires: expiry,
          },
        });
        passwordRequest = createdResetPasswordRequest;
      }

      const token = Buffer.from(passwordRequest.id).toString("base64url");

      await sendPasswordReset({
        language: "ru",
        user: {
          name: user.name,
          email: user.email.toLowerCase(),
          roleName: user.role.name,
        },
        link: `http://localhost:3000/auth/password-reset/${token}`,
      });

      return {
        status: 201,
        message: "Если пользователь с этим email существует, то он получит письмо с ссылкой на восстановление пароля",
      };
    }),
});
