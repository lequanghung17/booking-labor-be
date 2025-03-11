import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { Role } from 'src/enum/Role.enum';
import { RoleGuard } from './guards/role.guard';
import { Roles } from './decorator/roles.decorator';
import { Public } from './decorator/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import EmailService from 'src/email/email.service';
import { OtpDto } from './dto/otp.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: 201, description: 'User registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'User logged in' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('test')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Test' })
  @ApiResponse({ status: 200, description: 'Test' })
  async test(@Req() req: Request) {
    console.log('Send email');
    this.emailService.sendWelcomeEmail('xuantruong.tn.1712@gmail.com');
    return req.user;
  }

  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Admin only' })
  @ApiResponse({ status: 200, description: 'Admin only' })
  async admin(@Req() req: Request) {
    return 'Admin only endpoint';
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Public()
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refresh_token);
  }

  @ApiOperation({ summary: 'OTP send' })
  @ApiResponse({ status: 200, description: 'OTP sent' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Public()
  @Post('otp')
  async otp(@Body() body: OtpDto) {
    return this.authService.sendOTP(body.email);
  }
}
