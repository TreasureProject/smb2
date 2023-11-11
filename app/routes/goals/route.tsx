import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";
import { ClientOnly } from "remix-utils/client-only";
import PencilMonke from "./assets/PencilMonke.webp";

export default function Goals() {
  const navigate = useNavigate();

  return (
    <ClientOnly>
      {() => (
        <Dialog.Root
          open={true}
          aria-label="What's Next"
          onOpenChange={(open) => {
            if (!open) navigate(-1);
          }}
        >
          <Dialog.Portal forceMount>
            <Dialog.Content asChild forceMount>
              <motion.div
                style={{
                  transform: "translate3d(0, 0, 0)",
                  left: "50%",
                  top: "50%"
                }}
                initial={{
                  scale: 0,
                  opacity: 0,
                  left: "50%",
                  top: "50%",
                  transform: "translate(0%, -999%)"
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transform: "translate(-50%, -50%)"
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  transform: "translate(0, 999%)"
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="fixed z-50 flex h-2/3 w-full max-w-xs flex-col gap-12 border border-vroom bg-grayTwo shadow-lg before:absolute before:bottom-0 before:left-6 before:top-0 before:block before:border-l before:border-rage before:content-[''] sm:max-w-2xl md:w-full"
              >
                <Dialog.Title className="relative -mb-14 ml-8 mt-4 flex flex-col font-bold italic font-chad text-7xl">
                  <span className="text-xl">What's</span>
                  <span>Next</span>
                  <img
                    src={PencilMonke}
                    className="absolute -bottom-4 left-32 h-auto w-24"
                    alt="Pencil Monke"
                  />
                </Dialog.Title>
                <div className="absolute right-0 top-6 [perspective:500px]">
                  <div className="relative flex flex-col bg-pepe px-4 py-2 font-lazer before:absolute before:-bottom-0.5 before:left-0 before:-z-10 before:block before:h-4 before:w-full before:skew-y-3 before:bg-gray-500 after:absolute after:left-full after:top-0 after:-z-10 after:block after:h-full after:w-4 after:bg-[#CACF20] after:content-[''] after:[transform-origin:center_left] after:[transform:rotateY(70deg)_skewY(20deg)]">
                    <span className="text-xs">LAST UPDATED:</span>
                    <span className="text-2xl">10/06/2023</span>
                  </div>
                </div>
                <div className="flex-[1_1_0] overflow-y-auto">
                  <ul className="font-neuebit relative flex flex-col font-bold text-fud before:absolute before:bottom-0 before:left-6 before:top-0 before:block before:border-l before:border-rage before:content-['']">
                    <li className="px-8 pb-[1.2rem]"></li>
                    <li className="border-t border-vroom px-8 py-[1.2rem]"></li>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <li key={i} className="border-t border-vroom px-8 py-2">
                        Lorem ipsum dolor sit amet consectetur
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </ClientOnly>
  );
}
