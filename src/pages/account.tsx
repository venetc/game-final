import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { requireAuth } from "../server/auth";

export const getServerSideProps = requireAuth(async (ctx) => {
  return Promise.resolve({ props: { test: ctx.req.cookies } });
});

const Home: NextPage = () => {
  const { data } = useSession();

  return (
    <>
      <Head>
        <title>Secret page</title>
        <meta name="description" content="Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <div>Secret page</div>
        <pre>
          <code>{data && JSON.stringify(data, null, 2)}</code>
        </pre>
      </>
    </>
  );
};

export default Home;
