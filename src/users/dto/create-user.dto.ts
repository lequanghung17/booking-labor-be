import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinDate,
  MinLength,
} from 'class-validator';
import { MinimumAge } from 'src/decorator/minimum-age.validator';
import { Gender } from 'src/enum/Gender.enum';
import { Role } from 'src/enum/Role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  last_name: string;

  @ApiProperty({
    example: 'JohnDoe@gmail.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Số điện thoại Việt Nam',
    example: '0123456789',
    minLength: 10,
    maxLength: 10,
  })
  @IsNumberString({}, { message: 'Số điện thoại chỉ được chứa các chữ số' })
  @IsNotEmpty({ message: 'Số điện thoại là bắt buộc' })
  @Length(10, 10, { message: 'Số điện thoại phải có đúng 10 chữ số' })
  @IsPhoneNumber('VN', { message: 'Phải là số điện thoại hợp lệ của Việt Nam' })
  phone_number: string;

  @ApiProperty({
    description: 'Mật khẩu với các yêu cầu cụ thể',
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @MaxLength(200, { message: 'Mật khẩu không được vượt quá 200 ký tự' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt',
    },
  )
  password: string;

  @ApiProperty({ example: Gender.MALE })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({ example: '1999-12-31' })
  @IsString()
  @IsDateString()
  @MinimumAge(18)
  date_of_birth: string;

  @ApiProperty({ example: Role.USER, enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({ example: 'https://example', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  avatar?: string;
}
