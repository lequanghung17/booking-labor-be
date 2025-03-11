import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  task_id: number;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  image: string;
}
