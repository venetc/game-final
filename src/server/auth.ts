import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "../utils/validators";
import { verify } from "argon2";
import type { RoleEnum } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: RoleEnum;
    } & DefaultSession["user"];
  }

  interface User {
    role: RoleEnum;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: RoleEnum;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    /* maxAge: 15 * 24 * 30 * 60, */ // 15 days
    maxAge: 2 * 60, // 15 days
  },
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
        // console.log("credentials", credentials);

        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          const result = await prisma.user.findFirst({
            where: { email },
          });

          if (!result) return null;

          const isValidPassword = await verify(result.password, password, {
            type: 1,
          });

          if (!isValidPassword) return null;

          return Promise.resolve({
            id: result.id,
            email: result.email,
            role: result.role,
          });
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.email = user.email;
        token.role = user.role;
      }

      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.email = token.email;
        session.user.role = token.role;
      }

      // console.log("session", session);
      // console.log("token", token);

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
