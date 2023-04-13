import { sendPasswordReset } from "src/email/sendPasswordReset";
import { Encrypter } from "src/utils/decryptor";
import { sendPasswordResetSchema } from "src/utils/validators";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const emailRouter = createTRPCRouter({
  sendPasswordResetLink: publicProcedure
    .input(sendPasswordResetSchema)
    .meta({ description: "Get all rules including permissions" })
    .mutation(async ({ input, ctx }) => {
      const { email } = input;

      const user = await ctx.prisma.user.findFirst({
        where: { email },
        include: { role: true },
      });

      if (user) {
        const token = Encrypter.encrypt(user.email, "harius");

        console.log(token);

        await sendPasswordReset({
          language: "ru",
          user: {
            name: user.name,
            email: user.email,
            roleName: user.role.name,
          },
          link: `http://localhost:3000/auth/reset?token=${token}`,
        });
      }

      return {
        status: 201,
        message:
          "Если пользователь с этим email существует, то он получит письмо с ссылкой на восстановление пароля",
      };
    }),
});
