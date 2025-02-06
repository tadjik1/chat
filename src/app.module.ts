import * as path from 'node:path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './auth/jwt.guard';
import { RolesGuard } from './auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';

import dbConfig from './config/database';
import jwtConfig from './config/jwt';
import oauthConfig from './config/oauth';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'client'),
    }),
    ConfigModule.forRoot({
      load: [dbConfig, jwtConfig, oauthConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(dbConfig.asProvider()),
    AuthModule,
    UsersModule,
    ChatModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
