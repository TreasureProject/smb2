import { skinCount } from "./skinCount";
import { proofs } from "./proofs";
import { LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";

export const loader = ({ params }: LoaderFunctionArgs) => {
  invariant(params.address, "address is required");

  try {
    const proof = proofs[params.address];
    const skins = skinCount[params.address];

    if (!proof || !skins) {
      return json({
        ok: false,
        error: "No proof found for this address"
      } as const);
    }

    return json({
      ok: true,
      data: {
        proof,
        skins
      }
    });
  } catch (e: any) {
    return json({
      ok: false,
      error: e.message
    } as const);
  }
};
