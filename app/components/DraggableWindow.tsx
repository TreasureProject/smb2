import { motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "./Icons";
import { cn } from "~/utils";

const Lines = () => (
  <div
    className="h-1 bg-white sm:w-24"
    style={{
      boxShadow: "1px 3px 0px -1px rgba(0, 0, 0, 0.5)"
    }}
  />
);

export const DraggableWindow = ({
  children,
  parentRef,
  className
}: {
  children: React.ReactNode;
  parentRef: React.MutableRefObject<HTMLDivElement | null>;
  className?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <motion.div
      drag
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      dragConstraints={parentRef}
      // dragMomentum={false}
      className={cn(
        "absolute flex flex-col border-2 bg-gray-300 py-2.5",
        className
      )}
      style={{
        filter: "url(#rgb-split)",
        zIndex: isDragging ? "9999" : "50",
        borderColor:
          "rgb(223, 223, 223) rgb(10, 10, 10) rgb(10, 10, 10) rgb(223, 223, 223)",
        boxShadow:
          "rgb(254, 254, 254) 1px 1px 0px 1px inset, rgb(132, 133, 132) -1px -1px 0px 1px inset"
      }}
    >
      <div className="flex justify-between px-2.5">
        <div className="flex gap-2">
          <div
            className="hidden border-2 p-1 sm:block"
            style={{
              borderColor:
                "rgb(223, 223, 223) rgb(10, 10, 10) rgb(10, 10, 10) rgb(223, 223, 223)",
              boxShadow:
                "rgb(254, 254, 254) 1px 1px 0px 1px inset, rgb(132, 133, 132) -1px -1px 0px 1px inset"
            }}
          >
            <Icon name="x" className="h-3 w-3 text-gray-500 sm:h-6 sm:w-6" />
          </div>
          <div className="flex flex-1">
            <div className="flex basis-full flex-col justify-between py-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Lines key={i} />
              ))}
            </div>
            <div></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-1">
            <div className="flex basis-full flex-col justify-between py-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Lines key={i} />
              ))}
            </div>
            <div></div>
          </div>
          <div
            className="hidden border-2 p-1 sm:block"
            style={{
              borderColor:
                "rgb(223, 223, 223) rgb(10, 10, 10) rgb(10, 10, 10) rgb(223, 223, 223)",
              boxShadow:
                "rgb(254, 254, 254) 1px 1px 0px 1px inset, rgb(132, 133, 132) -1px -1px 0px 1px inset"
            }}
          >
            <Icon name="x" className="h-3 w-3 text-gray-500 sm:h-6 sm:w-6" />
          </div>
          <div
            className="border-2 p-1"
            style={{
              borderColor:
                "rgb(223, 223, 223) rgb(10, 10, 10) rgb(10, 10, 10) rgb(223, 223, 223)",
              boxShadow:
                "rgb(254, 254, 254) 1px 1px 0px 1px inset, rgb(132, 133, 132) -1px -1px 0px 1px inset"
            }}
          >
            <Icon name="x" className="h-3 w-3 text-gray-500 sm:h-6 sm:w-6" />
          </div>
        </div>
      </div>
      <div className="mx-2.5 mt-2 border-2 border-black">{children}</div>
    </motion.div>
  );
};
