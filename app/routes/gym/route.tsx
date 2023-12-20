import { useFetcher } from "@remix-run/react";
import { formatEther } from "viem";
import { Header } from "~/components/Header";
import type { loader as inventoryLoader } from "../get-inventory.$address";
import gym from "./gym.webp";
import { Popover, PopoverContent } from "~/components/ui/popover";
import { PopoverArrow, PopoverTrigger } from "@radix-ui/react-popover";
import { TroveToken } from "~/api.server";
import {
  useGymDrop,
  useGymIsAtGym,
  useGymJoin,
  useGymPlatesEarned,
  usePrepareGymDrop,
  usePrepareGymJoin
} from "~/generated";
import { useContractAddresses } from "~/useChainAddresses";
import { useAccount, useWaitForTransaction } from "wagmi";
import { Icon } from "~/components/Icons";
import { useEffect } from "react";
import { Loading } from "~/components/Loading";
import { ConnectKitButton } from "connectkit";
import Weight from "./weight.webp";
import Dumbel from "./dumbel.webp";

export default function Gym() {
  const { address } = useAccount();
  const fetcher = useFetcher<typeof inventoryLoader>({ key: "inventory" });

  const swols =
    fetcher.data && fetcher.data.ok
      ? fetcher.data.data?.["smol-bodies"] ?? []
      : [];

  const isLoading = fetcher.state === "loading";

  return (
    <div className="flex h-full flex-col">
      <Header name="Gym" blendColor="#FF0000" />
      <div className="relative h-full flex-1 overflow-hidden [background-image:url(/img/gymBg.webp)]">
        <div className="absolute right-4 top-2 sm:top-4">
          <ConnectKitButton />
        </div>
        <img
          src={Weight}
          className="absolute bottom-0 right-[5%]"
          alt="weights"
        />
        <img
          src={Weight}
          className="absolute right-3/4 top-1/2"
          alt="weights"
        />

        <img src={Weight} className="absolute left-3/4 top-1/3" alt="weights" />
        <img
          src={Weight}
          className="absolute left-[20%] top-3/4"
          alt="weights"
        />

        <div className="relative mx-auto flex h-full max-w-3xl flex-col items-center space-y-5 px-4 pt-14 sm:pt-12">
          <img src={gym} className="aspect-video" alt="gym" />
          <div className="flex min-h-0 w-full flex-1 flex-col border-x-4 border-t-4 border-grayOne">
            <p className="bg-grayOne px-2 py-2.5 font-bold text-white font-formula leading-none capsize">
              Your Swols
            </p>
            {!address ? (
              <div className="grid flex-1 place-items-center">
                <div className="flex flex-col items-center space-y-2">
                  <Icon name="alert" className="h-12 w-12 text-grayOne" />
                  <p className="font-bold text-grayOne font-neuebit text-lg sm:text-2xl">
                    You need to connect your wallet to see your swols.
                  </p>
                  <ConnectKitButton />
                </div>
              </div>
            ) : isLoading ? (
              <div className="grid flex-1 place-items-center">
                <Loading className="h-12 w-12 text-white" />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3.5 overflow-auto bg-[#3F3546] px-4 py-4 [flex:1_1_0] [grid-auto-rows:min-content] sm:grid-cols-8">
                {swols.map((swols) => {
                  return <Swol key={swols.tokenId} token={swols} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Swol = ({ token }: { token: TroveToken }) => {
  const contractAddresses = useContractAddresses();
  const { data: inGym, refetch } = useGymIsAtGym({
    address: contractAddresses["GYM"],
    args: [BigInt(token.tokenId)]
  });
  const { data: platesEarned } = useGymPlatesEarned({
    address: contractAddresses["GYM"],
    args: [BigInt(token.tokenId)]
  });

  const acquiredPlates = parseFloat(formatEther(platesEarned ?? BigInt(0)));

  // JOIN GYM
  const { config: joinGymConfig } = usePrepareGymJoin({
    address: contractAddresses["GYM"],
    args: [BigInt(token.tokenId)],
    enabled: !inGym
  });

  const joinGym = useGymJoin(joinGymConfig);

  const { isSuccess: isJoinSuccess } = useWaitForTransaction(joinGym.data);

  // LEAVE GYM
  const { config: leaveGymConfig } = usePrepareGymDrop({
    address: contractAddresses["GYM"],
    args: [BigInt(token.tokenId)],
    enabled: inGym
  });

  const leaveGym = useGymDrop(leaveGymConfig);

  const { isSuccess: isLeaveSuccess } = useWaitForTransaction(leaveGym.data);

  useEffect(() => {
    if (isJoinSuccess || isLeaveSuccess) {
      refetch?.();
    }
  }, [isJoinSuccess, isLeaveSuccess]);

  const plates =
    ((token.metadata.attributes.find((a) => a.trait_type === "Plates")
      ?.value as number) ?? 0) + acquiredPlates ?? 0;

  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger asChild>
          <button className="absolute inset-0 z-10 h-full w-full">
            <span className="sr-only">View smol body {token.tokenId}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          sideOffset={8}
          className="w-52 rounded-none border-none bg-vroom p-3"
        >
          <div className="flex flex-col items-center">
            <p className="font-bold text-white font-formula text-2xl">
              SMOL BODY {token.tokenId}
            </p>
            <div className="mt-2 w-full space-y-1.5">
              <div className="flex items-center justify-center space-x-2 bg-[#36225E] px-4 py-3">
                <Icon name="brain" className="h-6 w-6 text-white" />
                <span className="font-extrabold text-grayTwo font-formula leading-none capsize">
                  {new Intl.NumberFormat("en-US").format(plates)}
                </span>
              </div>
              <button
                className="inline-flex h-12 w-full items-center justify-center bg-acid py-4 font-bold font-formula disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => (inGym ? leaveGym.write?.() : joinGym.write?.())}
              >
                {inGym ? "LEAVE GYM" : "JOIN GYM"}
              </button>
            </div>
          </div>
          <PopoverArrow className="fill-vroom" />
        </PopoverContent>
        <img src={token.image.uri} className="rounded-xl" />
        {inGym && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
            <img src={Dumbel} className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
    </Popover>
  );
};
