import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';

@Module({
  imports: [CategoriesModule, PrismaModule, SubCategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
