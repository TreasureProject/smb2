import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { Icon } from "~/components/Icons";
import { useState } from "react";

const MotionLink = motion(Link);

export const Header = ({ name }: { name: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="w-full bg-[url(/img/pinkBg.avif),url(/img/pinkBg.webp)] [background-position:center_30%]">
      <header className="mx-auto flex h-16 items-center px-8 sm:h-24 sm:px-12">
        <h1 className="inline uppercase tracking-wider text-white text-4xl [filter:url(#outline)] sm:text-7xl">
          {name}
        </h1>
        <MotionLink
          to="/"
          initial={false}
          animate={{ scale: hovered ? 1.2 : 1 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="ml-auto bg-pepe p-2.5 sm:p-3"
        >
          <Icon name="back" className="h-3 w-3 stroke-[3] sm:h-4 sm:w-4" />
        </MotionLink>
      </header>
    </div>
  );
};
