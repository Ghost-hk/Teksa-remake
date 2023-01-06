import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Roboto } from "@next/font/google";

import { trpc } from "../utils/trpc";

import Navbar from "../Components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";

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
        <Toaster
          toastOptions={{
            position: "top-center",
            style: { color: "#fff", fontSize: "1.2rem", fontWeight: 500 },
            success: {
              style: {
                background: "#22c55e",
                // color: "#fff",
                // fontSize: "1.2rem",
                // fontWeight: 500,
              },
            },
            error: {
              style: {
                background: "#dc2626",
                // color: "#fff",
                // fontSize: "1.2rem",
                // fontWeight: 500,
              },
            },
          }}
        />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
