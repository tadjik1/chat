import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('oauth.github.clientID'),
      clientSecret: configService.get<string>('oauth.github.clientSecret'),
      callbackURL: configService.get<string>('oauth.github.callbackURL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService.socialLogin(profile.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
