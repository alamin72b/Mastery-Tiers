import { Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class SubCategoriesService {
  constructor(private prisma: PrismaService) {}
  async create(categoryId: number, createSubCategoryDto: CreateSubCategoryDto) {
    // Tell Prisma to create the subcategory and connect it to the parent ID
    return this.prisma.subCategory.create({
      data: {
        name: createSubCategoryDto.name,
        category: {
          connect: { id: categoryId }, // Links to the parent!
        },
      },
    });
  }

  findAll() {
    return `This action returns all subCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subCategory`;
  }

  async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    return this.prisma.subCategory.update({
      where: { id },
      data: updateSubCategoryDto,
    });
  }

  async remove(id: number) {
    return this.prisma.subCategory.delete({
      where: { id },
    });
  }
}
