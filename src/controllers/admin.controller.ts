import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CreateShipmentDto } from 'src/dtos';
import { AdminInterceptor, AuthenticationInterceptor } from 'src/interceptors';
import { AdminService } from 'src/services';

interface ExtendedRequest extends Request {
  user: {
    email: string;
  };
}

@Controller('admin')
@UseInterceptors(AuthenticationInterceptor)
@UseInterceptors(AdminInterceptor)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Patch('/approve')
  @HttpCode(204)
  async approveUser(
    @Query('email') email: string,
    @Req() request: ExtendedRequest,
  ) {
    const userEmail = request.user.email;
    this.adminService.approveUser(email, userEmail);
  }

  @Patch('/disable')
  @HttpCode(204)
  async rejectUser(
    @Query('email') email: string,
    @Req() request: ExtendedRequest,
  ) {
    const userEmail = request.user.email;
    this.adminService.rejectUser(email, userEmail);
  }

  @Get('/shipment')
  async allShipments(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const shipments = await this.adminService.listShipments(limit, page);
    return shipments;
  }

  @Post('/shipment')
  async createShipment(
    @Body() body: CreateShipmentDto,
    @Req() request: ExtendedRequest,
  ) {
    const userEmail = request.user.email;
    const shipment = await this.adminService.createShipment(body, userEmail);
    return shipment;
  }

  @Patch('/shipment/:id')
  async updateShipment(
    @Param('id') shipmentId: string,
    @Body() body: Partial<CreateShipmentDto>,
  ) {
    const shipment = await this.adminService.updateShipment(shipmentId, body);
    return shipment;
  }

  @Delete('/shipment/:id')
  @HttpCode(204)
  async deleteShipment(@Param('id') shipmentId: string) {
    this.adminService.deleteShipment(shipmentId);
  }
}
