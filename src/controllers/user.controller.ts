import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CreateShipmentDto, ShipmentFeedBack } from 'src/dtos';
import { AuthenticationInterceptor } from 'src/interceptors';
import { UserService } from 'src/services';

interface ExtendedRequest extends Request {
  user: {
    ـid: string;
  };
}

@Controller('user')
@UseInterceptors(AuthenticationInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/shipment')
  async allShipments(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Req() request: ExtendedRequest,
  ) {
    const userId = request.user.ـid;
    const shipments = await this.userService.allShipments(userId, limit, page);
    return shipments;
  }

  @Patch('/shipment/:id')
  async updateShipment(
    @Param('id') shipmentId: string,
    @Body() body: Partial<CreateShipmentDto>,
  ) {
    const shipments = await this.userService.updateShipment(shipmentId, body);
    return shipments;
  }

  @Delete('/shipment/:id')
  async cancelShipment(@Param('id') shipmentId: string) {
    const shipments = await this.userService.cancelShipment(shipmentId);
    return shipments;
  }

  @Post('/shipment/feedBack/:id')
  async shipmentFeedBack(
    @Param('id') shipmentId: string,
    @Body() body: ShipmentFeedBack,
  ) {
    const shipments = await this.userService.updateFeedBack(shipmentId, body);
    return shipments;
  }
}
