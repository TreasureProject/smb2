import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { json } from "@remix-run/node";
import { useEffect, useState } from "react";

import { commonMeta } from "~/seo";
import { Header } from "~/components/Header";

import Sunny from "./assets/sunny.png";
import Cloud1 from "./assets/cloud1.png";
import Cloud2 from "./assets/cloud2.png";
import { cn } from "~/utils";
import { fetchWeathers } from "~/api.server";
import { useLoaderData } from "@remix-run/react";

export const meta = commonMeta;

function getCustomDay(date: Date) {
  // Convert the date to UTC
  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth();
  const utcDate = date.getUTCDate();
  const utcHours = date.getUTCHours();

  if (utcHours < 12) {
    const previousDay = new Date(
      Date.UTC(utcYear, utcMonth, utcDate - 1, utcHours)
    );
    return previousDay;
  }

  return new Date(Date.UTC(utcYear, utcMonth, utcDate, utcHours));
}

export const loader = async () => {
  const today = new Date();
  const today_utc = getCustomDay(today);

  const weathers = await fetchWeathers(today_utc);

  return json({ weathers });
};

const variants = {
  sunny: {
    backgroundImage: "linear-gradient(#FF4C22, #F8FF1D)"
  },
  rainy: {
    backgroundImage: "linear-gradient(#0E072D, #12F6FC)"
  },
  cloudy: {
    backgroundImage: "linear-gradient(#919191, #EFF0F0)"
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

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = 0.8 + i * 0.1;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay, duration: 0.01 }
      }
    };
  }
};

const Rainy = () => {
  return (
    <motion.div
      animate={{
        backgroundPosition: ["0px 0px", "-2000px 2000px"],
        transition: {
          duration: 2,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      }}
      className="h-full w-full bg-[url(/img/rain.png)]"
    >
      <motion.img
        src={Cloud1}
        animate={{
          right: ["-100%", "100%"],
          transition: {
            duration: 20,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }
        }}
        className="absolute top-0 h-auto w-52"
      />
      <motion.img
        src={Cloud2}
        animate={{
          right: ["-100%", "100%"],
          transition: {
            duration: 16,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
            delay: 4
          }
        }}
        className="absolute top-12 h-auto w-96"
      />
    </motion.div>
  );
};

const Snowy = () => {
  return (
    <motion.div
      animate={{
        backgroundPosition: ["0px 0px", "0px 2000px"],
        transition: {
          duration: 50,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      }}
      className="h-full w-full bg-[url(/img/snow.png)]"
    ></motion.div>
  );
};

const Windy = () => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return [...Array.from({ length: 6 })].map((_, i, arr) => {
    return (
      <AnimatePresence>
        <motion.svg
          width="190"
          height="57"
          viewBox="0 0 190 57"
          fill="none"
          initial="hidden"
          animate="visible"
          xmlns="http://www.w3.org/2000/svg"
          key={key + i * 2}
          className={cn(
            "absolute",
            i === 0 && "left-[12%] top-[12%] w-16 text-white sm:w-auto",
            i === 1 &&
              "left-[16%] top-[20%] w-12 text-grayOne sm:left-[28%] sm:top-[24%] sm:w-20",
            i === 2 &&
              "left-[12%] top-[26%] w-14 text-white sm:top-[36%] sm:w-24",
            i === 3 && "right-[12%] top-[12%] w-14 text-white sm:w-24",
            i === 4 &&
              "right-[16%] top-[20%] w-16 text-grayTwo sm:right-[28%] sm:top-[24%] sm:w-auto",
            i === 5 &&
              "right-[12%] top-[26%] w-12 text-grayOne sm:top-[36%] sm:w-20"
          )}
        >
          <motion.rect
            variants={draw}
            custom={1 * (i + 1) * 0.2}
            x="24"
            y="49"
            width="166"
            height="8"
            fill="currentColor"
          />
          <motion.rect
            variants={draw}
            custom={2 * (i + 1) * 0.2}
            x="16"
            y="41"
            width="8"
            height="8"
            fill="currentColor"
          />
          <motion.rect
            variants={draw}
            custom={3 * (i + 1) * 0.2}
            x="8"
            y="32"
            width="8"
            height="8"
            fill="currentColor"
          />
          <motion.rect
            variants={draw}
            custom={4 * (i + 1) * 0.2}
            y="24"
            width="8"
            height="8"
            fill="currentColor"
          />
          <motion.rect
            variants={draw}
            custom={5 * (i + 1) * 0.2}
            y="16"
            width="8"
            height="8"
            fill="currentColor"
          />
          <motion.rect
            variants={draw}
            custom={6 * (i + 1) * 0.2}
            x="8"
            y="8"
            width="8"
            height="8"
            fill="currentColor"
          />
          <motion.rect
            variants={draw}
            custom={7 * (i + 1) * 0.2}
            x="16"
            width="8"
            height="8"
            fill="currentColor"
          />
          <motion.rect
            variants={draw}
            custom={8 * (i + 1) * 0.2}
            x="24"
            width="8"
            height="8"
            fill="currentColor"
          />
          <motion.rect
            variants={draw}
            custom={9 * (i + 1) * 0.2}
            x="32"
            y="8"
            width="8"
            height="8"
            fill="currentColor"
          />
        </motion.svg>
      </AnimatePresence>
    );
  });
};

const Foggy = () => {
  return (
    <div className="absolute inset-0 h-full w-full opacity-20">
      <Cloudy />
    </div>
  );
};

const Cloudy = () => {
  return (
    <>
      <motion.img
        src={Cloud1}
        animate={{
          right: ["-50%", "100%"],
          transition: {
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }
        }}
        className="absolute top-0 h-auto w-52"
      />
      <motion.img
        src={Cloud1}
        animate={{
          right: ["-50%", "100%"],
          transition: {
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }
        }}
        className="absolute top-0 h-auto w-52"
      />
      <motion.img
        src={Cloud2}
        animate={{
          right: ["-50%", "100%"],
          transition: {
            duration: 18,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.5
          }
        }}
        className="absolute top-24 h-auto w-96"
      />
      <motion.img
        src={Cloud2}
        animate={{
          right: ["-50%", "100%"],
          transition: {
            duration: 24,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            delay: 1
          }
        }}
        className="absolute top-16 h-auto w-96"
      />
    </>
  );
};

export default function News() {
  const data = useLoaderData<typeof loader>();
  const [date, setDate] = useState(0);
  const today = data?.weathers[date];

  return (
    <>
      <Header name="weather" />
      <motion.div
        variants={variants}
        animate={variants[today?.weather || "sunny"]}
        className="relative h-full overflow-hidden"
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={today?.fullDate}
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {(() => {
              switch (today?.weather) {
                case "sunny":
                  return (
                    <motion.img
                      className="absolute -right-12 -top-12 w-32 sm:-right-24 sm:-top-24 md:w-auto"
                      src={Sunny}
                      animate={{
                        transform: [
                          "rotate(0deg) scale(1)",
                          "rotate(360deg) scale(1.2)"
                        ],
                        transition: {
                          duration: 40,
                          ease: "easeOut",
                          repeat: Infinity,
                          repeatType: "loop"
                        }
                      }}
                      alt="sun"
                    />
                  );
                case "snowy":
                  return <Snowy />;
                case "rainy":
                  return <Rainy />;
                case "cloudy":
                  return <Cloudy />;
                case "fog":
                  return <Foggy />;
                case "windy":
                  return <Windy />;
              }
            })()}
          </motion.div>
        </AnimatePresence>
        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="flex flex-col items-center">
            <div className="mx-auto mt-12 max-w-max rounded-lg bg-fud px-3 py-2">
              <span className="font-bold text-white font-neuebit text-2xl leading-none capsize">
                {today?.fullDate}
              </span>
            </div>
            <p
              className={cn(
                "mt-6 font-bold font-formula text-xl leading-none capsize",
                today?.weather === "snowy" || today?.weather === "cloudy"
                  ? "text-fud"
                  : "text-white"
              )}
            >
              SMOLVERSE
            </p>
            <p
              className={cn(
                "mt-10 font-sans text-[20rem] leading-none capsize",
                today?.weather === "snowy" || today?.weather === "cloudy"
                  ? "text-fud"
                  : "text-white"
              )}
            >
              {today?.degrees}°
            </p>
            <p
              className={cn(
                "mt-8 font-bold font-formula text-2xl leading-none capsize",
                today?.weather === "snowy" || today?.weather === "cloudy"
                  ? "text-fud"
                  : "text-white"
              )}
            >
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
                  <li
                    key={weather.fullDate}
                    className="relative flex items-center justify-between bg-[#1938F21A] px-4 py-2"
                  >
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
    </>
  );
}
