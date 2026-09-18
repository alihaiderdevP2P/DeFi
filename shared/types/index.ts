export interface Campaign {
  id: number;
  owner: string;
  title: string;
  description: string;
  goalWei: string;
  pledgedWei: string;
  deadline: number;
  imageUrl?: string | null;
  withdrawn: boolean;
}

export interface DonationRecord {
  id: number;
  onchainCampaignId: number;
  donorWallet: string;
  amountEth: string;
  txHash?: string | null;
  createdAt: string;
}

export interface CreateCampaignPayload {
  onchainCampaignId: number;
  ownerWallet: string;
  title: string;
  description: string;
  goalEth: string;
  deadline: string;
  imageUrl?: string;
}
