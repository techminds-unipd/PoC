import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(
        username: string,
        pass: string,
    ): Promise<{ access_token: string }> {
        const user = await this.usersService.findOne(username);
        //?. si chiama optional chaining
        //Se user.password è undefined o null invece di ritornare un errore ritorna undefined
        if (user?.password != pass) {
            throw new UnauthorizedException();
        }
        //Generazione JWT
        const payload = { sub: user.userId, username: user.username };
        return { 
          access_token: await this.jwtService.signAsync(payload) 
        };
    }
}
