import { useLocation } from "@remix-run/react";
import { motion } from "framer-motion";
import { cn } from "~/utils";

export const AnimationContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { state } = useLocation();

  return (
    <motion.div
      style={{
        zIndex: 10,
        position: "absolute",
        inset: 0,
      }}
      initial={{
        scale: 0,
        opacity: 0,
        transformOrigin: state?.transformOrigin || "50% 50%",
      }}
      animate={{ scale: 1, left: 0, top: 0, opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 0,
      }}
      className={cn("h-full", className)}
    >
      {children}
    </motion.div>
  );
};
