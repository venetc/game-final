import Head from "next/head";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { Button } from "@client/shared/ui/button";

import { SidebarLayout } from "@client/widgets/layouts/sidebar-layout";

import type { NextPageWithLayout } from "./_app";
import type { ReactNode } from "react";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Home page</title>
        <meta name="description" content="Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div>Home page</div>
        <ul>
          <li>
            <Link href="/auth/sign-up">Sign Up</Link>
          </li>
          <li>
            <Link href="/auth/sign-in">Sign In</Link>
          </li>
          <li>
            <Button className="m-3" variant={"default"} onClick={() => signOut({ redirect: true, callbackUrl: "/auth/sign-in" })}>
              Sign Out
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
};

Home.getLayout = (page: ReactNode) => (
  <SidebarLayout>
    <SidebarLayout.Sidebar>{<div>asd</div>}</SidebarLayout.Sidebar>
    <SidebarLayout.MainContent>{page}</SidebarLayout.MainContent>
  </SidebarLayout>
);

export default Home;
