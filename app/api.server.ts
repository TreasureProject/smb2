import { arbitrum, arbitrumSepolia } from "viem/chains";
import { cachified } from "./cache.server";
import { CONTRACT_ADDRESSES } from "./const";
import { client } from "./routes/weather/client.server";
import { Weather } from "./types";

const chainName = process.env.CHAIN || "arbsepolia";
const isTestnet = chainName === "arbsepolia";
const BASE_URL = isTestnet ? "trove-api-dev" : "trove-api";

export type TroveToken = {
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
  isStaked: boolean;
  tokenSupply: number;
  queryUserQuantityOwned?: number;
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

export type TroveTokensForUserApiResponse = {
  tokens: TroveToken[];
  nextPageKey: string | null;
};

const LIMIT = "117";

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
            "X-API-Key": process.env.TROVE_API_KEY ?? ""
          }
        }
      );

      const data = await res.json();

      return data.tokens as TroveToken[];
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
              "X-API-Key": process.env.TROVE_API_KEY ?? ""
            }
          }
        );

        const data = await res.json();

        return data.tokens as TroveToken[] | undefined;
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

export const fetchSmolNews = async () =>
  cachified({
    key: `smol-news`,
    async getFreshValue() {
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
    }
  });

let collectionsToFetch = [
  "swol-jrs",
  "smol-jrs",
  "smol-cars",
  "swolercycles",
  "smol-treasures",
  "smol-brains",
  "degradables"
] as const;

export type TCollectionsToFetch = typeof collectionsToFetch;

export type TCollectionsToFetchWithoutAs<A> = Exclude<
  TCollectionsToFetch[number],
  A
>;

if (isTestnet) {
  collectionsToFetch = [
    // @ts-ignore
    "swol-jrs-as",
    // @ts-ignore
    "smol-jrs-as",
    // @ts-ignore
    "smol-cars-as",
    // @ts-ignore
    "swolercycles-as",
    // @ts-ignore
    "smol-treasures-as",
    // @ts-ignore
    "smol-brains-as",
    // @ts-ignore
    "degradables-as"
  ];
}

export const fetchTroveTokensForUser = async (userAddress: string) => {
  const res = await fetch(
    `https://${BASE_URL}.treasure.lol/tokens-for-user-page`,
    {
      method: "POST",
      headers: {
        "X-API-Key": process.env.TROVE_API_KEY ?? ""
      },
      body: JSON.stringify({
        slugs: collectionsToFetch,
        chains: [chainName],
        showHiddenTraits: true,
        userAddress
      })
    }
  );

  const data = (await res.json()) as TroveTokensForUserApiResponse;
  const collections = data.tokens.reduce<{
    [key in TCollectionsToFetch[number]]?: TroveToken[];
  }>((acc, token) => {
    const swolJrsContractAddress =
      CONTRACT_ADDRESSES[isTestnet ? arbitrumSepolia.id : arbitrum.id][
        "SWOL_JRS"
      ].toLowerCase();

    const slug =
      token.collectionUrlSlug === (isTestnet ? "smol-jrs-as" : "smol-jrs")
        ? token.collectionAddr === swolJrsContractAddress
          ? isTestnet
            ? "swol-jrs-as"
            : "swol-jrs"
          : isTestnet
          ? "smol-jrs-as"
          : "smol-jrs"
        : token.collectionUrlSlug;

    const collectionUrlSlug = (
      isTestnet ? slug.replace("-as", "") : slug
    ) as (typeof collectionsToFetch)[number];

    if (!acc[collectionUrlSlug]) {
      acc[collectionUrlSlug] = [];
    }

    if (collectionUrlSlug === "smol-jrs") {
      const swolJrsContractAddress =
        CONTRACT_ADDRESSES[isTestnet ? arbitrumSepolia.id : arbitrum.id][
          "SWOL_JRS"
        ];

      if (token.collectionAddr === swolJrsContractAddress) {
        acc["swol-jrs"]?.push(token);
      } else {
        acc["smol-jrs"]?.push(token);
      }

      return acc;
    }

    acc[collectionUrlSlug]?.push(token);
    return acc;
  }, {});

  return collections;
};

export const refreshTroveTokens = async ({
  tokens,
  slug
}: {
  tokens: string[];
  slug: TCollectionsToFetch[number];
}) => {
  const normalizedSlug = isTestnet ? `${slug}-as` : slug;
  const url = (tokenId: string) =>
    `https://${BASE_URL}.treasure.lol/collection/${
      chainName || "arbsepolia"
    }/${normalizedSlug}/${tokenId}/refresh`;

  await Promise.all(
    tokens.map((token) => {
      return fetch(url(token), {
        method: "POST",
        headers: {
          "X-API-Key": process.env.TROVE_API_KEY ?? ""
        }
      });
    })
  );
};
