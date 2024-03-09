import Head from "next/head";

import { PasswordResetPageById } from "@client/pages/auth";

import { BaseLayout } from "@client/widgets/layouts/base-layout";

import { prisma } from "src/server/db";

import type { NextPageWithLayout } from "../../_app";

import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import type { ReactNode } from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const hashedId = context.params?.id;

  if (typeof hashedId !== "string") {
    return {
      notFound: true,
    };
  }

  const id = Buffer.from(hashedId, "base64url").toString("utf8");

  try {
    const resetPasswordRequest = await prisma.resetPasswordRequest.findUniqueOrThrow({
      where: { id },
      select: { id: true, expires: true },
    });

    return {
      props: {
        ...resetPasswordRequest,
        expires: resetPasswordRequest.expires.toString(),
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}

const PasswordReset: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  return (
    <>
      <Head>
        <title>Смена пароля</title>
        <meta name="description" content="Смена пароля" />
      </Head>

      {<PasswordResetPageById {...props} />}
    </>
  );
};

PasswordReset.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;

export default PasswordReset;
