import type { Dispatch, FC, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Session } from "next-auth";

import Link from "next/link";
import Image from "next/image";

import { GrAdd } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";

interface SidebarProps {
  slidebarIsOpen: boolean;
  setSlidebarIsOpen: Dispatch<SetStateAction<boolean>>;
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

const Sidebar: FC<SidebarProps> = ({
  slidebarIsOpen,
  setSlidebarIsOpen,
  status,
  data,
}) => {
  return (
    <AnimatePresence>
      {slidebarIsOpen && (
        <>
          <motion.div
            key="1"
            onClick={() => setSlidebarIsOpen((prev) => !prev)}
            className="fixed top-0 z-40 h-full w-full bg-black opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            key="2"
            initial={{ translateX: "-100%" }}
            animate={{ translateX: "0" }}
            exit={{ translateX: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-[84px] left-0 z-40 h-full w-2/3 bg-white"
          >
            <>
              {status === "loading" ? null : data ? (
                <div className="mt-5 px-3">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-teal-400">
                        {data.user?.image ? (
                          <Image src={data.user?.image} alt="user" fill />
                        ) : (
                          <span className="text-lg font-semibold text-white">
                            {data.user?.name?.split("")[0]}
                          </span>
                        )}
                      </div>
                      <span className="mr-2 text-base font-semibold text-gray-800">
                        {data.user?.name}
                      </span>
                    </div>
                    <hr />
                    <Link
                      href="/profile"
                      onClick={() => setSlidebarIsOpen(false)}
                      className="my-3 flex items-center gap-2 text-lg font-semibold text-gray-800"
                    >
                      <CgProfile className="mr-3 inline-block h-6 w-6 text-gray-800" />
                      Profile
                    </Link>
                    <Link
                      href="/item/add"
                      onClick={() => setSlidebarIsOpen(false)}
                      className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800"
                    >
                      <GrAdd className="mr-3 inline-block h-6 w-6 " />
                      Add Item
                    </Link>
                    <hr />
                    <div
                      className="mt-3 flex cursor-pointer items-center gap-2 "
                      onClick={() => {
                        signOut();
                        setSlidebarIsOpen(false);
                      }}
                    >
                      <FiLogOut className="mr-3 inline-block h-6 w-6 text-gray-800" />
                      <span className="text-lg font-semibold text-gray-800">
                        Sign Out
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 px-3">
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/signin"
                      className="rounded-md border-2 border-violet-600 px-3 py-1 text-center text-lg font-semibold text-violet-600"
                      onClick={() => setSlidebarIsOpen(false)}
                    >
                      Sing In
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-md border-2 border-violet-600 bg-violet-600 px-3 py-1 text-center text-lg font-semibold text-white"
                      onClick={() => setSlidebarIsOpen(false)}
                    >
                      Sing Up
                    </Link>
                  </div>
                </div>
              )}
            </>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
