import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // This decorator makes Prisma available everywhere
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // This exports the service for other modules to use
})
export class PrismaModule {}
