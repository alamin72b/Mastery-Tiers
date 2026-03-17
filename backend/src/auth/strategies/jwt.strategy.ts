// backend/src/auth/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// 1. Define the exact shape of your JWT payload to remove 'any'
export interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  picture: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!, // Make sure this matches your .env
    });
  }

  // 2. Removed 'async' and replaced 'any' with 'JwtPayload'
  validate(payload: JwtPayload) {
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  }
}
