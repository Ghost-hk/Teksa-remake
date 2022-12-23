import Head from "next/head";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";

import HomePageForNewUser from "../Components/HomePage/HomePageForNewUser";
import HomepageForLoggedUser from "../Components/HomePage/HomePageForLoggedUser";

const Home: NextPage = () => {
  const { data, status } = useSession();
  return (
    <div className="">
      <Head>
        <title>Teksa</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {status === "loading" ? null : data ? (
        <HomepageForLoggedUser />
      ) : (
        <HomePageForNewUser />
      )}
    </div>
  );
};

export default Home;
