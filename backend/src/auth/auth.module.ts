import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { PrismaService } from '../prisma/prisma.service'; // Needed for the database

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, PrismaService],
})
export class AuthModule {}
