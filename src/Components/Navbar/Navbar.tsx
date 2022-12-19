import { FC, useState } from "react";
import Sidebar from "./Sidebar";

import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import Search from "./Search";
interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const [slidebarIsOpen, setSlidebarIsOpen] = useState<boolean>(false);
  const [searchIsOpen, setSearchIsOpen] = useState<boolean>(false);
  return (
    <>
      <nav className="sticky top-0 z-10 flex w-full justify-between bg-white px-3 py-6 drop-shadow-lg">
        {/* Menu */}
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
        {/* Search */}
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

        <Search searchIsOpen={searchIsOpen} setSearchIsOpen={setSearchIsOpen} />
      </nav>
      <Sidebar
        slidebarIsOpen={slidebarIsOpen}
        setSlidebarIsOpen={setSlidebarIsOpen}
      />
    </>
  );
};

export default Navbar;
