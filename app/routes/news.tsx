import * as Dialog from "@radix-ui/react-dialog";
import { useLocation, useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";
import { ClientOnly } from "remix-utils/client-only";
// import { Icon } from "~/components/Icons";

export default function News() {
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
                  top: "50%",
                }}
                initial={{
                  scale: 0,
                  opacity: 0,
                  left: "50%",
                  top: "50%",
                  transform: "translate(0%, -999%)",
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transform: "translate(-50%, -50%)",
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  transform: "translate(0, 999%)",
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="fixed z-50 h-2/3 w-full border border-vroom gap-12 max-w-xs sm:max-w-2xl bg-grayTwo shadow-lg md:w-full flex flex-col"
              >
                <Dialog.Title className="ml-8 mt-4 -mb-14 font-chad font-bold italic text-7xl flex flex-col before:content-[''] before:top-0 before:bottom-0 before:border-l before:border-rage before:block before:absolute before:left-6">
                  <span className="text-xl">What's</span>
                  <span>Next</span>
                </Dialog.Title>
                <div className="absolute right-0 top-6 [perspective:500px]">
                  <div className="relative flex font-lazer flex-col px-4 py-2 bg-pepe before:left-0 before:absolute before:w-full before:block before:bg-gray-500 before:-bottom-0.5 before:h-4 before:skew-y-3 before:-z-10 after:-z-10 after:absolute after:left-full after:block after:h-full after:content-[''] after:top-0 after:w-4 after:bg-[#CACF20] after:[transform-origin:center_left] after:[transform:rotateY(70deg)_skewY(20deg)]">
                    <span className="text-xs">LAST UPDATED:</span>
                    <span className="text-2xl">10/06/2023</span>
                  </div>
                </div>
                <div className="flex-[1_1_0] overflow-y-auto">
                  <ul className="flex relative flex-col font-bold text-fud font-mono before:content-[''] before:top-0 before:bottom-0 before:border-l before:border-rage before:block before:absolute before:left-6">
                    <li className="pb-[1.2rem] px-8"></li>
                    <li className="border-t border-vroom py-[1.2rem] px-8"></li>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <li key={i} className="border-t border-vroom py-2 px-8">
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
