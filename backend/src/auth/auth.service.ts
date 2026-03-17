import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

export interface GoogleUserDetails {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class AuthService {
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

  // 3. Updated Method: Accept and sign the full user object
  generateJwt(user: {
    id: number;
    email: string;
    name: string;
    picture: string;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    };

    return this.jwtService.sign(payload);
  }
}
