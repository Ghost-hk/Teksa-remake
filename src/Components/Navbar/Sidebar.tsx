import { Dispatch, FC, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  slidebarIsOpen: Boolean;
  setSlidebarIsOpen: Dispatch<SetStateAction<Boolean>>;
}

const Sidebar: FC<SidebarProps> = ({ slidebarIsOpen, setSlidebarIsOpen }) => {
  return (
    <AnimatePresence>
      {slidebarIsOpen && (
        <>
          <motion.div
            key="1"
            onClick={() => setSlidebarIsOpen((prev: any) => !prev)}
            className="absolute h-full w-full bg-slate-300 opacity-50"
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
            className="fixed top-[84px] left-0 h-full w-1/3 bg-white"
          >
            Sidebar
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
