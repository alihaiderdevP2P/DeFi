"use client";

import { parseEther } from "ethers";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContract } from "../../hooks/useContract";
import {
  createCampaignMetadata,
  uploadCampaignImage,
} from "../../services/api";

export default function CreateCampaignPage() {
  const router = useRouter();
  const { connectWallet, getContract } = useContract();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    goalEth: "1",
    deadline: "",
    imageUrl: "",
  });

  const handleImageSelect = async (file?: File) => {
    if (!file) return;
    setImageError(null);
    setUploadingImage(true);
    try {
      const { imageUrl } = await uploadCampaignImage(file);
      setForm((prev) => ({ ...prev, imageUrl }));
    } catch (error) {
      console.error(error);
      setImageError("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage) {
      alert("Please wait for image upload to finish");
      return;
    }
    setLoading(true);
    try {
      const owner = await connectWallet();
      const contract = await getContract();
      const unixDeadline = Math.floor(new Date(form.deadline).getTime() / 1000);
      const tx = await contract.createCampaign(
        form.title,
        form.description,
        parseEther(form.goalEth),
        unixDeadline,
        form.imageUrl,
      );
      const receipt = await tx.wait();
      const evt = receipt?.logs?.find(
        (log: { fragment?: { name?: string } }) =>
          log.fragment?.name === "CampaignCreated",
      );
      const campaignId = Number(evt?.args?.[0] ?? 0);

      await createCampaignMetadata({
        onchainCampaignId: campaignId,
        ownerWallet: owner,
        title: form.title,
        description: form.description,
        goalEth: form.goalEth,
        deadline: new Date(form.deadline).toISOString(),
        imageUrl: form.imageUrl || undefined,
      });

      router.push(`/campaign/${campaignId}`);
    } catch (error) {
      console.error(error);
      alert("Create campaign failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Create Campaign
      </h1>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        Launch your campaign with a polished title, story, and hero image.
      </p>
      <section className="app-panel mb-6 space-y-3 p-4">
        <h2 className="text-lg font-semibold">
          Full guide: create a strong campaign
        </h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>
            Choose a specific goal amount and explain exactly how funds will be
            used.
          </li>
          <li>
            Write a clear problem statement, your plan, and measurable outcomes.
          </li>
          <li>
            Add one high-quality cover image so supporters trust your campaign
            quickly.
          </li>
          <li>
            Set a realistic deadline and share regular updates after launch.
          </li>
          <li>
            Keep your description transparent: budget, timeline, risks, and
            impact.
          </li>
        </ol>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Suggested description template: "What problem are you solving? Who
          benefits? How will each part of the budget be spent? What outcomes
          will supporters see in 30-90 days?"
        </p>
      </section>
      <form onSubmit={submit} className="app-panel space-y-3 p-5">
        <input
          className="app-input"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="app-input min-h-28"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          className="app-input"
          placeholder="Funding goal ETH"
          value={form.goalEth}
          onChange={(e) => setForm({ ...form, goalEth: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          className="app-input"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          required
        />
        <input
          className="app-input"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        <input
          type="file"
          className="app-input file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-white"
          accept="image/*"
          onChange={(e) => handleImageSelect(e.target.files?.[0])}
          disabled={uploadingImage || loading}
        />
        {uploadingImage && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Uploading image...
          </p>
        )}
        {imageError && <p className="text-sm text-rose-400">{imageError}</p>}
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Campaign preview"
            className="h-44 w-full rounded-lg object-cover"
          />
        )}
        <button
          className="app-button-primary w-full"
          disabled={loading || uploadingImage}
        >
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </form>
    </div>
  );
}
