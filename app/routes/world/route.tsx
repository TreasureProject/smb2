import { ConnectKitButton } from "connectkit";
import { Header } from "~/components/Header";
import { useEffect, useState } from "react";
import { useWorldReducer } from "./provider";
import { PickState, match } from "react-states";
import { useApproval } from "~/hooks/useApprove";
import { useContractAddresses } from "~/useChainAddresses";
import { redirect } from "@remix-run/node";
import EventEmitter from "eventemitter3";
import { State } from "./provider";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { worldComponentsT } from "../generate-world";
import { cn } from "~/utils";

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
        <div className="pointer-events-none absolute left-4 top-4 h-48 overflow-auto text-white">
          <pre>
            <code>{JSON.stringify(state.state, null, 2)}</code>
          </pre>
        </div>
        <div className="relative z-10 ml-auto w-min px-4 pt-4">
          <ConnectKitButton />
        </div>
        <div className=" grid h-full flex-1 place-items-center text-white">
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
                    <a
                      href="https://app.treasure.lol/collection/smol-brains-land"
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex rounded-md border border-white px-2 py-1"
                    >
                      Buy Land
                    </a>
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
                  <WorldDisplay
                    state={ctx}
                    worldId={ctx.worldId}
                    dispatch={dispatch}
                  />
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
  state,
  dispatch
}: {
  worldId: string;
  state: PickState<State, "ENTER_WORLD">;
  dispatch: ReturnType<typeof useWorldReducer>[1];
}) => {
  const [selected, setSelected] = useState<worldComponentsT[number] | null>(
    null
  );

  useEffect(() => {
    if (worldId && window.godotEmitter) {
      const callback = (value: string) => {
        if (value === "ready") {
          window.godotEmitter.emit("webpage", "selected_land", "4");
        }
      };
      window.godotEmitter.on("godot", callback);

      return () => {
        window.godotEmitter.off("godot", callback);
      };
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
          className="aspect-video h-full w-full rounded-md border-2 border-grayTwo/20"
          src="/export/Smol%20Town.html"
        ></iframe>
      </div>
      <div className="mt-3 grid grid-cols-3">
        <div className="overflow-hidden rounded-bl-md rounded-tl-md border-b-2 border-l-2 border-t-2 border-grayTwo/20">
          <Tabs className="relative flex flex-col rounded-md">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                className="text-white font-formula text-xs"
                value="island"
              >
                Island
              </TabsTrigger>
              <TabsTrigger
                className="text-white font-formula text-xs"
                value="character"
              >
                Character
              </TabsTrigger>
              <TabsTrigger
                className="text-white font-formula text-xs"
                value="building"
              >
                Building
              </TabsTrigger>
              <TabsTrigger
                className="text-white font-formula text-xs"
                value="discovery"
              >
                Discovery
              </TabsTrigger>
            </TabsList>
            <div className="h-48 overflow-auto bg-fud">
              <TabsContent value="island">
                <div className="grid grid-cols-4 gap-4 p-4 [grid-auto-rows:min-content]">
                  {islandList.map((island) => {
                    return (
                      <ComponentItem
                        component={island}
                        setSelected={setSelected}
                        selected={selected}
                      />
                    );
                  })}
                </div>
              </TabsContent>
              <TabsContent value="character">
                <div className="grid grid-cols-4 gap-4 p-4 [grid-auto-rows:min-content]">
                  {characterList.map((character) => {
                    return (
                      <ComponentItem
                        component={character}
                        setSelected={setSelected}
                        selected={selected}
                      />
                    );
                  })}
                </div>
              </TabsContent>
              <TabsContent value="building">
                <div className="grid grid-cols-4 gap-4 p-4 [grid-auto-rows:min-content]">
                  {buildingList.map((building) => {
                    return (
                      <ComponentItem
                        component={building}
                        setSelected={setSelected}
                        selected={selected}
                      />
                    );
                  })}
                </div>
              </TabsContent>
              <TabsContent value="discovery">
                <div className="grid grid-cols-4 gap-4 p-4 [grid-auto-rows:min-content]">
                  {discoveryList.map((discovery) => {
                    return (
                      <ComponentItem
                        component={discovery}
                        setSelected={setSelected}
                        selected={selected}
                      />
                    );
                  })}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div className="border-b-2 border-l-2 border-t-2 border-grayTwo/20 bg-fud">
          {!selected ? (
            <div className="grid place-items-center">
              <p className="font-bold text-2xl">Select an item</p>
            </div>
          ) : (
            <div className="flex h-full flex-col space-y-2 p-4 text-white font-formula">
              <div className="space-y-2">
                <p className="font-bold text-3xl leading-none capsize">
                  {selected.name}
                </p>
                <p className="text-grayOne text-xs">{selected.type}</p>
              </div>
              <div className="flex space-x-2">
                <img
                  className="h-20 w-20 rounded-md border border-black"
                  src={`https://source.unsplash.com/random/200x200`}
                  alt={selected.name}
                />
                <div>
                  <p>Lvl: {selected.level}</p>
                </div>
              </div>
              <button
                disabled={
                  (selected.isUnlocked && !selected.canUpgrade) ||
                  !selected.canUnlock
                }
                className="flex-1 rounded-md border border-rage/50 bg-rage text-white disabled:cursor-not-allowed disabled:opacity-25"
              >
                {selected.isUnlocked ? "Upgrade" : "Unlock"}
              </button>
            </div>
          )}
        </div>
        <div className="rounded-br-md rounded-tr-md border-2 border-grayTwo/20 bg-fud">
          helloworld
        </div>
      </div>
    </div>
  );
};

const ComponentItem = ({
  component,
  setSelected,
  selected
}: {
  component: worldComponentsT[number];
  setSelected: (component: worldComponentsT[number]) => void;
  selected: worldComponentsT[number] | null;
}) => {
  const isSelected = selected?.name === component.name;

  const grayOut = !component.isUnlocked && !component.canUnlock;

  return (
    <div className={cn("group relative", grayOut && "opacity-25")}>
      {component.canUnlock || component.canUpgrade ? (
        <div
          aria-hidden="true"
          className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 opacity-75 blur transition [animation-duration:2000ms] group-hover:opacity-100"
        ></div>
      ) : null}
      <img
        className="relative h-auto w-auto rounded-full border-4 border-grayTwo/20"
        src={`https://source.unsplash.com/random/200x200?sig=${component.name}`}
        alt={component.name}
      />
      <button
        className={cn(
          "absolute inset-0 h-full w-full",
          grayOut && "cursor-not-allowed"
        )}
        disabled={grayOut}
        onClick={() => setSelected(component)}
      >
        <span className="sr-only">Show info for {component.name}</span>
      </button>
    </div>
  );
};
