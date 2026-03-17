import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // Passport handles the redirect to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // 1. Expand the type to include name and picture
    const user = req.user as {
      id: number;
      email: string;
      name: string;
      picture: string;
    };

    // 2. Generate the token
    const token = this.authService.generateJwt(user);

    // 3. Redirect the browser to your Next.js frontend with the token
    const frontendUrl = process.env.FRONTEND_URL;
    return res.redirect(`${frontendUrl}/dashboard?token=${token}`);
  }
}
