import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Request,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Observable } from 'rxjs';

//Questa guardia ha lo scopo di controllare che le richieste siano fatte da un token valido
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        //se provo a fare una richiesta senza token jwt
        if(!token){
            throw new UnauthorizedException();
        }

        try{
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            );
            request['user']=payload
        }catch{
            throw new UnauthorizedException();
        }
        return true;
    }


    //request non dovrebbe essere di tipo any secondo la guida ma per qualche motivo non trova quello dell'import
    private extractTokenFromHeader(request: any): string | undefined{
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
