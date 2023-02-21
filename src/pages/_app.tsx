import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Nunito, Fira_Sans, Rubik } from "@next/font/google";
import { api } from "../utils/api";

import "../styles/globals.css";

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

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={`${nunito.variable} ${fira.variable} ${rubik.variable}`}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
