import { Inject, Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('CLIENT_ID'),
      clientSecret: configService.get('CLIENT_SECRET'),
      callbackURL: configService.get('CALL_BACK_URL'),
      scope: ['https://mail.google.com/', 'profile'],
    });
  }

  async validate(accessToken: string, _: string, profile: Profile) {

    const { data } = await firstValueFrom(
      this.httpService.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`).pipe(
        catchError(() => {
          throw 'An error happened!';
        })));

    const expireDate = new Date(Date.now() + data.expires_in * 1000);
    const token = accessToken;
    const profileId = profile.id;
    await this.authService.add(profileId, token, expireDate);
    return true; // Needed to run service handler
  }

}
