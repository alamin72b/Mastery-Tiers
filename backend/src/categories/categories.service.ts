import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  // Inject the clean, global database connection
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    try {
      const categories = await this.prisma.category.findMany({
        include: { children: true },
      });

      return categories.map((category) => {
        const masteryTier =
          category.children.length > 0
            ? Math.min(...category.children.map((sub) => sub.count))
            : 0;

        return { ...category, masteryTier };
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve categories');
    }
  }

  async createCategory(name: string) {
    try {
      return await this.prisma.category.create({
        data: { name },
      });
    } catch (error) {
      console.error(error); // This will print the REAL error to your terminal
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async createSubCategory(name: string, categoryId: number) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      return await this.prisma.subCategory.create({
        data: { name, categoryId },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to create sub-category');
    }
  }

  async incrementSubCategory(subCategoryId: number) {
    try {
      const subCategory = await this.prisma.subCategory.findUnique({
        where: { id: subCategoryId },
      });

      if (!subCategory) {
        throw new NotFoundException(
          `Sub-category with ID ${subCategoryId} not found`,
        );
      }

      return await this.prisma.subCategory.update({
        where: { id: subCategoryId },
        data: { count: { increment: 1 } },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Failed to increment sub-category',
      );
    }
  }
}
