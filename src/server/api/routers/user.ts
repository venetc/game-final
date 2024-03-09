import { faker } from "@faker-js/faker/locale/ru";
import { TRPCError } from "@trpc/server";

import { hash, verify } from "argon2";

import { z } from "zod";

import { sendAccountConfirm } from "@server/email";
import { Encrypter } from "@server/utils/decryptor";
import { userCreateSchema, userPasswordChangeSchema } from "@server/utils/validators";
import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
export const userRouter = createTRPCRouter({
  changePassword: publicProcedure
    .input(userPasswordChangeSchema)
    .meta({ description: "Change user password" })
    .mutation(async ({ input, ctx }) => {
      const { password, passwordConfirm, requestId } = input;

      if (password.trim() !== passwordConfirm.trim()) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Пароли не совпадают",
        });
      }

      const user = await ctx.prisma.$transaction(async (client) => {
        const request = await client.resetPasswordRequest.findUnique({
          where: { id: requestId },
        });

        if (!request) return;

        const requestUser = await client.user.findUnique({
          where: { email: request.email },
        });

        return requestUser;
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Пользователь с этим email не найден",
        });
      }

      const isOldPasswordUsed = await verify(user.password, password, {
        type: 1,
      });

      if (isOldPasswordUsed) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Новый пароль должен отличаться от старого",
        });
      }

      const hashedPassword = await hash(password, { type: 1 });
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return {
        status: 201,
        message: "Пароль успешно изменен!",
      };
    }),
  create: publicProcedure
    .input(userCreateSchema)
    .meta({ description: "Create user" })
    .mutation(async ({ input, ctx }) => {
      const { email, password, roleId, name } = input;

      const existingUser = await ctx.prisma.user.findFirst({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
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
          code: "NOT_FOUND",
          message: "Такой роли не существует",
        });
      }

      const hashedPassword = await hash(password, { type: 1 });

      const user = await ctx.prisma.user.create({
        data: {
          password: hashedPassword,
          roleId,
          email: email.toLowerCase(),
          ...(name && { name }),
        },
      });

      const token = Encrypter.encrypt(user.email.toLowerCase());

      await sendAccountConfirm({
        language: "ru",
        user: {
          name: user.name,
          email: user.email.toLowerCase(),
          roleName: desiredRole.name,
        },
        link: `http://localhost:3000/auth/verification?token=${token}`,
      });

      return {
        status: 201,
        message: "Аккаунт успешно создан! Подтвердите email, перейдя по ссылке из письма",
        result: user.email.toLowerCase(),
      };
    }),
  seed: publicProcedure
    .input(
      z.object({
        secret: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.secret !== "pituh") throw new TRPCError({ code: "BAD_REQUEST", message: "Иди на*уй с таким паролем" });

      type SeededUser = Record<string, { name: string | undefined; email: string; password: string; roleId: number; emailConfirmed: boolean; isApproved: boolean }>;

      const users = {} as SeededUser;

      for (let index = 0; index < 50; index++) {
        const name = faker.helpers.maybe(() => faker.name.fullName());
        const email = faker.internet.email().toLowerCase();
        const password = await hash("hehe", { type: 1 });
        const roleId = faker.datatype.number({ min: 1, max: 3 });
        const emailConfirmed = !!faker.helpers.maybe(() => true);
        const isApproved = emailConfirmed ? !!faker.helpers.maybe(() => true, { probability: 0.75 }) : false;

        users[email] = { name, email, password, roleId, emailConfirmed, isApproved };
      }
      const result = Object.values(
        Object.values(users).reduce(
          (acc, obj) => ({ ...acc, [obj.name ?? obj.email]: obj }),
          {} as SeededUser
        )
      );

      const usersFromDB = await ctx.prisma.user.createMany({
        data: result,
      });

      return { length: usersFromDB, users: result };
    }),
});
