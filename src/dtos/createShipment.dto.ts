import { IsEnum, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { DeliveryVehicleType } from 'src/enums';

export class CreateShipmentDto {
  @IsString()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
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
}
