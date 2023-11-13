import { motion } from "framer-motion";
import { json } from "@remix-run/node";
import { client } from "./client.server";
import { useCustomLoaderData } from "~/hooks/useCustomLoaderData";
import { AnimationContainer } from "~/components/AnimationContainer";
import { useState } from "react";

type Weather = "sunny" | "rainy" | "cloudy" | "windy" | "fog" | "snowy";

export const loader = async () => {
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
        weekday: targetDay.toLocaleString("en-us", { weekday: "long" }),
        fullDate: `${targetDay.toLocaleString("en-us", {
          weekday: "long"
        })} ${targetDay.toLocaleString("en-us", {
          day: "numeric"
        })}, ${targetDay.toLocaleString("en-us", { month: "long" })}`,
        degrees: Math.floor(Math.random() * 100)
      };
    })
  );

  return json({ weathers });
};

const variants = {
  sunny: {
    backgroundImage: "linear-gradient(#FF4C22, #F8FF1D)"
  },
  rainy: {
    backgroundImage: "linear-gradient(#12F6FC, #0E072D)"
  },
  cloudy: {
    //TODO: fix this
    backgroundImage: "linear-gradient(#12F6FC, #0E072D)"
  },
  windy: {
    backgroundImage: "linear-gradient(#919191, #0E072D)"
  },
  fog: {
    backgroundImage: "linear-gradient(#919191, #EFF0F0)"
  },
  snowy: {
    backgroundImage: "linear-gradient(#ffffff, #EFF0F0)"
  }
} as const;

export default function News() {
  const data = useCustomLoaderData<typeof loader>();
  const [date, setDate] = useState(0);
  const today = data?.weathers[date];

  return (
    <AnimationContainer>
      <motion.div
        variants={variants}
        animate={variants[today?.weather || "sunny"]}
        className="h-full"
      >
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col items-center">
            <div className="mx-auto mt-12 max-w-max rounded-lg bg-fud px-3 py-2">
              <span className="font-bold text-white font-neuebit text-2xl leading-none capsize">
                {today?.fullDate}
              </span>
            </div>
            <p className="mt-6 font-bold font-formula text-xl leading-none capsize">
              SMOLVERSE
            </p>
            <p className="mt-10 text-fud font-sans text-[20rem] leading-none capsize">
              {today?.degrees}°
            </p>
            <p className="mt-8 font-bold font-formula text-2xl leading-none capsize">
              {today?.weather}
            </p>
            <div className="mx-auto mt-12 grid h-48 w-48 place-content-center border border-black">
              <span className="tracking-wide text-white text-6xl">
                Placeholder
              </span>
            </div>
            <div className="mx-auto mb-12 mt-12 w-full max-w-xl self-stretch bg-fud p-4 px-4 font-bold font-neuebit">
              <p className="text-white">7 Day Forcast</p>
              <ul className="space-y-2">
                {data?.weathers.map((weather, i) => (
                  <li className="relative flex items-center justify-between bg-[#1938F21A] px-4 py-2">
                    <div className="flex items-center space-x-4">
                      <p className="font-bold text-white font-neuebit text-3xl leading-none capsize">
                        {weather.weekday}
                      </p>
                      <p>{weather.weather}</p>
                    </div>
                    <p className="font-bold text-white font-neuebit text-3xl leading-none capsize">
                      {weather.degrees}°
                    </p>
                    <button
                      className="absolute inset-0 h-full w-full"
                      onClick={() => {
                        setDate(i);
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth"
                        });
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimationContainer>
  );
}
