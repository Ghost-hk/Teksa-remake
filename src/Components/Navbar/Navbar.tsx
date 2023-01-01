import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import Link from "next/link";

import Search from "./Search";
import Sidebar from "./Sidebar";

import { debounce } from "../../utils/debounce";

import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { FiSearch } from "react-icons/fi";

const Navbar = () => {
  const [slidebarIsOpen, setSlidebarIsOpen] = useState<boolean>(false);
  const [searchIsOpen, setSearchIsOpen] = useState<boolean>(false);
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);

  const { data, status } = useSession();


  const handleScroll = debounce(() => {
    const currentScrollPos = window.pageYOffset;

    setVisible(
      (prevScrollPos > currentScrollPos &&
        prevScrollPos - currentScrollPos > 20) ||
      currentScrollPos < 10
    );

    setPrevScrollPos(currentScrollPos);
  }, 100);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  return (
    <>
      <nav
        className={`sticky ${visible ? "top-0 shadow-gray-600 drop-shadow-xl" : "-top-24"
          } z-50 flex w-full justify-between bg-white px-3 py-6  transition-all duration-300 ease-in-out`}
      >
        {/* Menu Hidden in desktop */}
        <button
          className="md:hidden"
          onClick={() => {
            setSlidebarIsOpen((prev) => !prev);
            setSearchIsOpen(false);
          }}
        >
          {!slidebarIsOpen ? (
            <FiMenu className="text-3xl text-gray-600" />
          ) : (
            <MdClose className="text-3xl text-gray-600" />
          )}
        </button>

        {/* Logo */}
        <Link href="/">
          <span className="text-3xl font-semibold text-violet-600">Teksa</span>
        </Link>

        <button>{status === "loading" ? null : !data ? "loging" : "logout"}</button>

        {/* Search Hidden in desktop */}
        <button
          className="md:hidden"
          onClick={() => {
            setSearchIsOpen((prev) => !prev);
            setSlidebarIsOpen(false);
          }}
        >
          {!searchIsOpen ? (
            <FiSearch className="text-3xl text-gray-600" />
          ) : (
            <MdClose className="text-3xl text-gray-600" />
          )}
        </button>

        <Search searchIsOpen={searchIsOpen} />
      </nav>

      {/* the Mobile Slidbar */}
      <Sidebar
        slidebarIsOpen={slidebarIsOpen}
        setSlidebarIsOpen={setSlidebarIsOpen}
      />
    </>
  );
};

export default Navbar;
