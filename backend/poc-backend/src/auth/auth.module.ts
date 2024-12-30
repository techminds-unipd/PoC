import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleStrategy } from './strategy/google.strategy';
import { User, UserSchema } from 'src/schemas/user.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    { provide: 'AUTH_SERVICE', useClass: AuthService },
  ],
})
export class AuthModule {}
