import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskerDto {
  @ApiProperty({ description: 'Work area', type: [Number], required: false })
  @IsArray()
  @IsOptional()
  work_area?: number[];

  @ApiProperty({ description: 'Experience', required: false })
  @IsString()
  @IsOptional()
  experience?: string;

  @ApiProperty({
    description: 'Skills IDs',
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1, { message: 'Array must have at least 1 element' })
  @ArrayMaxSize(100, { message: 'Array cannot have more than 100 elements' })
  skillIds: number[];
}
