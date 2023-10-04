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
};

export const fetchSmols = async () => {
  const res = await fetch(
    `https://${BASE_URL}.treasure.lol/collection/arb/smol-brains/tokens?${new URLSearchParams(
      {
        limit: "50",
      }
    )}`,
    {
      headers: {
        "X-API-Key": process.env.PUBLIC_TROVE_API_KEY,
      },
    }
  );

  const data = await res.json();

  return data.tokens as TroveSmolToken[];
};
