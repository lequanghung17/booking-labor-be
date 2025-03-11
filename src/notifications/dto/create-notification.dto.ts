import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsPositive,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { NotificationType } from 'src/enum/Notification.enum';

export class CreateNotificationDto {
  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  link: string;
}
