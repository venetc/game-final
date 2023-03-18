import { Prisma, type User } from "@prisma/client";
import type {
  NextPage,
  GetServerSidePropsContext,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { prisma } from "src/server/db";

type PaswordlessUser = Pick<User, "id" | "email" | "name" | "roleId"> & {
  createdAt: string;
};

export const getServerSideProps: GetServerSideProps<{
  user: PaswordlessUser | null;
}> = async (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;

  const tokenString = Array.isArray(query.token) ? query.token[0] : query.token;

  if (!tokenString) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const emailFromQuery = Buffer.from(tokenString, "base64url").toString("utf8");

  const paswordlessUser = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    email: true,
    role: true,
    roleId: true,
    createdAt: true,
  });

  const user = await prisma.user.findFirst({
    where: { email: emailFromQuery },
    select: paswordlessUser,
  });

  return {
    props: {
      user: user ? { ...user, createdAt: user.createdAt.toISOString() } : null,
    },
  };
};

const VerificationPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
  return (
    <>
      <Head>
        <title>Подтверждение email</title>
        <meta name="Подтверждение email" content="Подтверждение email" />
      </Head>
      <div>
        <pre>{user && JSON.stringify(user, null, 2)}</pre>
      </div>
    </>
  );
};

export default VerificationPage;
