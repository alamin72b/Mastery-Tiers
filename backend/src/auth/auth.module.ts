import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // 1. Import this
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [
    // 2. Register the JWT Module
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }, // Token expires in 7 days
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, PrismaService, JwtStrategy],
})
export class AuthModule {}
