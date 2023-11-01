import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";
import { ClientOnly } from "remix-utils/client-only";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { client } from "./client.server";
import { useCustomLoaderData } from "~/hooks/useCustomLoaderData";

type Weather = "sunny" | "rainy" | "cloudy" | "windy" | "fog" | "snowy";

export const loader: LoaderFunction = async () => {
  const today = new Date();

  const weathers = await Promise.all(
    Array.from({ length: 7 }).map(async (_, i) => {
      const targetDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i
      );

      const { day, month, year } = {
        day: targetDay.getDate(),
        month: targetDay.getMonth() + 1,
        year: targetDay.getFullYear()
      };
      const weather = (await client.readContract({
        address: "0x4B14Aa64C37bE1aB98DEB2B4D197d42149750eC0",
        abi: [
          {
            inputs: [
              { internalType: "uint256", name: "day", type: "uint256" },
              { internalType: "uint256", name: "month", type: "uint256" },
              { internalType: "uint256", name: "year", type: "uint256" }
            ],
            name: "getWeather",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function"
          },
          {
            inputs: [],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function"
          }
        ],
        functionName: "getWeather",
        args: [BigInt(day), BigInt(month), BigInt(year)]
      })) as Weather;

      return {
        weather,
        day,
        month,
        year,
        degrees: Math.floor(Math.random() * 100)
      };
    })
  );

  return json({ weathers });
};

export default function News() {
  const navigate = useNavigate();
  const data = useCustomLoaderData<typeof loader>();

  console.log({ data });
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
                className="fixed z-50 flex h-2/3 w-full max-w-xs flex-col gap-12 border border-vroom bg-grayTwo shadow-lg text-4xl"
              >
                <div className="flex w-full flex-col items-center justify-center">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-4xl">22°C</h2>
                      <p className="text-lg">Sunny</p>
                    </div>
                    <div>
                      <img
                        alt="Weather Icon"
                        height="64"
                        src="/placeholder.svg"
                        style={{
                          aspectRatio: "64/64",
                          objectFit: "cover"
                        }}
                        width="64"
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-center text-xl">New York City</p>
                  <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="font-bold">Humidity</p>
                      <p>64%</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="font-bold">Wind</p>
                      <p>5 km/h</p>
                    </div>
                    <div>
                      <p className="font-bold">Precipitation</p>
                      <p>7%</p>
                    </div>
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between">
                      <p>Monday</p>
                      <p>Sunny</p>
                      <p>24°C</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Tuesday</p>
                      <p>Cloudy</p>
                      <p>22°C</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Wednesday</p>
                      <p>Rainy</p>
                      <p>20°C</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Thursday</p>
                      <p>Sunny</p>
                      <p>23°C</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Friday</p>
                      <p>Cloudy</p>
                      <p>24°C</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </ClientOnly>
  );
}
