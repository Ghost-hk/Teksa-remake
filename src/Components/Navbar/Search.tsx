import { Dispatch, FC, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SearchProps {
  searchIsOpen: boolean;
  setSearchIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Search: FC<SearchProps> = ({ searchIsOpen, setSearchIsOpen }) => {
  return (
    <AnimatePresence>
      {searchIsOpen && (
        <motion.div
          key="2"
          initial={{ translateY: "-100%", opacity: 0 }}
          animate={{ translateY: "0", opacity: 1 }}
          exit={{ translateY: "-100%", opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-[84px] left-0 z-30 h-8 w-full bg-red-300"
        >
          Search
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Search;
