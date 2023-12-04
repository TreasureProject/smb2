import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { fetchTroveTokensForUser } from "~/api.server";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export let loader = async ({ params }: LoaderFunctionArgs) => {
  const address = params.address;

  invariant(address, "address is required");

  try {
    const data = await fetchTroveTokensForUser(address);
    return json(
      {
        ok: true,
        data
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=60"
        }
      }
    );
  } catch (e: any) {
    return json({
      ok: false,
      error: e.message
    } as const);
  }
};
