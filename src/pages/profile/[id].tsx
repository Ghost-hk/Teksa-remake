import { trpc } from "../../utils/trpc";
// import { useSession } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

import moment from "moment";

import ItemCard, { ItemCardSkeleton } from "../../Components/Item/ItemCard";

const ProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;
  // const { data: session } = useSession();

  const { data: profile, isLoading } =
    trpc.profile.getProfileDataByUserId.useQuery(
      { userId: id as string },
      { enabled: !!id, refetchOnWindowFocus: false }
    );

  // if (profile?.email === session?.user?.email) {
  //   router.push("/profile");
  // }

  if (isLoading) {
    return (
      <div className="mx-3 mt-5 md:mx-5 lg:mx-6 ">
        <div className="gap-6 md:flex">
          <div className="w-full  self-start rounded-md bg-white px-3 py-4 shadow-md md:mb-0 md:max-w-xs">
            <div className=" animate-pulse">
              {/* Image and user Name */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-slate-700"></div>
                <div className="mt-2 h-3 w-28 rounded-full bg-slate-700"></div>
              </div>

              {/* User info */}
              <div className="flex  gap-2">
                <div className="mt-4 w-full">
                  <div className="h-4 w-full rounded-full bg-slate-700"></div>
                  <div className="mt-2 h-4 w-full rounded-full bg-slate-700"></div>
                  <div className="mt-2 h-4 w-full rounded-full bg-slate-700"></div>
                  <div className="mt-2 h-4 w-full rounded-full bg-slate-700"></div>
                </div>
                <div className="mt-4 w-full">
                  <div className="h-4 w-full rounded-full bg-slate-700"></div>
                  <div className="mt-2 h-4 w-full rounded-full bg-slate-700"></div>
                  <div className="mt-2 h-4 w-full rounded-full bg-slate-700"></div>
                  <div className="mt-2 h-4 w-full rounded-full bg-slate-700"></div>
                </div>
              </div>
            </div>
          </div>
          {/* posts */}
          <div className="mt-4 w-full rounded-md bg-white px-3 py-4 shadow-md md:mt-0">
            <h2 className="text-lg font-semibold text-gray-800">My Posts</h2>
            <div className="grid animate-pulse grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div className="mt-3 overflow-hidden rounded-md border ">
                <ItemCardSkeleton />
              </div>
              <div className="mt-3 overflow-hidden rounded-md border ">
                <ItemCardSkeleton />
              </div>
              <div className="mt-3 overflow-hidden rounded-md border ">
                <ItemCardSkeleton />
              </div>
              <div className="mt-3 overflow-hidden rounded-md border ">
                <ItemCardSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return <div>Profile not found</div>;

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
              </div>
              <div className="flex flex-col text-gray-800">
                <p>{profile.email || "-"}</p>
                <p>{profile.location || "-"}</p>
                <p>{profile.phone || "-"}</p>
                <p>{profile.instagram || "-"}</p>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="w-full rounded-md bg-white px-3 py-4 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">My Posts</h2>
            {profile.posts && profile.posts?.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {profile.posts?.map((post) => (
                  <div
                    className="mt-3 overflow-hidden rounded-md border border-gray-400"
                    key={post.id}
                  >
                    <ItemCard item={post} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-16 text-center text-lg font-semibold text-gray-800">
                No posts yet
                <br />
                <Link
                  href="/item/add"
                  className="mt w-full text-center text-base font-semibold text-violet-600 underline"
                >
                  Add a post
                </Link>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
