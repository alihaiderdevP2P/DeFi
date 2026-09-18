"use client";

import { useQuery } from "@tanstack/react-query";
import { formatEther } from "ethers";
import { getReadContract } from "../lib/ethers";

export interface CampaignVM {
  id: number;
  owner: string;
  title: string;
  description: string;
  goalEth: string;
  pledgedEth: string;
  deadline: number;
  imageUrl: string;
  withdrawn: boolean;
}

export const defaultCampaigns: CampaignVM[] = [
  {
    id: -1,
    owner: "0x0000000000000000000000000000000000000000",
    title: "Solar Classroom For Rural School",
    description:
      "Help us install solar panels and battery storage so 500 students can study with reliable electricity every day.",
    goalEth: "15.0",
    pledgedEth: "3.8",
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 25,
    imageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80",
    withdrawn: false,
  },
  {
    id: -2,
    owner: "0x0000000000000000000000000000000000000000",
    title: "Mobile Health Camp In Villages",
    description:
      "Fund medical supplies and transport for monthly doctor visits to remote communities with limited healthcare access.",
    goalEth: "9.5",
    pledgedEth: "5.2",
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 18,
    imageUrl:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80",
    withdrawn: false,
  },
  {
    id: -3,
    owner: "0x0000000000000000000000000000000000000000",
    title: "Women-Led Skills Training Center",
    description:
      "Support equipment and trainer salaries for a center teaching digital and vocational skills to women entrepreneurs.",
    goalEth: "12.0",
    pledgedEth: "7.4",
    deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    imageUrl:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    withdrawn: false,
  },
];

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async (): Promise<CampaignVM[]> => {
      const contract = getReadContract();
      const count = Number(await contract.campaignCount());
      const rows = await Promise.all(
        [...Array(count)].map(async (_, i) => {
          const c = await contract.campaigns(i);
          return {
            id: i,
            owner: c.owner,
            title: c.title,
            description: c.description,
            goalEth: formatEther(c.goal),
            pledgedEth: formatEther(c.pledged),
            deadline: Number(c.deadline),
            imageUrl: c.imageUrl || "",
            withdrawn: c.withdrawn,
          };
        }),
      );
      if (rows.length === 0) return defaultCampaigns;
      return rows.reverse();
    },
  });
}
