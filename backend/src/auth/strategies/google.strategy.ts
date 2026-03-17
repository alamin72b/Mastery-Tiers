import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly prisma: PrismaService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'], // Correctly requesting profile data
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, name, emails, displayName, photos } = profile;

    // 1. Extract values safely
    const userEmail = emails && emails.length > 0 ? emails[0].value : '';
    const userName = name?.givenName || displayName || '';

    // 2. Extract the profile picture URL
    const userPicture = photos && photos.length > 0 ? photos[0].value : '';

    // 3. Update Prisma to store the picture
    const user = await this.prisma.user.upsert({
      where: { googleId: id },
      update: {
        name: userName,
        email: userEmail,
        picture: userPicture, // Make sure 'picture' exists in your Prisma schema
      },
      create: {
        googleId: id,
        email: userEmail,
        name: userName,
        picture: userPicture, // Make sure 'picture' exists in your Prisma schema
      },
    });

    done(null, user);
  }
}
