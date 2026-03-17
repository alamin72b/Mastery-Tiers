import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAll(@Req() req: Request) {
    // Safely cast the user object to satisfy strict TypeScript rules
    const user = req.user as { sub: number };
    return this.categoriesService.getAllCategories(user.sub);
  }

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request,
  ) {
    // Safely cast the user object here as well
    const user = req.user as { sub: number };
    return this.categoriesService.createCategory(
      createCategoryDto.name,
      user.sub,
    );
  }

  @Post(':id/sub')
  async createSub(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ) {
    return this.categoriesService.createSubCategory(name, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.removeCategory(+id);
  }

  @Patch('sub/:subId/increment')
  async increment(@Param('subId', ParseIntPipe) subId: number) {
    return this.categoriesService.incrementSubCategory(subId);
  }

  @Patch('sub/:subId/decrement')
  async decrement(@Param('subId', ParseIntPipe) subId: number) {
    return this.categoriesService.decrementSubCategory(subId);
  }
}
