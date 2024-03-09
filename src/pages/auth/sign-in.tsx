import Head from "next/head";

import { SignInPage } from "@client/pages/auth";
import { BaseLayout } from "@client/widgets/layouts/base-layout";

import type { NextPageWithLayout } from "../_app";

import type { ReactNode } from "react";

const SignIn: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Авторизация</title>
        <meta name="description" content="Авторизация" />
      </Head>

      <SignInPage />
    </>
  );
};

SignIn.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>;

export default SignIn;
