import { Module } from "@nestjs/common";
import { CampaignsModule } from "./campaigns/campaigns.module";
import { DonationsModule } from "./donations/donations.module";
import { UsersModule } from "./users/users.module";
import { SupabaseModule } from "../supabase/supabase.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [SupabaseModule, CampaignsModule, DonationsModule, UsersModule],
  controllers: [HealthController],
})
export class AppModule {}
