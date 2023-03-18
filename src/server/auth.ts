import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import Credentials from "next-auth/providers/credentials";
import { env } from "../env/server.mjs";
import { type Role } from "@prisma/client";
import { userSighInSchema } from "src/utils/validators";
import { verify } from "argon2";

import { sendAccountConfirm } from "../email/sendAccountConfirm";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: Role;
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

          if (!result || !result.password) return null;

          const isValidPassword = await verify(result.password, password, {
            type: 1,
          });

          if (!isValidPassword) return null;

          return Promise.resolve({
            id: result.id,
            email: result.email,
            name: result.name,
            role: result.role,
          });
        } catch {
          return null;
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
    signIn: /* async */ (params) => {
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
        token.role = user.role;
        token.id = typeof user.id === "number" ? user.id : Number(user.id);
      }

      return Promise.resolve(token);
    },
    session: async (params) => {
      const { token, session } = params;

      session.user.role = token.role;
      session.user.id = token.id;

      return Promise.resolve(session);
    },
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
          destination: "/", // login path
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };
