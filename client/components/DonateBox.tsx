"use client";

import { parseEther } from "ethers";
import { useState } from "react";
import { useContract } from "../hooks/useContract";
import { storeDonation } from "../services/api";

interface Props {
  campaignId: number;
}

export function DonateBox({ campaignId }: Props) {
  const [amount, setAmount] = useState("0.01");
  const [loading, setLoading] = useState(false);
  const { connectWallet, getContract } = useContract();

  const donate = async () => {
    try {
      setLoading(true);
      const wallet = await connectWallet();
      const contract = await getContract();
      const tx = await contract.donateToCampaign(campaignId, {
        value: parseEther(amount),
      });
      const receipt = await tx.wait();

      await storeDonation({
        campaignId,
        onchainCampaignId: campaignId,
        donorWallet: wallet,
        amountEth: amount,
        txHash: receipt?.hash,
      });

      alert("Donation sent successfully");
    } catch (error) {
      console.error(error);
      alert("Donation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-panel p-4">
      <label className="mb-2 block text-sm">Donation Amount (ETH)</label>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="app-input"
        placeholder="0.05"
      />
      <button
        onClick={() => void donate()}
        disabled={loading}
        className="app-button-primary mt-3 w-full"
      >
        {loading ? "Processing..." : "Donate"}
      </button>
    </div>
  );
}
