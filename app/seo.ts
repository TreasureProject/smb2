import { MetaFunction } from "@remix-run/node";
import type { Loader } from "~/root";

export function getSocialMetas({
  url,
  title = generateTitle(),
  description = "WE ARE SMOL.",
  keywords = "treasure, NFT, games, community, imagination, magic, smol, smolbrain, smolverse",
  image
}: {
  image?: string;
  url: string;
  title?: string;
  description?: string;
  keywords?: string;
}) {
  return [
    { title },
    { description },
    { keywords },
    { image },
    {
      property: "og:url",
      content: url
    },
    {
      property: "og:title",
      content: title
    },
    {
      property: "og:description",
      content: description
    },
    {
      property: "og:image",
      content: image
    },
    {
      property: "twitter:card",
      content: image ? "summary_large_image" : "summary"
    },
    {
      property: "twitter:creator",
      content: "@smolverse"
    },
    {
      property: "twitter:site",
      content: "@smolverse"
    },
    {
      property: "twitter:title",
      content: title
    },
    {
      property: "twitter:description",
      content: description
    },
    {
      property: "twitter:image",
      content: image
    },
    {
      property: "twitter:alt",
      content: title
    }
  ];
}

function prettify(str: string) {
  return str.replace(/(-|^)([^-]?)/g, function (_, prep, letter) {
    return (prep && " ") + letter.toUpperCase();
  });
}

function removeStartingSlash(s: string) {
  return s.startsWith("/") ? s.slice(1) : s;
}

export function generateTitle(title?: string) {
  const prettifiedTitle = prettify(removeStartingSlash(title || ""));
  return prettifiedTitle !== "" ? `${prettifiedTitle} | SMOL` : "SMOL";
}

function removeTrailingSlash(s: string) {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

export function getUrl(requestInfo?: { origin: string; path: string }) {
  return removeTrailingSlash(
    `${requestInfo?.origin ?? "https://smolverse.lol"}${
      requestInfo?.path ?? ""
    }`
  );
}

export function getDomainUrl(request: Request) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export const commonMeta: MetaFunction<unknown, { root: Loader }> = ({
  matches,
  location
}) => {
  const requestInfo = matches.find((match) => match.id === "root")?.data
    .requestInfo;

  const url = getUrl(requestInfo);

  console.log(`${url}${requestInfo?.path === "/" ? "/index" : ""}.png`);

  return getSocialMetas({
    title: generateTitle(location.pathname),
    url: getUrl(requestInfo),
    image: `${url}${requestInfo?.path === "/" ? "/index" : ""}.png`
  });
};
