import { Prisma } from "@prisma/client";

import Head from "next/head";

import { VerificationPage, type VerificationPageProps } from "@client/pages/auth";
import { BaseLayout } from "@client/widgets/layouts/base-layout";
import { prisma } from "src/server/db";
import { Encrypter } from "src/utils/decryptor";

import type { NextPageWithLayout } from "../_app";
import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import type { ReactNode } from "react";

export const getServerSideProps: GetServerSideProps<VerificationPageProps> = async (ctx: GetServerSidePropsContext) => {
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

  const paswordlessUser = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    email: true,
    role: true,
    roleId: true,
    createdAt: true,
    isApproved: true,
    emailConfirmed: true,
  });

  try {
    const emailFromQuery = Encrypter.decrypt(tokenString);

    const user = await prisma.user.findFirst({
      where: { email: emailFromQuery },
      select: paswordlessUser,
    });

    if (!user) {
      return {
        props: {
          isError: true,
          errorMessage: `Не&nbsp;удалось найти пользователя с&nbsp;этим email. Скопируйте красный текст и&nbsp;отправьте одному из&nbsp;разработчиков. <span class="text-red-500 mt-3 break-words block">${tokenString}</span>`,
        },
      };
    }

    /* TODO: Перенести патч поумнее */
    if (!user.emailConfirmed) {
      await prisma.user.update({
        where: { email: emailFromQuery },
        data: { emailConfirmed: true },
      });
    }

    if (user.isApproved) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {
        isError: false,
        user: { ...user, createdAt: user.createdAt.toISOString() },
      },
    };
  } catch {
    return {
      props: {
        isError: true,
        errorMessage: `Не&nbsp;удалось найти пользователя с&nbsp;этим email. Скопируйте красный текст и&nbsp;отправьте одному из&nbsp;разработчиков. <span class="text-red-500 mt-3 break-words block">${tokenString}</span>`,
      },
    };
  }
};

const Verification: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  /* TODO: Добавить возможность указать имя, если все ок */
  return (
    <>
      <Head>
        <title>Подтверждение email</title>
        <meta name="Подтверждение email" content="Подтверждение email" />
      </Head>

      <VerificationPage {...props} />
    </>
  );
};

Verification.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;

export default Verification;
