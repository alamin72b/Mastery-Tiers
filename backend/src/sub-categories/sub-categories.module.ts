import { Module } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesController } from './sub-categories.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 1. Import the file

@Module({
  imports: [PrismaModule], // 2. Add it to the imports array here!
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService],
})
export class SubCategoriesModule {}
