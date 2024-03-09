import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { verify } from "argon2";

import { type DefaultSession, getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { z } from "zod";

import { prisma } from "src/server/db";
import { userSighInSchema } from "src/utils/validators";

import type { Role, User as PrismaUser } from "@prisma/client";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      role: Pick<Role, "id" | "name">;
      email: string;
      name?: string | null | undefined;
    } & Pick<PrismaUser, "createdAt" | "emailConfirmed" | "isApproved">;
  }

  interface User {
    id: number;
    role: Pick<Role, "id" | "name">;
    createdAt: Date;
    emailConfirmed: boolean;
    isApproved: boolean;
    email: string;
    name?: string | null | undefined;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: Pick<Role, "id" | "name">;
    createdAt: Date;
    emailConfirmed: boolean;
    isApproved: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  secret: "super-secret",
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await userSighInSchema.parseAsync(credentials);

          const result = await prisma.user.findFirst({
            where: { email },
            include: { role: true },
          });

          if (!result) throw new Error("Неверный email или пароль!");

          const isValidPassword = await verify(result.password, password, {
            type: 1,
          });

          if (!isValidPassword) throw new Error("Неверный email или пароль!");

          const { id, name } = result.role;

          return Promise.resolve({
            id: result.id,
            email: result.email,
            name: result.name,
            role: { id, name },
            createdAt: result.createdAt,
            isApproved: result.isApproved,
            emailConfirmed: result.emailConfirmed,
          });
        } catch (e) {
          if (e instanceof Error && e.message) {
            throw new Error(e.message);
          } else if (e instanceof z.ZodError) {
            throw new Error("Неверный email или пароль!");
          }
          throw new Error("Непредвиденная ошибка");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // in secons (30d)
    updateAge: 24 * 60 * 60, // in seconds (24h)
  },
  callbacks: {
    signIn: /* async */ (/* params */) => {
      // console.log("signIn params", params);
      /*  console.log("signIn callback", {
        user,
        account,
        profile,
        email,
        credentials,
      }); */

      /* await sendPasswordResetEmail({
        language: "ru",
        user: {
          name: "You",
          email: "markedone1992@gmail.com",
        },
        resetLink: "https://google.com/?q='hello'",
      }); */

      return true;
    },
    jwt: async (params) => {
      const { token, user } = params;
      // console.log("jwt params", params);
      if (user) {
        const { id, name } = user.role;

        token.id = typeof user.id === "number" ? user.id : Number(user.id);
        token.role = { id, name };
        token.email = user.email;
        token.createdAt = user.createdAt;
        token.emailConfirmed = user.emailConfirmed;
        token.isApproved = user.isApproved;
      }

      return Promise.resolve(token);
    },
    session: async (params) => {
      const { token, session } = params;
      const { id, name } = token.role;

      session.user.id = token.id;
      session.user.role = { id, name };
      session.user.createdAt = token.createdAt;
      session.user.isApproved = token.isApproved;
      session.user.emailConfirmed = token.emailConfirmed;

      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/auth/sign-up",
  },
};

export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

export const requireAuth = (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in", // login path
        permanent: false,
      },
    };
  }

  return await func(ctx);
};
