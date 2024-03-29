import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DeliveryVehicleType } from 'src/enums';

class DeliveryTimeWindowsDto {
  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
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

export class CreateShipmentDto {
  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsObject()
  @Type(() => DeliveryPreferencesDto)
  @ValidateNested()
  deliveryPreferences: DeliveryPreferencesDto;
}
