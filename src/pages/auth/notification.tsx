import Head from "next/head";

import { getToken } from "next-auth/jwt";

import { NotificationPage } from "@client/pages/auth/notification";
import { BaseLayout } from "@client/widgets/layouts/base-layout";

import type { NextPageWithLayout } from "../_app";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next/types";
import type { ReactNode } from "react";

const Notification: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  const { token } = props;

  return (
    <>
      <Head>
        <title>Подтверждение email</title>
        <meta name="Подтверждение email" content="Подтверждение email" />
      </Head>

      <NotificationPage token={token} />
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const token = await getToken({ req, secret: "super-secret" });

  return { props: { token } };
};

Notification.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;

export default Notification;
