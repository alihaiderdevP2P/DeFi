"use client";

import { useContract } from "../hooks/useContract";

export function WalletButton() {
  const { walletAddress, connectWallet } = useContract();

  return (
    <button
      onClick={() => void connectWallet()}
      className="app-button-primary text-sm"
    >
      {walletAddress
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : "Connect MetaMask"}
    </button>
  );
}
