import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { Icon } from "~/components/Icons";

const MotionLink = motion(Link);

export const Header = ({ name }: { name: string }) => {
  return (
    <div className="w-full bg-[url(/img/pinkBg.avif),url(/img/pinkBg.webp)] [background-position:center_30%]">
      <header className="h-24 flex items-center mx-auto px-12">
        <h1 className="[filter:url(#outline)] uppercase inline tracking-wider text-7xl text-white">
          {name}
        </h1>
        <MotionLink
          to="/"
          whileHover={{
            scale: 1.1,
          }}
          className="ml-auto bg-pepe p-3"
        >
          <Icon name="back" className="w-4 h-4 stroke-[3]" />
        </MotionLink>
      </header>
    </div>
  );
};
