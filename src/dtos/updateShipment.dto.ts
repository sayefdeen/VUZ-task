import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DeliveryVehicleType, ShipmentStatus } from 'src/enums';

class DeliveryTimeWindowsDto {
  @IsOptional()
  @IsString()
  from: string;

  @IsOptional()
  @IsString()
  to: string;
}

class DeliveryPreferencesDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryTimeWindowsDto)
  deliveryTimeWindows: DeliveryTimeWindowsDto;

  @IsString()
  @IsOptional()
  packagingInstructions: string;

  @IsEnum(DeliveryVehicleType)
  @IsOptional()
  deliveryVehicleTypePreferences: DeliveryVehicleType;
}

export class UpdateShipmentDto {
  @IsString()
  @IsOptional()
  origin: string;

  @IsString()
  @IsOptional()
  destination: string;

  @IsObject()
  @IsOptional()
  @Type(() => DeliveryPreferencesDto)
  @ValidateNested()
  deliveryPreferences: DeliveryPreferencesDto;

  @IsEnum(ShipmentStatus)
  @IsOptional()
  status: ShipmentStatus;
}
