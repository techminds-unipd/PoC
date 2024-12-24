import { Inject, Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
        @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    ) {
        super({
            clientID: configService.get('CLIENT_ID'),
            clientSecret: configService.get('CLIENT_SECRET'),
            callbackURL: configService.get('CALL_BACK_URL'),
            scope: ['https://mail.google.com/', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        _: string,
        profile: Profile,
    ) {
        const token = accessToken;
        const profileId = profile.id;
        await this.authService.add(profileId, token);
    }
}
