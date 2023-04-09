import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import Credentials from "next-auth/providers/credentials";
import type { User as PrismaUser, Role } from "@prisma/client";
import { userSighInSchema } from "src/utils/validators";
import { verify } from "argon2";

import { z } from "zod";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      role: Role;
    } & DefaultSession["user"] &
      Pick<PrismaUser, "createdAt" | "emailConfirmed" | "isApproved">;
  }

  interface User {
    id: number;
    role: Role;
    createdAt: Date;
    emailConfirmed: boolean;
    isApproved: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: Role;
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
          const { email, password } = await userSighInSchema.parseAsync(
            credentials
          );

          const result = await prisma.user.findFirst({
            where: { email },
            include: { role: true },
          });

          if (!result) throw new Error("Неверный email или пароль!");

          const isValidPassword = await verify(result.password, password, {
            type: 1,
          });

          if (!isValidPassword) throw new Error("Неверный email или пароль!");

          return Promise.resolve({
            id: result.id,
            email: result.email,
            name: result.name,
            role: result.role,
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
        token.id = typeof user.id === "number" ? user.id : Number(user.id);
        token.role = user.role;
        token.email = user.email;
        token.createdAt = user.createdAt;
        token.emailConfirmed = user.emailConfirmed;
        token.isApproved = user.isApproved;
      }

      return Promise.resolve(token);
    },
    session: async (params) => {
      const { token, session } = params;

      session.user.id = token.id;
      session.user.role = token.role;
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

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
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
