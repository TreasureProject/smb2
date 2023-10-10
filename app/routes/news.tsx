import * as Dialog from "@radix-ui/react-dialog";
import { useLocation, useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";
// import { Icon } from "~/components/Icons";

export default function News() {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <div>
      <Dialog.Root
        open={true}
        aria-label="Add invoice"
        onOpenChange={(open) => {
          if (open) return;
          navigate(-1);
        }}
      >
        <Dialog.Portal forceMount>
          <Dialog.Overlay asChild forceMount>
            <motion.div
              className="fixed inset-0 z-50 cursor-pointer bg-black/50 backdrop-blur-[10px]"
              style={{
                transform: "translate3d(0, 0, 0)",
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
              transition={{ duration: 0.4, ease: "easeInOut" }}
            ></motion.div>
          </Dialog.Overlay>
          <Dialog.Content asChild forceMount>
            <motion.div
              style={{
                transform: "translate3d(0, 0, 0)",
                left: "50%",
                top: "50%",
              }}
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                transform: "translate(-50%, -50%)",
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed z-50 h-72 overflow-hidden w-full max-w-lg gap-4 bg-grayTwo shadow-lg md:w-full flex flex-col"
            >
              <Dialog.Title className="font-chad font-bold italic text-7xl flex flex-col">
                <span className="text-xl">What's</span>
                <span>Next</span>
              </Dialog.Title>
              <div className="flex-[1_1_0] overflow-y-auto before:content-[''] before:h-full before:border-l before:border-rage before:block before:absolute before:left-6">
                <div className="flex flex-col">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div className="border-t border-vroom py-2 px-8">
                      {i + 1}. Lorem ipsum dolor sit amet consectetur
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
