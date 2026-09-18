import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Health check" })
  @ApiOkResponse({
    description: "API is healthy",
    schema: {
      example: {
        status: "ok",
        service: "crowdfunding-server",
      },
    },
  })
  getHealth() {
    return {
      status: "ok",
      service: "crowdfunding-server",
    };
  }
}
