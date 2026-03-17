// backend/src/categories/categories.controller.ts

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
  UnauthorizedException,
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

  // Helper method to safely extract the User ID
  private extractUserId(req: Request): number {
    const user = req.user as any;

    // Check all common JWT payload shapes
    const userId = user?.sub || user?.id || user?.userId;

    if (!userId) {
      console.error('JWT Error: No User ID found in token payload.', user);
      throw new UnauthorizedException('Invalid token: User ID is missing.');
    }

    return Number(userId);
  }

  @Get()
  async getAll(@Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.categoriesService.getAllCategories(userId);
  }

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request,
  ) {
    const userId = this.extractUserId(req);
    return this.categoriesService.createCategory(
      createCategoryDto.name,
      userId,
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
