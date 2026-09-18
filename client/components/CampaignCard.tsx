import Link from "next/link";
import { CampaignVM } from "../hooks/useCampaigns";
import { ProgressBar } from "./ProgressBar";

interface Props {
  campaign: CampaignVM;
}

export function CampaignCard({ campaign }: Props) {
  const isDemoCampaign = campaign.id < 0;

  return (
    <article className="app-panel p-4">
      {campaign.imageUrl ? (
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="mb-3 h-44 w-full rounded-lg object-cover"
        />
      ) : null}
      <h3 className="text-lg font-semibold">{campaign.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
        {campaign.description}
      </p>
      <div className="mt-3">
        <ProgressBar
          current={Number(campaign.pledgedEth)}
          goal={Number(campaign.goalEth)}
        />
      </div>
      <p className="mt-2 text-sm">
        {campaign.pledgedEth} / {campaign.goalEth} ETH
      </p>
      {isDemoCampaign ? (
        <p className="mt-3 rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
          Demo preview campaign. Create your own campaign to start fundraising.
        </p>
      ) : (
        <Link
          href={`/campaign/${campaign.id}`}
          className="app-button-primary mt-3 inline-block text-sm"
        >
          View Details
        </Link>
      )}
    </article>
  );
}
