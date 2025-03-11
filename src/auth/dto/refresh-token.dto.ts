import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
