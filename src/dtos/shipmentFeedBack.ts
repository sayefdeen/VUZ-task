import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ShipmentFeedBack {
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
