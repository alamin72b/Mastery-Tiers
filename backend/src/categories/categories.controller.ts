import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  // We inject the service (the brain) into the controller (the door)
  constructor(private readonly categoriesService: CategoriesService) {}

  // GET http://localhost:3000/categories
  @Get()
  async getAll() {
    return this.categoriesService.getAllCategories();
  }

  // POST http://localhost:3000/categories
  @Post()
  async create(@Body('name') name: string) {
    return this.categoriesService.createCategory(name);
  }

  // POST http://localhost:3000/categories/:id/sub
  @Post(':id/sub')
  async createSub(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ) {
    return this.categoriesService.createSubCategory(name, id);
  }

  // PATCH http://localhost:3000/categories/sub/:id/increment
  @Patch('sub/:id/increment')
  async increment(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.incrementSubCategory(id);
  }
}
