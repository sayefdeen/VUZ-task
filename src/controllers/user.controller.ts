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
    email: string;
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
    const email = request.user.email;
    const shipments = await this.userService.allShipments(email, limit, page);
    return shipments;
  }

  @Post('/shipment')
  async createShipment(
    @Body() body: CreateShipmentDto,
    @Req() request: ExtendedRequest,
  ) {
    const userEmail = request.user.email;
    const shipment = await this.userService.createShipment(body, userEmail);
    return shipment;
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
