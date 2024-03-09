import Head from "next/head";

import { PasswordResetPage } from "@client/pages/auth/password-reset";

import { BaseLayout } from "@client/widgets/layouts/base-layout";

import type { NextPageWithLayout } from "../../_app";

import type { ReactNode } from "react";

const PasswordReset: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Смена пароля</title>
        <meta name="description" content="Смена пароля" />
      </Head>

      <PasswordResetPage />
    </>
  );
};

PasswordReset.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;

export default PasswordReset;
