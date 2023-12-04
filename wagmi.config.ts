import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { abi } from "./app/artifacts/erc1155";
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
      abi
    }
  ],
  plugins: [react()]
});
