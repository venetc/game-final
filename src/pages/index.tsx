import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home page</title>
        <meta name="description" content="Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <div>Home page</div>
        <ul>
          <li>
            <Link href="/auth/sign-up">Sign Up</Link>
          </li>
          <li>
            <Link href="/auth/sign-in">Sign In</Link>
          </li>
          <li>
            <div onClick={() => signOut()}>Sign Out</div>
          </li>
        </ul>
      </>
    </>
  );
};

export default Home;
