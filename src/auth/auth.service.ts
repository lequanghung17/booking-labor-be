import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from './interface/token-payload.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { omit } from 'lodash';
import EmailService from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: CreateUserDto) {
    return this.usersService.create(registerDto);
  }

  async login(loginDto: LoginDto): Promise<{
    user: Omit<User, 'password'>;
    token: {
      access_token: string;
      refresh_token: string;
    };
  }> {
    const { email, password } = loginDto;
    try {
      const user = await this.usersService.findByEmailForAuth(email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordMatching = await bcrypt.compare(password, user.password);

      if (!isPasswordMatching) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = await this.getToken({ user_id: user.id });

      return {
        user: omit(user, 'password'),
        token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.verifyRefreshToken(refreshToken);

      const user = await this.usersService.findById(payload.user_id);
      const tokens = this.getToken({ user_id: user.id });
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private async getToken(payload: TokenPayload) {
    const access_token = await this.generateAccessToken(payload);
    const refresh_token = await this.generateRefreshToken(payload);

    return { access_token, refresh_token };
  }

  private async generateAccessToken(payload: TokenPayload): Promise<string> {
    const token = await this.jwtService.signAsync(payload);

    const decodedToken = this.jwtService.decode(token) as { exp: number };
    const expirationTime = new Date(decodedToken.exp * 1000);
    console.log(
      `Token of user ${payload.user_id} expires at: ${expirationTime}`,
    ); // xoá sau khi test xong

    // Schedule a log when the token expires
    setTimeout(
      () => {
        console.log(
          `Token for user ${payload.user_id} has expired at: ${new Date()}`,
        );
      },
      decodedToken.exp * 1000 - Date.now(),
    );

    return token;
  }

  private async generateRefreshToken(payload: TokenPayload): Promise<string> {
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    return token;
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  sendOTP(email: string): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.emailService.sendOTP(email, otp);

    return otp;
  }
}
