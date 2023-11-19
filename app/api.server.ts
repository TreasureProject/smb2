import { cachified } from "./cache.server";
import { client } from "./routes/weather/client.server";
import { Weather } from "./types";

const BASE_URL =
  (process.env.CHAIN || "arbgoerli") === "arbgoerli"
    ? "trove-api-dev"
    : "trove-api";

export type TroveSmolToken = {
  contractType: "ERC721";
  collectionAddr: string;
  tokenId: string;
  collectionUrlSlug: string;
  image: {
    uri: string;
  };
  metadata: {
    name: string;
    attributes: {
      value: string | number;
      trait_type: string;
      display_type?: string;
    }[];
  };
  rarity?: {
    score: number;
    rank: number;
    scoreBreakdown: {
      count: number;
      trait: string;
      value: string;
      score: number;
    }[];
  };
};

const LIMIT = "117";

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

export const fetchWeathers = async (currentDay: Date) =>
  cachified({
    key: `weathers-${currentDay.getMonth()}-${currentDay.getDate()}`,
    async getFreshValue() {
      const weathers = await Promise.all(
        Array.from({ length: 7 }).map(async (_, i) => {
          const targetDay = new Date(
            currentDay.getFullYear(),
            currentDay.getMonth(),
            currentDay.getDate() + i
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

      return weathers;
    },
    ttl: Infinity
  });

export const fetchSmols = async (page: number) =>
  cachified({
    key: `smols-${page}`,
    async getFreshValue() {
      const offset = page * Number(LIMIT);
      const res = await fetch(
        `https://${BASE_URL}.treasure.lol/collection/arb/smol-brains/tokens?${new URLSearchParams(
          {
            offset: String(offset),
            limit: LIMIT
          }
        )}`,
        {
          headers: {
            "X-API-Key": process.env.PUBLIC_TROVE_API_KEY
          }
        }
      );

      const data = await res.json();

      return data.tokens as TroveSmolToken[];
    }
  });

export const searchSmol = async (tokenId: string) =>
  cachified({
    key: `smol-${tokenId}`,
    async getFreshValue() {
      {
        const res = await fetch(
          `https://${BASE_URL}.treasure.lol/collection/arb/smol-brains/tokens?${new URLSearchParams(
            {
              ids: tokenId
            }
          )}`,
          {
            headers: {
              "X-API-Key": process.env.PUBLIC_TROVE_API_KEY
            }
          }
        );

        const data = await res.json();

        return data.tokens as TroveSmolToken[] | undefined;
      }
    }
  });

export const fetchMisc = async (tokenId: string) =>
  cachified({
    key: `smol-misc-${tokenId}`,
    async getFreshValue() {
      const data = await fetch(
        `https://cloudflare-ipfs.com/ipfs/QmTBkdb8nXR8betmBTX6kPY8KDMR25Wh7MypqNQ8mZcVGn/${tokenId}.json`
      );

      const res = await data.json();

      const location = res.Location as string;

      const voicemail = res.Voicemail as string;

      const jobs = res.Job as string;

      const timeLastSeen = Math.floor(Math.random() * 60);

      return { location, voicemail, jobs, timeLastSeen };
    },
    ttl: 1000 * 60 * 60 * 24 * 7, // 1 week
    staleWhileRevalidate: 1000 * 60 * 60 * 24 // 1 day
  });

export const fetchSmolNews = async () => {
  const res = await fetch(
    "https://graphql.contentful.com/content/v1/spaces/0inadimdhi52/environments/master",
    {
      method: "POST",
      body: JSON.stringify({
        query: `
        query {
          # add your query
          newsSmolCollection {
            items {
              videosCollection {
                items {
                  url
                  title
                }
              }
            }
          }
        }
        
        `
      }),
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  const data = (await res.json()) as {
    data: {
      newsSmolCollection: {
        items: {
          videosCollection: {
            items: {
              url: string;
              title: string;
            }[];
          };
        }[];
      };
    };
  };

  return data.data.newsSmolCollection.items[0].videosCollection.items;
};
