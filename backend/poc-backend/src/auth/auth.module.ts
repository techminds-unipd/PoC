import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AuthController],
  providers: [ AuthService,GoogleStrategy,
    { provide: 'AUTH_SERVICE', useClass: AuthService },
  ],
})
export class AuthModule {}
