import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import Head from "next/head";
import superjson from "superjson";

import { SignUpPage } from "@client/pages/auth";
import { BaseLayout } from "@client/widgets/layouts/base-layout";
import { appRouter } from "src/server/api/root";
import { prisma } from "src/server/db";

import type { NextPageWithLayout } from "../_app";
import type { InferGetStaticPropsType } from "next";
import type { ReactNode } from "react";

export const getStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma: prisma, session: null },
    transformer: superjson,
  });

  const roles = await ssg.role.getAll.fetch();

  return {
    props: { trpcState: ssg.dehydrate(), roles },
  };
};

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const SignUp: NextPageWithLayout<PageProps> = ({ roles }) => {
  return (
    <>
      <Head>
        <title>Регистрация</title>
        <meta name="description" content="Регистрация" />
      </Head>

      <SignUpPage roles={roles} />
    </>
  );
};

SignUp.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;

export default SignUp;
