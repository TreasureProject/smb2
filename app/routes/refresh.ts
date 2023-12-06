import { ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { TCollectionsToFetch, refreshTroveTokens } from "~/api.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const refreshTokens = formData.get("refreshTokens");

  invariant(refreshTokens, "No refresh tokens provided");

  const tokens = JSON.parse(refreshTokens as string) as {
    ids: string[];
    slug: TCollectionsToFetch[number];
  }[];

  for (const token of tokens) {
    await refreshTroveTokens({
      tokens: token.ids,
      slug: token.slug
    });
  }

  return null;
};
