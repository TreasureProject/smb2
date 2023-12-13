import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { commitSession, getSession } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  session.set("hasBurned", "true");

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    }
  );
};
