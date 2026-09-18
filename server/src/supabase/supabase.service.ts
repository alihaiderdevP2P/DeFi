import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface UploadedImageFile {
  mimetype: string;
  originalname: string;
  buffer: Buffer;
}

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;
  private readonly campaignImagesBucket: string;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required",
      );
    }
    this.client = createClient(url, key);
    this.campaignImagesBucket =
      process.env.SUPABASE_STORAGE_BUCKET || "campaign-images";
  }

  get db() {
    return this.client;
  }

  ensureNoError(error: { message: string } | null) {
    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async uploadCampaignImage(file: UploadedImageFile): Promise<string> {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filePath = `campaigns/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}-${safeName}`;

    const { error: uploadError } = await this.client.storage
      .from(this.campaignImagesBucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });
    this.ensureNoError(uploadError);

    const { data } = this.client.storage
      .from(this.campaignImagesBucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}
