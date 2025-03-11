import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsNumberString,
  IsPositive,
  IsString,
  MaxDate,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Task title', description: 'The title of the task' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'Task description',
    description: 'The description of the task',
  })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({ example: 'skill ID', description: 'The skill of the task' })
  @IsNumber()
  @IsPositive()
  skill_id: number;

  @ApiProperty({
    example: 'district ID',
    description: 'The district of the task',
  })
  @IsNumber()
  @IsPositive()
  district: string;

  @ApiProperty({
    example: 'street name',
    description: 'The street of the task',
  })
  @IsString()
  ward: string;

  @ApiProperty({
    example: '14 Xuaan Thuy',
    description: 'The address of the task',
  })
  @IsString()
  detail_address: string;

  @ApiProperty({
    example: '100',
    description: 'The duration of the task',
  })
  @IsPositive()
  @IsInt()
  estimated_duration: number;

  @ApiProperty({
    example: '1000000',
    description: 'The fee per hour of the task',
  })
  @IsNumberString()
  fee_per_hour: string;

  @ApiProperty({
    example: '1999-12-31',
    description: 'The start date of the task',
  })
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    example: '1999-12-31',
    description: 'The end date of the task',
  })
  @IsDateString()
  end_date: Date;
}
