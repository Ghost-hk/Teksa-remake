import { type FC, useState, useEffect, useRef } from "react";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";

import Link from "next/link";
import Image from "next/image";

import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

interface DesktopNavbarComponentsProps {
  visible: boolean;
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

export const DesktopNavbarComponents: FC<DesktopNavbarComponentsProps> = ({
  visible,
  data,
  status,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(visible && ((prev) => prev));
  }, [visible]);

  useEffect(() => {
    const handelClose = (e: MouseEvent) => {
      if (!dropdown.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handelClose);

    return () => document.removeEventListener("mousedown", handelClose);
  });

  return (
    <div className="hidden md:block">
      {status === "loading" ? null : data ? (
        <div className="flex">
          <Link
            href="/item/add"
            className="mr-4 rounded-md border-2 border-violet-600 px-3 py-1 text-base font-semibold text-violet-600"
          >
            Add Item
          </Link>
          {/* Username & Image */}
          <div className="flex items-center">
            <span className="mr-2 text-base font-semibold text-gray-800">
              {data.user?.name}
            </span>

            {/* Image + Dropdown */}
            <div className="relative" ref={dropdown}>
              <div
                className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-teal-400"
                onClick={() => setOpen(!open)}
              >
                {data.user?.image ? (
                  <Image src={data.user?.image} alt="user" fill />
                ) : (
                  <span className="text-lg font-semibold text-white">
                    {data.user?.name?.split("")[0]}
                  </span>
                )}
              </div>

              {/* Dropdown */}
              <div
                className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-200 px-4 py-2  ${
                  open ? "block" : "hidden"
                }`}
              >
                <div className="py-1">
                  <CgProfile className="mr-3 inline-block h-6 w-6 text-gray-600" />
                  <Link href="#" className="font-normal text-gray-800">
                    Profile
                  </Link>
                </div>
                <div className="cursor-pointer pb-1">
                  <FiLogOut className="mr-3 inline-block h-6 w-6 text-gray-600" />
                  <span
                    onClick={() => signOut()}
                    className="font-normal text-gray-800"
                  >
                    Sign Out
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex">
          <Link
            href="/signin"
            className="mr-4 rounded-md border-2 border-violet-600 px-3 py-1 text-lg font-semibold text-violet-600"
          >
            Sing In
          </Link>
          <Link
            href="/signup"
            className="rounded-md border-2 border-violet-600 bg-violet-600 px-3 py-1 text-lg font-semibold text-white"
          >
            Sing Up
          </Link>
        </div>
      )}
    </div>
  );
};
