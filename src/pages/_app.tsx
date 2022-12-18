import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Roboto } from "@next/font/google";

import { trpc } from "../utils/trpc";

import Navbar from "../Components/Navbar/Navbar";

import "../styles/globals.css";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <Navbar />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
