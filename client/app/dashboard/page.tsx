"use client";

import { useMemo } from "react";
import { useCampaigns } from "../../hooks/useCampaigns";
import { useContract } from "../../hooks/useContract";
import { CampaignCard } from "../../components/CampaignCard";

export default function DashboardPage() {
  const { data } = useCampaigns();
  const { walletAddress } = useContract();

  const myCampaigns = useMemo(
    () =>
      data?.filter(
        (campaign) =>
          campaign.owner.toLowerCase() === walletAddress.toLowerCase(),
      ) ?? [],
    [data, walletAddress],
  );

  return (
    <div>
      <h1 className="mb-3 text-3xl font-bold tracking-tight">My Dashboard</h1>
      {!walletAddress && (
        <p className="mb-4 text-slate-600 dark:text-slate-300">
          Connect wallet to view your campaigns.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {myCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
