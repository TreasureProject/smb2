import { ConnectKitButton } from "connectkit";
import { Header } from "~/components/Header";
import { useEffect } from "react";
import { useWorldReducer } from "./provider";
import { PickState, match } from "react-states";
import { useApproval } from "~/hooks/useApprove";
import { useContractAddresses } from "~/useChainAddresses";
import { redirect } from "@remix-run/node";
import EventEmitter from "eventemitter3";
import { State } from "./provider";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

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
                ENTER_WORLD: (ctx) => (
                  <WorldDisplay state={ctx} worldId={ctx.worldId} />
                )
              },
              () => []
            );
          })()}
        </div>
      </div>
    </div>
  );
}

const WorldDisplay = ({
  worldId,
  state
}: {
  worldId: string;
  state: PickState<State, "ENTER_WORLD">;
}) => {
  useEffect(() => {
    if (worldId && window.godotEmitter) {
      window.godotEmitter.emit("webpage", "selected_land", worldId);
    }
  }, [worldId]);

  const islandList = state.world.worldComponents.filter(
    (c) => c.type === "Island"
  );
  const characterList = state.world.worldComponents.filter(
    (c) => c.type === "Character"
  );
  const buildingList = state.world.worldComponents.filter(
    (c) => c.type === "Building"
  );
  const discoveryList = state.world.worldComponents.filter(
    (c) => c.type === "Discovery"
  );

  return (
    <div className="mx-auto w-[70rem]">
      <div className="h-[25rem]">
        <iframe
          className="aspect-video h-full w-full"
          src="/export/Smol%20Town.html"
        ></iframe>
      </div>
      <div className="grid grid-cols-3">
        <div className="border border-white">
          <Tabs className="relative flex flex-col rounded-md">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="island">I</TabsTrigger>
              <TabsTrigger value="character">C</TabsTrigger>
              <TabsTrigger value="building">B</TabsTrigger>
              <TabsTrigger value="discovery">D</TabsTrigger>
            </TabsList>
            <div className="h-48 overflow-auto bg-white">
              <TabsContent value="island">
                <div className="grid grid-cols-5 gap-4 p-4 [grid-auto-rows:min-content]">
                  {islandList.map((island) => {
                    return (
                      <div className="relative">
                        <img
                          className="h-auto w-auto rounded-full border-4"
                          src={`https://source.unsplash.com/random/200x200?sig=${island.name}`}
                          alt={island.name}
                        />
                        <p className="absolute bottom-0 right-0">
                          {island.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              <TabsContent value="character">
                <div className="grid grid-cols-4 gap-4 p-4 [grid-auto-rows:min-content]">
                  {characterList.map((character) => {
                    return (
                      <div className="relative">
                        <img
                          className="h-auto w-auto rounded-full border-4"
                          // random image from unsplash
                          src={`https://source.unsplash.com/random/200x200?sig=${character.name}`}
                          alt={character.name}
                        />
                        <p className="absolute bottom-0 right-0">
                          {character.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              <TabsContent value="building">
                <div className="grid grid-cols-4 gap-4 p-4 [grid-auto-rows:min-content]">
                  {buildingList.map((building) => {
                    return (
                      <div className="relative">
                        <img
                          className="h-auto w-auto rounded-full border-4"
                          // random image from unsplash
                          src={`https://source.unsplash.com/random/200x200?sig=${building.name}`}
                          alt={building.name}
                        />
                        <p className="absolute bottom-0 right-0">
                          {building.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              <TabsContent value="discovery">
                <div className="grid grid-cols-4 gap-4 p-4 [grid-auto-rows:min-content]">
                  {discoveryList.map((discovery) => {
                    return (
                      <div className="relative">
                        <img
                          className="h-auto w-auto rounded-full border-4"
                          // random image from unsplash
                          src={`https://source.unsplash.com/random/200x200?sig=${discovery.name}`}
                          alt={discovery.name}
                        />
                        <p className="absolute bottom-0 right-0">
                          {discovery.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div className="border border-white">helloworld</div>
        <div className="border border-white">helloworld</div>
      </div>
    </div>
  );
};
