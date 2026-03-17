import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Controller('categories/:categoryId/subcategories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Post()
  create(
    @Param('categoryId') categoryId: string,
    @Body() createSubCategoryDto: CreateSubCategoryDto,
  ) {
    // Pass both the parent ID (converted to a number) and the JSON body to the service
    return this.subCategoriesService.create(+categoryId, createSubCategoryDto);
  }

  @Get()
  findAll() {
    return this.subCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoriesService.update(+id, updateSubCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCategoriesService.remove(+id);
  }
}
