import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { fetchMisc } from "~/api.server";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const targetSmolId = url.searchParams.get("id") || "1";

  const data = await fetchMisc(targetSmolId);

  return json(data);
};
