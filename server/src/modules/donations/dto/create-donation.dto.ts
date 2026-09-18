import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from "class-validator";

export class CreateDonationDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  campaignId!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  onchainCampaignId!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  donorWallet!: string;

  @ApiProperty({ example: "0.05" })
  @IsString()
  @IsNotEmpty()
  amountEth!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  txHash?: string;
}
