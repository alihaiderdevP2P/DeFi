import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../../supabase/supabase.service";
import { CreateDonationDto } from "./dto/create-donation.dto";

@Injectable()
export class DonationsService {
  constructor(private readonly supabase: SupabaseService) {}

  async createDonation(payload: CreateDonationDto) {
    const wallet = payload.donorWallet.toLowerCase();
    await this.supabase.db
      .from("users")
      .upsert({ wallet_address: wallet }, { onConflict: "wallet_address" });

    const { data, error } = await this.supabase.db
      .from("donations")
      .insert({
        campaign_id: payload.campaignId,
        onchain_campaign_id: payload.onchainCampaignId,
        donor_wallet: wallet,
        amount_eth: payload.amountEth,
        tx_hash: payload.txHash ?? null,
      })
      .select("*")
      .single();

    this.supabase.ensureNoError(error);
    return data;
  }
}
