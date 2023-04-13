import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { sendAccountConfirm } from "src/email/sendAccountConfirm";
import { Encrypter } from "src/utils/decryptor";
import { userCreateSchema } from "src/utils/validators";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(userCreateSchema)
    .meta({ description: "Create user" })
    .mutation(async ({ input, ctx }) => {
      const { email, password, roleId, name } = input;

      const existingUser = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        if (!existingUser.emailConfirmed) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Аккаунт с этим email был зарегестрирован, но email не был подтвержден. Подтвердите email, перейдя по ссылке из письма, высланного на эту почту",
          });
        }

        if (existingUser.emailConfirmed && !existingUser.isApproved) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Ваш email подтвержден, аккаунт станет доступен после проверки администратором",
          });
        }

        throw new TRPCError({
          code: "CONFLICT",
          message: "Пользователь с таким email уже существует",
        });
      }

      if (name) {
        const userWithSameName = await ctx.prisma.user.findFirst({
          where: { name },
        });

        if (userWithSameName) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Пользователь с таким именем уже зарегестрирован",
          });
        }
      }

      const desiredRole = await ctx.prisma.role.findFirst({
        where: { id: roleId },
      });

      if (!desiredRole) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Такой роли не существует",
        });
      }

      const hashedPassword = await hash(password, { type: 1 });

      const user = await ctx.prisma.user.create({
        data: {
          password: hashedPassword,
          roleId,
          email,
          ...(name && { name }),
        },
      });

      const token = Encrypter.encrypt(user.email);

      await sendAccountConfirm({
        language: "ru",
        user: {
          name: user.name,
          email: user.email,
          roleName: desiredRole.name,
        },
        link: `http://localhost:3000/auth/verification?token=${token}`,
      });

      return {
        status: 201,
        message:
          "Аккаунт успешно создан! Подтвердите email, перейдя по ссылке из письма",
        result: user.email,
      };
    }),
});
