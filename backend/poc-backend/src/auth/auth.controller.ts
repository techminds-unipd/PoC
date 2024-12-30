import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guard/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleGuard)
  @Get('google/login')
  handlerLogin() {
    return this.authService.handlerLogin();
  }

  @UseGuards(GoogleGuard)
  @Get('google/redirect')
  handlerRedirect() {
    return this.authService.handlerRedirect();
  }
}
