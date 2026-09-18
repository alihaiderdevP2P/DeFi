import {
  BrowserProvider,
  JsonRpcProvider,
  Contract,
  type Eip1193Provider,
} from "ethers";
import { CROWDFUNDING_ABI } from "./contractABI";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const FALLBACK_RPC = process.env.NEXT_PUBLIC_RPC_URL || "";

export function getReadProvider() {
  if (FALLBACK_RPC) return new JsonRpcProvider(FALLBACK_RPC);
  return null;
}

export async function getBrowserProvider() {
  if (
    typeof window === "undefined" ||
    !(window as { ethereum?: Eip1193Provider }).ethereum
  ) {
    throw new Error("MetaMask not found");
  }
  const provider = new BrowserProvider(
    (window as { ethereum: Eip1193Provider }).ethereum,
  );
  await provider.send("eth_requestAccounts", []);
  return provider;
}

export async function getWriteContract() {
  const provider = await getBrowserProvider();
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, CROWDFUNDING_ABI, signer);
}

export function getReadContract() {
  const provider = getReadProvider();
  if (!provider) throw new Error("Missing NEXT_PUBLIC_RPC_URL");
  return new Contract(CONTRACT_ADDRESS, CROWDFUNDING_ABI, provider);
}
