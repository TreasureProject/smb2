import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { Icon } from "~/components/Icons";
import { useState } from "react";

const MotionLink = motion(Link);

export const Header = ({ name }: { name: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="w-full bg-[url(/img/pinkBg.avif),url(/img/pinkBg.webp)] [background-position:center_30%]">
      <header className="mx-auto flex h-24 items-center px-12">
        <h1 className="inline uppercase tracking-wider text-white text-7xl [filter:url(#outline)]">
          {name}
        </h1>
        <MotionLink
          to="/"
          initial={false}
          animate={{ scale: hovered ? 1.2 : 1 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="ml-auto bg-pepe p-3"
        >
          <Icon name="back" className="h-4 w-4 stroke-[3]" />
        </MotionLink>
      </header>
    </div>
  );
};
