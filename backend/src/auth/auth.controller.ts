import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  // 1. Frontend hits this to start the Google login process
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // Passport automatically redirects to the Google Login Page
  }

  // 2. Google redirects back to this URL after the user clicks "Allow"
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
    // req.user now contains the user from your database!

    // For now, let's just return the user to see if it works.
    // Later, we will generate a JWT token here and redirect to your Next.js dashboard.
    return {
      message: 'Google Login Successful!',
      user: req.user,
    };
  }
}
