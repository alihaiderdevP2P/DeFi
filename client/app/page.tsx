"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CampaignCard } from "../components/CampaignCard";
import { CampaignVM, defaultCampaigns, useCampaigns } from "../hooks/useCampaigns";

interface EditableDemoCard extends CampaignVM {
  isBlurred: boolean;
}

export default function HomePage() {
  const { data, isLoading, error } = useCampaigns();
  const [demoCards, setDemoCards] = useState<EditableDemoCard[]>(
    defaultCampaigns.map((campaign) => ({
      ...campaign,
      id: Math.abs(campaign.id),
      isBlurred: false,
    })),
  );

  const displayedCampaigns = useMemo(() => {
    if (data && data.length > 0) return data;
    return defaultCampaigns;
  }, [data]);

  const createDemoCard = () => {
    const nextId = Date.now();
    const createdCount = demoCards.filter((card) => card.title.startsWith("New Campaign")).length;
    setDemoCards((prev) => [
      {
        id: nextId,
        owner: "0x0000000000000000000000000000000000000000",
        title: `New Campaign ${createdCount + 1}`,
        description:
          "A newly created sample campaign card. Update this card with your own title, story, and funding goals.",
        goalEth: "5.0",
        pledgedEth: "0.0",
        deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14,
        imageUrl:
          "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=80",
        withdrawn: false,
        isBlurred: false,
      },
      ...prev,
    ]);
  };

  const updateDemoCard = (id: number) => {
    setDemoCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? {
              ...card,
              title: card.title.includes("Updated") ? card.title : `${card.title} (Updated)`,
              pledgedEth: (Number(card.pledgedEth) + 0.5).toFixed(1),
            }
          : card,
      ),
    );
  };

  const deleteDemoCard = (id: number) => {
    setDemoCards((prev) => prev.filter((card) => card.id !== id));
  };

  const toggleBlurCard = (id: number) => {
    setDemoCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, isBlurred: !card.isBlurred } : card)),
    );
  };

  return (
    <div className="space-y-10">
      <section className="app-panel overflow-hidden p-6 md:p-8">
        <p className="mb-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
          Blockchain Crowdfunding Platform
        </p>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
          Launch, manage, and scale transparent campaigns with confidence.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
          Professional fundraising workflow with secure wallet actions, campaign analytics,
          and rich storytelling support. Create better campaigns, engage supporters, and
          track impact in real time.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/create" className="app-button-primary">
            Start New Campaign
          </Link>
          <Link href="/dashboard" className="app-button-secondary">
            Open Dashboard
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Platform Highlights</h2>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Built for modern teams with a professional creator and donor experience.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="app-panel p-4">
            <h3 className="font-semibold">Smart Contract Escrow</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Campaign funds stay transparent and auditable from creation to payout.
            </p>
          </article>
          <article className="app-panel p-4">
            <h3 className="font-semibold">Creator Tooling</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Rich campaign creation flow with image upload, goals, and deadline setup.
            </p>
          </article>
          <article className="app-panel p-4">
            <h3 className="font-semibold">Operations Ready</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Theme support, wallet integration, API docs, and dashboard monitoring.
            </p>
          </article>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Default Cards (Create/Update/Delete)</h2>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Demo manager to preview card operations with blur functionality.
            </p>
          </div>
          <button onClick={createDemoCard} className="app-button-primary">
            Create Card
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {demoCards.map((card) => (
            <article key={card.id} className="app-panel overflow-hidden p-4">
              <div className={card.isBlurred ? "space-y-2 blur-sm transition" : "space-y-2 transition"}>
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                ) : null}
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                  {card.description}
                </p>
                <p className="text-sm font-medium">
                  {card.pledgedEth} / {card.goalEth} ETH
                </p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateDemoCard(card.id)}
                  className="app-button-secondary text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => toggleBlurCard(card.id)}
                  className="app-button-secondary text-sm"
                >
                  {card.isBlurred ? "Unblur" : "Blur"}
                </button>
                <button
                  onClick={() => deleteDemoCard(card.id)}
                  className="col-span-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-500"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Active Campaigns</h2>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Discover and support verified fundraising campaigns.
          </p>
          {isLoading ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Loading campaigns...</p>
          ) : null}
          {error ? (
            <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">
              Live campaigns failed to load. Showing default campaigns.
            </p>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </section>
    </div>
  );
}
