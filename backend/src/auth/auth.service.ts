import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt'; // 1. Import JwtService

export interface GoogleUserDetails {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class AuthService {
  // 2. Inject JwtService into the constructor
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(googleUser: GoogleUserDetails) {
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleUser.googleId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          googleId: googleUser.googleId,
          email: googleUser.email,
          name: `${googleUser.firstName} ${googleUser.lastName}`.trim(),
        },
      });
    }
    return user;
  }

  // 3. New Method: Turn the database user into a JWT
  generateJwt(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
