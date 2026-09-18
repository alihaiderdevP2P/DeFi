import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

export async function createCampaignMetadata(payload: {
  onchainCampaignId: number;
  ownerWallet: string;
  title: string;
  description: string;
  goalEth: string;
  deadline: string;
  imageUrl?: string;
}) {
  const { data } = await api.post("/campaigns", payload);
  return data;
}

export async function uploadCampaignImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/campaigns/upload-image", formData);
  return data as { imageUrl: string };
}

export async function storeDonation(payload: {
  campaignId: number;
  onchainCampaignId: number;
  donorWallet: string;
  amountEth: string;
  txHash?: string;
}) {
  const { data } = await api.post("/donations", payload);
  return data;
}

export async function getCampaignMetadata() {
  const { data } = await api.get("/campaigns");
  return data;
}
