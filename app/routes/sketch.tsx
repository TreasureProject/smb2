import { useLocation } from "@remix-run/react";
import { motion } from "framer-motion";

export default function Sketch() {
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
        scale: 0,
        opacity: 0,
      }}
      transition={{
        duration: 5,
        ease: "easeOut",
      }}
      className="h-full bg-red-500"
    >
      <div>hellow wolrldldl</div>
    </motion.div>
  );
}
