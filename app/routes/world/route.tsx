import { ConnectKitButton } from "connectkit";
import { Header } from "~/components/Header";
import { useEffect, useState } from "react";
import { useMainReducer } from "./mainReducer";
import { PickState, match } from "react-states";
import EventEmitter from "eventemitter3";
import { State } from "./mainReducer";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { WorldInfoT, worldComponentsT } from "../generate-world";
import { cn } from "~/utils";
import { useWorldReducer } from "./worldReducer";
import { InventoryT, TroveToken } from "~/api.server";
import { motion } from "framer-motion";
import { Drawer } from "vaul";
import { Button } from "~/components/ui/button";

const button = {
  rest: { scale: 1 },
  hover: { scale: 1.1 },
  pressed: { scale: 0.95 }
};
const arrow = {
  rest: { rotate: 0 },
  hover: { rotate: 360, transition: { duration: 0.4 } }
};

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
                    <button
                      onClick={() => dispatch({ type: "mint_world" })}
                      className="border border-white px-2 py-1"
                    >
                      Mint
                    </button>
                  </div>
                ),
                ENTER_WORLD: (ctx) => (
                  <WorldDisplay
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
  inventory,
  world
}: {
  worldId: string;
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

  const islandList = worldState.world.worldComponents.filter(
    (c) => c.type === "Island"
  );
  const characterList = worldState.world.worldComponents.filter(
    (c) => c.type === "Character"
  );
  const buildingList = worldState.world.worldComponents.filter(
    (c) => c.type === "Building"
  );
  const discoveryList = worldState.world.worldComponents.filter(
    (c) => c.type === "Discovery"
  );

  const setSelected = (component: worldComponentsT[number]) => {
    dispatch({ type: "selectComponent", component });
  };

  const selected = worldState.selectedComponent;

  console.log(worldState.state);

  return (
    <Drawer.Root>
      <div className="mx-auto w-[70rem]">
        <div className="relative h-[25rem]">
          <iframe
            className="aspect-video h-full w-full rounded-md border-2 border-grayTwo/20"
            src="/export/Smol%20Town.html"
          ></iframe>
        </div>
        <div className="mt-3 grid grid-cols-3">
          <div className="overflow-hidden rounded-bl-md rounded-tl-md border-b-2 border-l-2 border-t-2 border-grayTwo/20 bg-fud">
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
                    {worldState.world.checkedInSmol ? (
                      <div className="group relative overflow-hidden">
                        <div className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center rounded-full bg-grayTwo/20 backdrop-blur-sm font-formula text-[0.6rem] group-hover:flex">
                          Check out
                        </div>
                        <img
                          className="relative h-auto w-auto rounded-full border-4 border-grayTwo/20"
                          src={
                            worldState.inventory?.["smol-brains"]?.find(
                              (t) =>
                                t.tokenId === worldState.world.checkedInSmol
                            )?.image.uri ?? ""
                          }
                          alt={`Smol ${worldState.world.checkedInSmol}`}
                        />
                        <button
                          className="absolute inset-0 h-full w-full"
                          onClick={() =>
                            dispatch({
                              type: "checkSmolOut",
                              smolId: worldState.world.checkedInSmol ?? ""
                            })
                          }
                        >
                          <span className="sr-only">
                            Show info for Smol {worldState.world.checkedInSmol}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <Drawer.Trigger asChild>
                        <button className="relative rounded-full border-4 border-dashed border-grayTwo/20 transition-colors font-formula text-xs hover:border-grayTwo/50">
                          Select Smol
                        </button>
                      </Drawer.Trigger>
                    )}
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
                  <div className="flex min-w-0 flex-col space-y-2">
                    <div className="space-y-0.5">
                      <p className="truncate font-bold text-2xl">
                        {selected.name}
                      </p>
                      <p className="text-grayOne text-xs">{selected.type}</p>
                    </div>
                    <p className="font-medium text-gray-300 text-sm">
                      Lvl:{" "}
                      <span className="font-bold text-white">
                        {selected.isUnlocked ? selected.level : "--"}
                      </span>
                    </p>
                    {!selected.isUnlocked && (
                      <p className="font-medium text-gray-300 text-sm">
                        Unlock In:{" "}
                        <span className="font-bold text-white">
                          {selected.unlockTime}
                        </span>
                      </p>
                    )}
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
                  disabled={!selected.canUnlock && !selected.canUpgrade}
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
                  {selected.isUnlocked && selected.canUpgrade
                    ? "Upgrade"
                    : "Unlock"}
                </button>
              </div>
            )}
          </div>
          <div className="relative rounded-br-md rounded-tr-md border-2 border-grayTwo/20 bg-fud">
            <motion.div
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center p-0.5"
              variants={button}
              initial="rest"
              whileHover="hover"
              whileTap="pressed"
            >
              <motion.svg
                width="16"
                height="16"
                fill="none"
                className="text-pepe"
                xmlns="http://www.w3.org/2000/svg"
                variants={arrow}
              >
                <path
                  d="M12.8 5.1541V2.5a.7.7 0 0 1 1.4 0v5a.7.7 0 0 1-.7.7h-5a.7.7 0 0 1 0-1.4h3.573c-.7005-1.8367-2.4886-3.1-4.5308-3.1C4.8665 3.7 2.7 5.85 2.7 8.5s2.1665 4.8 4.8422 4.8c1.3035 0 2.523-.512 3.426-1.4079a.7.7 0 0 1 .986.9938C10.7915 14.0396 9.2186 14.7 7.5422 14.7 4.0957 14.7 1.3 11.9257 1.3 8.5s2.7957-6.2 6.2422-6.2c2.1801 0 4.137 1.1192 5.2578 2.8541z"
                  fill="currentColor"
                  fillRule="nonzero"
                />
              </motion.svg>
              <button
                onClick={() => dispatch({ type: "reload" })}
                className="absolute inset-0 h-full w-full"
              >
                <span className="sr-only">Refresh</span>
              </button>
            </motion.div>
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
        <SelectSmolDialog state={worldState} dispatch={dispatch} />
      </div>
    </Drawer.Root>
  );
};

const SelectSmolDialog = ({
  state,
  dispatch
}: {
  state: ReturnType<typeof useWorldReducer>[0];
  dispatch: ReturnType<typeof useWorldReducer>[1];
}) => {
  const inventory = state.inventory?.["smol-brains"] ?? [];
  const [selectedSmol, setSelectedSmol] = useState<TroveToken | null>(null);

  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      <Drawer.Content className="fixed bottom-0 left-0 right-0 z-10 mt-24 flex h-[90%] items-stretch rounded-t-[10px] bg-[#261F2D]">
        <div className="mx-auto flex h-full max-w-7xl flex-col">
          <div className="grid grid-cols-2 gap-6 overflow-auto px-6 py-12 [grid-auto-rows:max-content] sm:grid-cols-5">
            {inventory.map((token) => {
              const isSelected = selectedSmol?.tokenId === token.tokenId;
              return (
                <div
                  key={token.tokenId}
                  className={cn(
                    "relative inline-block bg-[#483B53] p-2",
                    isSelected && "bg-[#DCD0E7]"
                  )}
                >
                  <img
                    src={token.image.uri}
                    className="relative h-full w-full"
                  />
                  <button
                    className="absolute inset-0 z-20 h-full w-full"
                    onClick={() => setSelectedSmol(token)}
                  ></button>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-4">
            <Drawer.Close asChild>
              <Button className="flex-1">Back</Button>
            </Drawer.Close>
            <Drawer.Close asChild>
              <Button
                onClick={() => {
                  if (!selectedSmol) return;

                  dispatch({
                    type: "checkSmolIn",
                    smolId: selectedSmol.tokenId
                  });
                }}
                primary
                className="flex-1"
                disabled={!selectedSmol}
              >
                Confirm
              </Button>
            </Drawer.Close>
          </div>
        </div>
      </Drawer.Content>
    </Drawer.Portal>
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
