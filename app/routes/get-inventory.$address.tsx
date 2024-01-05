import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { fetchTroveTokensForUser } from "~/api.server";

export let loader = async ({ params, request }: LoaderFunctionArgs) => {
  const address = params.address;
  const url = new URL(request.url);
  const except = url.searchParams.get("except") ?? "";

  invariant(address, "address is required");

  const split = except === "" ? null : except.split(",");

  try {
    const data = await fetchTroveTokensForUser(address, split);
    return json(
      {
        ok: true,
        data
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60"
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
