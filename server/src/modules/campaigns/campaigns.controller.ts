import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  UploadedFile,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { CampaignsService } from "./campaigns.service";
import { CreateCampaignDto } from "./dto/create-campaign.dto";

interface UploadedImageFile {
  size: number;
  mimetype: string;
  originalname: string;
  buffer: Buffer;
}

@ApiTags("campaigns")
@Controller("campaigns")
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  createCampaign(@Body() body: CreateCampaignDto) {
    return this.campaignsService.createCampaign(body);
  }

  @Post("upload-image")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor("image"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          format: "binary",
        },
      },
      required: ["image"],
    },
  })
  async uploadImage(@UploadedFile() file?: UploadedImageFile) {
    if (!file) {
      throw new BadRequestException("Image file is required");
    }
    return this.campaignsService.uploadCampaignImage(file);
  }

  @Get()
  getCampaigns() {
    return this.campaignsService.getCampaigns();
  }

  @Get(":id")
  getCampaignById(@Param("id", ParseIntPipe) id: number) {
    return this.campaignsService.getCampaignById(id);
  }
}
