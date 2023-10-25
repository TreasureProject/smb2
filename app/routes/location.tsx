import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const targetSmolId = url.searchParams.get("id") || "1";

  const data = await fetch(
    `https://cloudflare-ipfs.com/ipfs/QmXk3GFkkZpTehsQvwdDgiPbE43ktxUuZfg2S7Wf8pzePx/${targetSmolId}.json`
  );

  const voicemail = await data.json();

  const location = voicemail.Location;

  return json({ location });
};
