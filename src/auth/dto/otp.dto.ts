import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class OtpDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;
}
