import { ConnectKitButton } from "connectkit";
import { Header } from "~/components/Header";
import { useEffect } from "react";
import { useWorldReducer } from "./provider";
import { match } from "react-states";
import { useApproval } from "~/hooks/useApprove";
import { useContractAddresses } from "~/useChainAddresses";
import { redirect } from "@remix-run/node";

export const loader = () => {
  if (process.env.NODE_ENV === "production") {
    throw redirect("/");
  }

  return null;
};

export default function World() {
  const [state, dispatch] = useWorldReducer();
  const contractAddresses = useContractAddresses();

  return (
    <div className="flex h-full min-h-full flex-col">
      <Header name="World" blendColor="#1938F2" />
      <div className="flex flex-1 flex-col">
        <div className="relative z-10 ml-auto w-min px-4 pt-4">
          <ConnectKitButton />
        </div>
        <div className="grid flex-1 place-items-center">
          <div className="w-[500px] border text-white">
            <pre>
              <code>{JSON.stringify(state, null, 2)}</code>
            </pre>
            {(() => {
              return match(
                state,
                {
                  MISSING_LAND: () => (
                    <div className="flex flex-col items-center space-y-2 font-mono">
                      <p className="font-bold text-2xl">Missing Land</p>
                      <p className="text-xl">
                        You don't have any land yet. You can buy some on the
                        marketplace.
                      </p>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "mint_world"
                          })
                        }
                      >
                        Mint
                      </button>
                    </div>
                  ),
                  NEED_APPROVAL: () => (
                    <div className="flex flex-col items-center space-y-2 font-mono">
                      <p className="font-bold text-2xl">Missing Land</p>
                      <p className="text-xl">
                        You don't have any land yet. You can buy some on the
                        marketplace.
                      </p>
                      <button
                        onClick={() => dispatch({ type: "approve_land" })}
                      >
                        Approve
                      </button>
                    </div>
                  ),
                  MISSING_WORLD: () => (
                    <div className="flex flex-col items-center space-y-2 font-mono">
                      <p className="font-bold text-2xl">Missing Land</p>
                      <p className="text-xl">
                        You don't have Smol World. Click the button below to
                        mint it.
                      </p>
                      <button onClick={() => dispatch({ type: "mint_world" })}>
                        Mint
                      </button>
                    </div>
                  )
                },
                () => []
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
