import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DeliveryVehicleType } from 'src/enums';

export class CreateShipmentDto {
  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsNotEmpty()
  deliveryTimeStart: string;

  @IsString()
  @IsNotEmpty()
  deliveryTimeEnd: string;

  @IsEnum(DeliveryVehicleType)
  @IsNotEmpty()
  vehicleType: DeliveryVehicleType;

  @IsString()
  @IsNotEmpty()
  packagingInstructions: string;
}
