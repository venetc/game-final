import "../styles/globals.css";

import { Fira_Sans, Nunito, Rubik } from "next/font/google";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

const nunito = Nunito({
  variable: "--font-nunito",
  display: "swap",
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"],
});

const fira = Fira_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-fira",
  display: "swap",
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  display: "swap",
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"],
});

export type LayoutGetter = (page: ReactElement) => ReactNode;

export type NextPageWithLayout<TProps = Record<string, unknown>, TInitialProps = TProps> = NextPage<TProps, TInitialProps> & {
  getLayout?: LayoutGetter;
};

type SessionProp = { session: Session | null };

export type AppPropsWithLayout = AppProps<SessionProp> & {
  Component: NextPageWithLayout;
};

const getFallbackLayout: LayoutGetter = (page) => page;

const WrappedApp = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? getFallbackLayout;

  return (
    <>
      <style jsx global>{`
        :root {
          --font-nunito: ${nunito.style.fontFamily};
          --font-fira: ${fira.style.fontFamily};
          --font-rubik: ${rubik.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <div>{getLayout(<Component {...pageProps} />)}</div>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(WrappedApp);
