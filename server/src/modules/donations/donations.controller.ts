import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DonationsService } from "./donations.service";
import { CreateDonationDto } from "./dto/create-donation.dto";

@ApiTags("donations")
@Controller("donations")
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  createDonation(@Body() body: CreateDonationDto) {
    return this.donationsService.createDonation(body);
  }
}
