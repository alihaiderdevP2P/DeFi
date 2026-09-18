"use client";

import { useCallback, useEffect, useState } from "react";
import { getBrowserProvider, getWriteContract } from "../lib/ethers";

export function useContract() {
  const [walletAddress, setWalletAddress] = useState<string>("");

  const connectWallet = useCallback(async () => {
    const provider = await getBrowserProvider();
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);
    return address;
  }, []);

  const getContract = useCallback(async () => {
    if (!walletAddress) await connectWallet();
    return getWriteContract();
  }, [walletAddress, connectWallet]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const eth = (
      window as {
        ethereum?: {
          on?: (event: string, cb: (accounts: string[]) => void) => void;
        };
      }
    ).ethereum;
    if (!eth?.on) return;
    eth.on("accountsChanged", (accounts: string[]) => {
      setWalletAddress(accounts[0] || "");
    });
  }, []);

  return { walletAddress, connectWallet, getContract };
}
