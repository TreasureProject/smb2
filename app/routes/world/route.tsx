import { ConnectKitButton } from "connectkit";
import { Header } from "~/components/Header";
import { useEffect, useState } from "react";
import { useMainReducer } from "./mainReducer";
import { PickState, match } from "react-states";
import { useApproval } from "~/hooks/useApprove";
import { useContractAddresses } from "~/useChainAddresses";
import { redirect } from "@remix-run/node";
import EventEmitter from "eventemitter3";
import { State } from "./mainReducer";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { WorldInfoT, worldComponentsT } from "../generate-world";
import { cn } from "~/utils";
import { useWorldReducer } from "./worldReducer";
import { InventoryT } from "~/api.server";

export default function World() {
  const [state, dispatch] = useMainReducer();

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
                    inventory={ctx.inventory}
                    world={ctx.world}
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
  inventory,
  world
}: {
  worldId: string;
  state: PickState<State, "ENTER_WORLD">;
  inventory: InventoryT | null;
  world: WorldInfoT;
}) => {
  const [worldState, dispatch] = useWorldReducer({
    worldId,
    world,
    inventory
  });

  useEffect(() => {
    if (worldId && window.godotEmitter) {
      const callback = (value: string) => {
        if (value === "ready") {
          // TODO: replace hardcoded land id
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

  const setSelected = (component: worldComponentsT[number]) => {
    dispatch({ type: "selectComponent", component });
  };

  const selected = worldState.selectedComponent;

  return (
    <div className="mx-auto w-[70rem]">
      <div className="h-[25rem]">
        <iframe
          className="aspect-video h-full w-full rounded-md border-2 border-grayTwo/20"
          src="/export/Smol%20Town.html"
        ></iframe>
      </div>
      <div className="mt-3 grid grid-cols-3">
        <div className="overflow-hidden rounded-bl-md  rounded-tl-md border-b-2 border-l-2 border-t-2 border-grayTwo/20 bg-fud">
          <Tabs
            defaultValue="island"
            className="relative flex flex-col rounded-md"
          >
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
            <div className="h-48 overflow-auto">
              <TabsContent value="island">
                <div className="grid grid-cols-4 gap-4 p-4 [grid-auto-rows:min-content]">
                  {islandList.map((island) => {
                    return (
                      <ComponentItem
                        key={island.name}
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
                        key={character.name}
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
                        key={building.name}
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
                        key={discovery.name}
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
            <div className="grid h-full place-items-center">
              <p className="font-bold text-white font-formula text-sm">
                Select a component
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col p-4 text-white font-formula">
              <div className="flex flex-1 space-x-4">
                <img
                  className="h-[8.5rem] w-[8.5rem] rounded-md border border-black object-contain"
                  src={`https://source.unsplash.com/random/200x200`}
                  alt={selected.name}
                />
                <div className="flex flex-col space-y-2">
                  <div className="space-y-2">
                    <p className="font-bold text-3xl leading-none capsize">
                      {selected.name}
                    </p>
                    <p className="text-grayOne text-xs">{selected.type}</p>
                  </div>
                  <p className="font-medium text-gray-300 text-sm">
                    Lvl:{" "}
                    <span className="font-bold text-white">
                      {selected.level}
                    </span>
                  </p>
                  <p className="font-medium text-gray-300 text-sm">
                    Unlock In:{" "}
                    <span className="font-bold text-white">
                      {selected.unlockTime}
                    </span>
                  </p>
                  <p className="font-medium text-gray-300 text-sm">
                    Status:{" "}
                    <span className="font-bold text-white">
                      {!selected.isUnlocked
                        ? "Locked"
                        : selected.canUpgrade
                        ? "Upgradable"
                        : "Unlocked"}
                    </span>
                  </p>
                </div>
              </div>

              <button
                disabled={
                  (selected.isUnlocked && !selected.canUpgrade) ||
                  !selected.canUnlock
                }
                className="mt-2 h-12 rounded-md border border-rage/50 bg-rage/60 font-bold tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-25"
                onClick={() => {
                  dispatch({
                    type:
                      selected.isUnlocked && selected.canUpgrade
                        ? "upgradeComponent"
                        : "unlockComponent",
                    component: selected
                  });
                }}
              >
                {selected.isUnlocked ? "Upgrade" : "Unlock"}
              </button>
            </div>
          )}
        </div>
        <div className="rounded-br-md rounded-tr-md border-2 border-grayTwo/20 bg-fud">
          <div className="p-4 text-white font-formula">
            <p className="mx-auto w-max font-bold tracking-wider text-3xl">
              Smol World {worldId}
            </p>
            <ul className="mt-4 space-y-2">
              <li>Population: 12000</li>
              <li># of Buildings: 12000</li>
            </ul>
            <ul className="mt-8 space-y-1 text-xs">
              <li>Rainbow Treasures: 12000</li>
              <li>IQ: 12000</li>
              <li>MAGIC: 20000</li>
            </ul>
          </div>
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
