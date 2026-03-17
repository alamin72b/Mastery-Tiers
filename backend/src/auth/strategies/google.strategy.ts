import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20'; // 1. Added Profile type
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // 2. Fixed import path

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly prisma: PrismaService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile, // 3. Replaced 'any' with 'Profile'
    done: VerifyCallback,
  ): Promise<void> {
    const { id, name, emails, displayName } = profile;

    // 4. Safely extract values so TypeScript knows they are strictly strings
    const userEmail = emails && emails.length > 0 ? emails[0].value : '';
    const userName = name?.givenName || displayName || '';

    const user = await this.prisma.user.upsert({
      where: { googleId: id },
      update: { name: userName, email: userEmail },
      create: {
        googleId: id,
        email: userEmail,
        name: userName,
      },
    });

    done(null, user);
  }
}
