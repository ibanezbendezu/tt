import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthCallback(@Req() req) {
    return {
      message: 'Autenticación exitosa',
      user: req.user,
    };
  }
}
