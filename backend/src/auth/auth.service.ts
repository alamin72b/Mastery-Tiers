import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// 1. Define the exact shape of the incoming user data
export interface GoogleUserDetails {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // 2. Replace 'any' with your new strict interface
  async validateGoogleUser(googleUser: GoogleUserDetails) {
    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleUser.googleId },
    });

    // If not, create them in our DB
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          googleId: googleUser.googleId,
          email: googleUser.email,
          name: `${googleUser.firstName} ${googleUser.lastName}`.trim(), // Added trim() just in case a name is missing
        },
      });
    }
    return user;
  }
}
