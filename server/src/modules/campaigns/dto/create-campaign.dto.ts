import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
} from "class-validator";

export class CreateCampaignDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  onchainCampaignId!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerWallet!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: "5.0" })
  @IsString()
  @IsNotEmpty()
  goalEth!: string;

  @ApiProperty()
  @IsDateString()
  deadline!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
