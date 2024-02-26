import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateShipmentDto } from 'src/dtos';
import { AdminInterceptor, AuthenticationInterceptor } from 'src/interceptors';
import { AdminService } from 'src/services';

@Controller('admin')
@UseInterceptors(AuthenticationInterceptor)
@UseInterceptors(AdminInterceptor)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Patch('/approve/:email')
  async approveUser(@Param('email') email: string) {
    this.adminService.approveUser(email);
    return HttpStatus.NO_CONTENT;
  }

  @Patch('/disable/:email')
  async rejectUser(@Param('email') email: string) {
    this.adminService.rejectUser(email);
    return HttpStatus.NO_CONTENT;
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
  async createShipment(@Body() body: CreateShipmentDto) {
    const shipment = await this.adminService.createShipment(body);
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
  async deleteShipment(@Param('id') shipmentId: string) {
    this.adminService.deleteShipment(shipmentId);
    return HttpStatus.NO_CONTENT;
  }
}
