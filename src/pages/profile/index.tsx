import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

import moment from "moment";

import { FiEdit } from "react-icons/fi";
import ItemCard from "../../Components/Item/ItemCard";

const ProfilePage = () => {
  const router = useRouter();

  const { data: session, status } = useSession();
  const { data: profile, isLoading } =
    trpc.profile.getProfileDataByUserId.useQuery(
      { userId: session?.user?.id as string },
      { enabled: !!session?.user?.id }
    );

  if (status === "unauthenticated") {
    return router.push("/signin");
  }

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-3 mt-5 md:mx-5 lg:mx-6 ">
      <Head>
        <title>Profile</title>
      </Head>
      {profile && (
        <div className="gap-6 md:flex">
          {/* Profile info */}
          <div className="mb-3 w-full self-start rounded-md bg-white  px-3 py-4 shadow-md md:mb-0 md:max-w-xs">
            <div className="mb-4  flex flex-col items-center">
              {/* user Image */}
              <div
                className={`relative mr-2 h-16 w-16 rounded-full bg-red-400
                  ${!profile.image && "flex items-center justify-center"}`}
              >
                {profile.image ? (
                  <Image
                    src={profile.image}
                    fill
                    alt="profile Img"
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-sm text-white">
                    {profile.name?.split("")[0]?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* user name */}
              <div className="mt-3 flex flex-col items-center ">
                <p className="cursor-pointer text-lg font-semibold text-gray-800">
                  {profile.name}
                </p>
                <p className="text-sm text-gray-400">Have been a user since:</p>
                <p className="text-sm text-gray-400">
                  {moment(profile.createdAt).format("MMMM YYYY")}
                </p>
              </div>
            </div>

            {/* user info */}
            <div className="flex justify-center gap-2">
              <div className="flex flex-col capitalize text-gray-800">
                <p>email:</p>
                <p>location:</p>
                <p>phone:</p>
                <p>instagram:</p>
                <p>facebook:</p>
              </div>
              <div className="flex flex-col text-gray-800">
                <p>{profile.email || "-"}</p>
                <p>{profile.location || "-"}</p>
                <p>{profile.phone || "-"}</p>
                <p>{profile.instagram || "-"}</p>
                <p>{profile.facebook || "-"}</p>
              </div>
            </div>

            <div className="flex w-full justify-end ">
              <Link
                href="#"
                className="mt-3 flex items-center font-medium text-violet-600 underline"
              >
                Edit Profile <FiEdit className="ml-1" />
              </Link>
            </div>
          </div>

          {/* Posts */}
          <div className="w-full rounded-md bg-white px-3 py-4 shadow-md">
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {profile.posts.map((post) => (
                <div
                  className="mt-3 overflow-hidden rounded-md border border-gray-400"
                  key={post.id}
                >
                  <ItemCard item={post} editAndDeleteBtns />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
