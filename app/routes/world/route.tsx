import { ConnectKitButton } from "connectkit";
import { Header } from "~/components/Header";
import { useEffect } from "react";
import { useWorldReducer } from "./provider";
import { match } from "react-states";
import { useApproval } from "~/hooks/useApprove";
import { useContractAddresses } from "~/useChainAddresses";
import { redirect } from "@remix-run/node";
import EventEmitter from "eventemitter3";

export default function World() {
  const [state, dispatch] = useWorldReducer();

  useEffect(() => {
    if (!window.godotEmitter) {
      const emitter = new EventEmitter();
      window.godotEmitter = emitter;
    }
  }, []);

  return (
    <div className="flex h-full min-h-full flex-col">
      <Header name="World" blendColor="#1938F2" />
      <div className="relative flex flex-1 flex-col">
        <div className="absolute left-4 top-4 h-48 overflow-auto text-white">
          <pre>
            <code>{JSON.stringify(state, null, 2)}</code>
          </pre>
        </div>
        <div className="relative z-10 ml-auto w-min px-4 pt-4">
          <ConnectKitButton />
        </div>
        <div className=" grid h-full flex-1 place-items-center">
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
                      Buy Land
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
                    <button onClick={() => dispatch({ type: "approve_land" })}>
                      Approve
                    </button>
                  </div>
                ),
                MISSING_WORLD: () => (
                  <div className="flex flex-col items-center space-y-2 font-mono">
                    <p className="font-bold text-2xl">Missing World</p>
                    <p className="text-xl">
                      You don't have Smol World. Click the button below to mint
                      it.
                    </p>
                    <button onClick={() => dispatch({ type: "mint_world" })}>
                      Mint
                    </button>
                  </div>
                ),
                ENTER_WORLD: (ctx) => <WorldDisplay worldId={ctx.worldId} />
              },
              () => []
            );
          })()}
        </div>
      </div>
    </div>
  );
}

const WorldDisplay = ({ worldId }: { worldId: string }) => {
  useEffect(() => {
    if (worldId && window.godotEmitter) {
      window.godotEmitter.emit("webpage", "selected_land", worldId);
    }
  }, [worldId]);

  return (
    <div className="mx-auto h-96 max-w-3xl">
      <iframe
        className="aspect-video h-full w-full"
        src="/export/Smol%20Town.html"
      ></iframe>
    </div>
  );
};
