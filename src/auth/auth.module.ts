import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { GithubStrategy } from './passport/github.strategy';
import jwtConfig from '../config/jwt';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      ...jwtConfig.asProvider(),
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GithubStrategy],
})
export class AuthModule {}
