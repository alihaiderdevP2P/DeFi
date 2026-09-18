"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useCampaigns } from "../../../hooks/useCampaigns";
import { ProgressBar } from "../../../components/ProgressBar";
import { DonateBox } from "../../../components/DonateBox";
import { useContract } from "../../../hooks/useContract";

export default function CampaignDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data, refetch } = useCampaigns();
  const { getContract } = useContract();
  const [loadingAction, setLoadingAction] = useState(false);

  const campaign = useMemo(() => data?.find((c) => c.id === id), [data, id]);

  const withdraw = async () => {
    try {
      setLoadingAction(true);
      const contract = await getContract();
      const tx = await contract.withdrawFunds(id);
      await tx.wait();
      await refetch();
      alert("Funds withdrawn");
    } catch (error) {
      console.error(error);
      alert("Withdraw failed");
    } finally {
      setLoadingAction(false);
    }
  };

  const refund = async () => {
    try {
      setLoadingAction(true);
      const contract = await getContract();
      const tx = await contract.refundDonors(id);
      await tx.wait();
      await refetch();
      alert("Refund claimed");
    } catch (error) {
      console.error(error);
      alert("Refund failed");
    } finally {
      setLoadingAction(false);
    }
  };

  if (!campaign) {
    return <p className="text-slate-600 dark:text-slate-300">Campaign not found.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <section className="app-panel space-y-4 p-5 md:col-span-2">
        {campaign.imageUrl ? (
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="h-72 w-full rounded-lg object-cover"
          />
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight">{campaign.title}</h1>
        <p className="text-slate-600 dark:text-slate-300">{campaign.description}</p>
        <ProgressBar
          current={Number(campaign.pledgedEth)}
          goal={Number(campaign.goalEth)}
        />
        <p className="font-medium">
          Raised {campaign.pledgedEth} / {campaign.goalEth} ETH
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Owner: {campaign.owner}
        </p>
      </section>
      <aside className="space-y-3">
        <DonateBox campaignId={campaign.id} />
        <button
          onClick={() => void withdraw()}
          disabled={loadingAction}
          className="app-button-primary w-full"
        >
          Withdraw (Owner)
        </button>
        <button
          onClick={() => void refund()}
          disabled={loadingAction}
          className="app-button-secondary w-full"
        >
          Claim Refund
        </button>
      </aside>
    </div>
  );
}
