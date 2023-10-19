import { useLocation } from "@remix-run/react";
import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "~/utils";

export const AnimationContainer = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>((props, ref) => {
  const { state } = useLocation();

  return (
    <motion.div
      ref={ref}
      style={{
        // zIndex: 10,
        // position: "absolute",
        // inset: 0,
        // transform: "translate3d(0, 0, 0)",
        ...props.style
      }}
      initial={{
        scale: 0,
        opacity: 0,
        transformOrigin: state?.transformOrigin || "50% 50%"
      }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 0
      }}
      className={cn("min-h-full", props.className)}
    >
      {props.children}
    </motion.div>
  );
});

AnimationContainer.displayName = "AnimationContainer";
