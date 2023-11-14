import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { searchSmol } from "~/api.server";

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const targetSmolId = url.searchParams.get("tokenId");

  invariant(targetSmolId, "No tokenId provided");

  const data = await searchSmol(targetSmolId);

  return json(data);
};
