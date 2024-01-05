import { LoaderFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { createPublicClient, http } from "viem";
import { mainnet, arbitrum, arbitrumSepolia } from "viem/chains";
import { CONTRACT_ADDRESSES } from "~/const";
import { abi } from "~/artifacts/smol-world";

const client = createPublicClient({
  chain: process.env.CHAIN === "arbsepolia" ? arbitrumSepolia : arbitrum,
  transport: http(
    `${
      process.env.CHAIN === "arbsepolia"
        ? "https://arb-sepolia.g.alchemy.com/v2/"
        : "https://arb-mainnet.g.alchemy.com/v2/"
    }${import.meta.env.VITE_ALCHEMY_KEY}`
  )
});

const worldContract = {
  address:
    CONTRACT_ADDRESSES[
      process.env.CHAIN === "arbsepolia" ? arbitrumSepolia.id : arbitrum.id
    ]["SMOL_WORLD"],
  abi
} as const;

const getWorldInfo = async (worldTokenId: string) => {
  const tokenId = BigInt(worldTokenId);

  const allComponents = await client.readContract({
    ...worldContract,
    functionName: "getAllComponents"
  });

  const unlockedComponentIds = new Set(
    await client.readContract({
      ...worldContract,
      functionName: "getAllTokenUnlockedComponents",
      args: [BigInt(worldTokenId)]
    })
  );

  const components = await Promise.all(
    allComponents.map(async (component, index) => {
      const componentId = BigInt(index) + BigInt(1);
      const componentType = component.componentType;

      const isUnlocked = unlockedComponentIds.has(componentId);

      let canUnlock: boolean;
      try {
        canUnlock = !isUnlocked
          ? await client.readContract({
              ...worldContract,
              functionName: "canUnlockComponent",
              args: [tokenId, componentId, BigInt(0)]
            })
          : false;
      } catch (e) {
        canUnlock = false;
      }

      const tokenComponentData = await client.readContract({
        ...worldContract,
        functionName: "smolWorldIdToComponentIdToTokenComponentData",
        args: [tokenId, componentId]
      });

      const unlockTime = tokenComponentData[1];
      const currentLevel = tokenComponentData[2];

      let canUpgrade: boolean;
      try {
        canUpgrade = isUnlocked
          ? await client.readContract({
              ...worldContract,
              functionName: "canUnlockComponent",
              args: [tokenId, componentId, currentLevel + BigInt(1)]
            })
          : false;
      } catch (error) {
        canUpgrade = false;
      }

      return {
        type:
          componentType === 0
            ? "Island"
            : componentType === 1
            ? "Character"
            : componentType === 2
            ? "Building"
            : componentType === 3
            ? "Discovery"
            : "Unknown",
        name: component.componentName,
        level: Number(currentLevel) + 1,
        isUnlocked,
        canUnlock,
        canUpgrade,
        id: componentId.toString(),
        unlockTime: Number(unlockTime)
      };
    })
  );

  return components;
};

export type worldComponentsT = Awaited<ReturnType<typeof getWorldInfo>>;

export type WorldInfoT = {
  worldComponents: worldComponentsT;
  checkedInSmol: string | null;
};

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const worldTokenId = url.searchParams.get("worldTokenId");

  invariant(worldTokenId, "worldTokenId is required");

  try {
    const worldComponents = await getWorldInfo(worldTokenId);

    const smolData = await client.readContract({
      ...worldContract,
      functionName: "smolWorldIdToSmolData",
      args: [BigInt(worldTokenId)]
    });

    return json({
      ok: true,
      data: {
        worldComponents,
        checkedInSmol: smolData[0] ? smolData[1].toString() : null
      }
    });
  } catch (e: any) {
    return json({
      ok: false,
      error: e.message
    } as const);
  }
};
