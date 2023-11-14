import { cachified } from "./cache.server";

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
        `https://cloudflare-ipfs.com/ipfs/QmXk3GFkkZpTehsQvwdDgiPbE43ktxUuZfg2S7Wf8pzePx/${tokenId}.json`
      );

      const res = await data.json();

      const location = res.Location as string;

      const voicemail = res.Voicemail as string;

      return { location, voicemail };
    },
    ttl: 1000 * 60 * 60 * 24 * 7, // 1 week
    staleWhileRevalidate: 1000 * 60 * 60 * 24 // 1 day
  });
