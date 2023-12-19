import { useFetcher } from "@remix-run/react";
import { formatEther } from "viem";
import { Header } from "~/components/Header";
import type { loader as inventoryLoader } from "../get-inventory.$address";
import school from "./school.webp";
import { Popover, PopoverContent } from "~/components/ui/popover";
import { PopoverArrow, PopoverTrigger } from "@radix-ui/react-popover";
import { TroveToken } from "~/api.server";
import {
  usePrepareSchoolJoinStat,
  usePrepareSchoolLeaveStat,
  useSchoolJoinStat,
  useSchoolLeaveStat,
  useSchoolTokenDetails
} from "~/generated";
import { useContractAddresses } from "~/useChainAddresses";
import { useAccount, useWaitForTransaction } from "wagmi";
import { Icon } from "~/components/Icons";
import { useEffect } from "react";
import { Loading } from "~/components/Loading";
import { ConnectKitButton } from "connectkit";

export default function School() {
  const { address } = useAccount();
  const fetcher = useFetcher<typeof inventoryLoader>({ key: "inventory" });

  const smols =
    fetcher.data && fetcher.data.ok
      ? fetcher.data.data?.["smol-brains"] ?? []
      : [];

  const isLoading = fetcher.state === "loading";

  return (
    <div className="flex h-full flex-col">
      <Header name="School" blendColor="#1938F2" />
      <div className="relative h-full flex-1 bg-cover bg-blend-color-burn [background-color:#39135F] [background-image:url(/img/schoolBg.webp)]">
        {
          <div className="absolute right-4 top-2 sm:top-4">
            <ConnectKitButton />
          </div>
        }
        <div className="relative mx-auto flex h-full max-w-3xl flex-col items-center space-y-5 px-4 pt-14 sm:pt-12">
          <img src={school} className="aspect-video" alt="school" />
          <div className="flex min-h-0 w-full flex-1 flex-col border-x-4 border-t-4 border-grayOne">
            <p className="bg-grayOne px-2 py-2.5 font-bold text-white font-formula leading-none capsize">
              Your Smols
            </p>
            {!address ? (
              <div className="grid flex-1 place-items-center">
                <div className="flex flex-col items-center space-y-2">
                  <Icon name="alert" className="h-12 w-12 text-grayOne" />
                  <p className="font-bold text-grayOne font-neuebit text-lg sm:text-2xl">
                    You need to connect your wallet to see your smols.
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
                {smols.map((smol) => {
                  return <Smol key={smol.tokenId} token={smol} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Smol = ({ token }: { token: TroveToken }) => {
  const contractAddresses = useContractAddresses();
  const { data: tokenDetails, refetch } = useSchoolTokenDetails({
    address: contractAddresses["SCHOOL"],
    args: [token.collectionAddr, BigInt(0), BigInt(token.tokenId)]
  });

  const inSchool = tokenDetails?.[2];
  const acquiredIQ = parseFloat(formatEther(tokenDetails?.[1] ?? BigInt(0)));

  // JOIN SCHOOL
  const { config: joinSchoolConfig } = usePrepareSchoolJoinStat({
    address: contractAddresses["SCHOOL"],
    args: [token.collectionAddr, BigInt(0), [BigInt(token.tokenId)]],
    enabled: !inSchool
  });

  const joinSchool = useSchoolJoinStat(joinSchoolConfig);

  const { isSuccess: isJoinSuccess } = useWaitForTransaction(joinSchool.data);

  // LEAVE SCHOOL
  const { config: leaveSchoolConfig } = usePrepareSchoolLeaveStat({
    address: contractAddresses["SCHOOL"],
    args: [token.collectionAddr, BigInt(0), [BigInt(token.tokenId)]],
    enabled: inSchool
  });

  const leaveSchool = useSchoolLeaveStat(leaveSchoolConfig);

  const { isSuccess: isLeaveSuccess } = useWaitForTransaction(leaveSchool.data);

  useEffect(() => {
    if (isJoinSuccess || isLeaveSuccess) {
      refetch?.();
    }
  }, [isJoinSuccess, isLeaveSuccess]);

  const iq =
    ((token.metadata.attributes.find((a) => a.trait_type === "IQ")
      ?.value as number) ?? 0) + acquiredIQ;

  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger asChild>
          <button className="absolute inset-0 z-10 h-full w-full">
            <span className="sr-only">View smol brain {token.tokenId}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          sideOffset={8}
          className="w-52 rounded-none border-none bg-vroom p-3"
        >
          <div className="flex flex-col items-center">
            <p className="font-bold text-white font-formula text-2xl">
              SMOL BRAIN {token.tokenId}
            </p>
            <div className="mt-2 w-full space-y-1.5">
              <div className="flex items-center justify-center space-x-2 bg-[#36225E] px-4 py-3">
                <Icon name="brain" className="h-6 w-6 text-white" />
                <span className="font-extrabold text-grayTwo font-formula leading-none capsize">
                  {new Intl.NumberFormat("en-US").format(iq)}
                </span>
              </div>
              <button
                className="inline-flex h-12 w-full items-center justify-center bg-acid py-4 font-bold font-formula disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() =>
                  inSchool ? leaveSchool.write?.() : joinSchool.write?.()
                }
              >
                {inSchool ? "LEAVE SCHOOL" : "JOIN SCHOOL"}
              </button>
            </div>
          </div>
          <PopoverArrow className="fill-vroom" />
        </PopoverContent>
        <img src={token.image.uri} className="rounded-xl" />
        {inSchool && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-50">
            <Icon name="brain" className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
    </Popover>
  );
};
