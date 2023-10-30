import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const targetSmolId = url.searchParams.get("id") || "1";

  const data = await fetch(
    `https://cloudflare-ipfs.com/ipfs/QmXk3GFkkZpTehsQvwdDgiPbE43ktxUuZfg2S7Wf8pzePx/${targetSmolId}.json`
  );

  const res = await data.json();

  const location = res.Location as string;

  const voicemail = res.Voicemail as string;

  return json({ location, voicemail });
};
