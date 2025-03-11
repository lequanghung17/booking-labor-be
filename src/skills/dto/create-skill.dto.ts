import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'Clean house' })
  @IsString()
  @MaxLength(50, { message: 'Name is too long' })
  name: string;

  @ApiProperty({
    example: 'Clean the house, do the laundry, and wash the dishes',
  })
  @IsString()
  @MaxLength(255, { message: 'Description is too long' })
  description: string;
}
