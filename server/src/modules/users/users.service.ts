import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../../supabase/supabase.service";

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  async getByWallet(walletAddress: string) {
    const { data, error } = await this.supabase.db
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress.toLowerCase())
      .single();

    if (error) return null;
    return data;
  }
}
