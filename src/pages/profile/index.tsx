import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { FiEdit } from "react-icons/fi";
import ItemCard from "../../Components/Item/ItemCard";
import type { Brand, Category, Images, Post, User } from "@prisma/client";

const ProfilePage = () => {
  const router = useRouter();

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [postIdToDelete, setPostIdToDelete] = useState<string | null>(null);
  const [items, setItems] = useState<
    | (Post & {
        user: User;
        images: Images[];
        brand: Brand[];
        category: Category[];
      })[]
    | undefined
  >();

  const { data: session, status } = useSession();
  const { mutateAsync: deletePostTRPC } = trpc.posts.deletePost.useMutation();
  const { data: profile, isLoading } =
    trpc.profile.getProfileDataByUserId.useQuery(
      { userId: session?.user?.id as string },
      { enabled: !!session?.user?.id, refetchOnWindowFocus: false }
    );

  useEffect(() => {
    if (profile && profile.posts.length > 0) {
      setItems(profile.posts);
    }
  }, [profile]);

  if (status === "unauthenticated") {
    return router.push("/signin");
  }

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  const handleDeletePost = async (postId: string) => {
    try {
      // deletePostTRPC({ postId }).then(() => {
      toast
        .promise(deletePostTRPC({ postId }), {
          loading: "Deleting...",
          success: "Deleted",
          error: "Error",
        })
        .then(() => {
          setItems((prev) => {
            return prev?.filter((item) => item.id !== postId);
          });
          setIsDeletePopupOpen(false);
          setPostIdToDelete(null);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-3 mt-5 md:mx-5 lg:mx-6 ">
      <Head>
        <title>Profile</title>
      </Head>
      <AnimatePresence>
        {isDeletePopupOpen && (
          <>
            <motion.div
              className="fixed top-0 bottom-0 right-0 left-0 z-10 bg-black opacity-20"
              onClick={() => setIsDeletePopupOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
            ></motion.div>
            <motion.div
              className={`fixed top-[45%]  right-[50%] z-20 h-36 w-[80%] translate-x-2/4 rounded-xl bg-white md:max-w-sm`}
              initial={{ scale: 0, x: "50%", y: 0 }}
              animate={{
                scale: 1,
                transition: { duration: 0.3 },
              }}
              exit={{ scale: 0 }}
            >
              <div className="flex h-full flex-col items-center justify-center">
                <p className="text-center text-lg font-semibold text-gray-800">
                  Are you sure you want to delete this item?
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                    onClick={() => {
                      postIdToDelete &&
                        handleDeletePost(postIdToDelete as string);
                    }}
                  >
                    Delete
                  </button>

                  <button
                    className="rounded-md bg-gray-500 px-4 py-2 text-sm font-semibold text-white"
                    onClick={() => setIsDeletePopupOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
            <h2 className="text-lg font-semibold text-gray-800">My Posts</h2>
            {items && items?.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items?.map((post) => (
                  <div
                    className="mt-3 overflow-hidden rounded-md border border-gray-400"
                    key={post.id}
                  >
                    <ItemCard
                      item={post}
                      editAndDeleteBtns
                      setIsDeletePopupOpen={setIsDeletePopupOpen}
                      setPostIdToDelete={setPostIdToDelete}
                    />
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
