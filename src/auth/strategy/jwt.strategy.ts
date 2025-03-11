import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from '../interface/token-payload.interface';
import { Role } from 'src/enum/Role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: TokenPayload): Promise<{
    user_id: number;
    role: Role;
    tasker_id: number;
    profile_id: number;
  }> {
    const user = await this.usersService.findById(payload.user_id);

    // console.log('payload', user);
    if (!user) {
      throw new UnauthorizedException('Unauthorized at strategy');
    }

    // console.log(user);

    return {
      user_id: user.id,
      role: user.role,
      tasker_id: user.tasker?.id || null,
      profile_id: user.profile?.id || null,
    }; //Mặc định gắn vào request.user
  }
}
