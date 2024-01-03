import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import * as ABIs from "./app/artifacts";
import { erc20ABI, erc721ABI } from "wagmi";

export default defineConfig({
  out: "app/generated.ts",
  contracts: [
    {
      name: "ERC20",
      abi: erc20ABI
    },
    {
      name: "ERC721",
      abi: erc721ABI
    },
    {
      name: "ERC1155",
      abi: ABIs.ERC1155
    },
    {
      name: "SCHOOL",
      abi: ABIs.SCHOOL
    },
    {
      name: "GYM",
      abi: ABIs.GYM
    },
    {
      name: "SMOL_WORLD",
      abi: ABIs.SMOL_WORLD
    }
  ],
  plugins: [react()]
});
