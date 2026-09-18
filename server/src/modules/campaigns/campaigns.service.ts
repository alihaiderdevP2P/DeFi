import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { SupabaseService } from "../../supabase/supabase.service";
import { CreateCampaignDto } from "./dto/create-campaign.dto";

interface UploadedImageFile {
  size: number;
  mimetype: string;
  originalname: string;
  buffer: Buffer;
}

@Injectable()
export class CampaignsService {
  constructor(private readonly supabase: SupabaseService) {}

  async uploadCampaignImage(file: UploadedImageFile) {
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new BadRequestException("Image must be 5MB or smaller");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestException("Only image files are allowed");
    }

    const imageUrl = await this.supabase.uploadCampaignImage(file);
    return { imageUrl };
  }

  async createCampaign(payload: CreateCampaignDto) {
    const wallet = payload.ownerWallet.toLowerCase();
    await this.supabase.db
      .from("users")
      .upsert({ wallet_address: wallet }, { onConflict: "wallet_address" });

    const { data, error } = await this.supabase.db
      .from("campaigns")
      .insert({
        onchain_campaign_id: payload.onchainCampaignId,
        owner_wallet: wallet,
        title: payload.title,
        description: payload.description,
        goal_eth: payload.goalEth,
        deadline: payload.deadline,
        image_url: payload.imageUrl ?? null,
      })
      .select("*")
      .single();

    this.supabase.ensureNoError(error);
    return data;
  }

  async getCampaigns() {
    const { data, error } = await this.supabase.db
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    this.supabase.ensureNoError(error);
    return data;
  }

  async getCampaignById(id: number) {
    const { data, error } = await this.supabase.db
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new NotFoundException("Campaign not found");
    return data;
  }
}
