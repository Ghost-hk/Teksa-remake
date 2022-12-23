import Head from "next/head";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";

import HomePageForNewUser from "../Components/HomePage/HomePageForNewUser";

const Home: NextPage = () => {
  const { data } = useSession();

  return (
    <div className="bg-white">
      <Head>
        <title>Teksa</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {data ? <HomePageForNewUser /> : null}
    </div>
  );
};

export default Home;
