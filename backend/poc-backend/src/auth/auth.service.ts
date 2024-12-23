import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  handlerLogin() {
    return 'handlerLogin';
  }

  handlerRedirect() {
    return 'handlerRedirect';
  }
}
