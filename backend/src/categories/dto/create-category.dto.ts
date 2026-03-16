import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Category name must be a string' })
  @IsNotEmpty({ message: 'Category name cannot be empty' })
  @MinLength(3, {
    message: 'Category name is too short (minimum 3 characters)',
  })
  @MaxLength(50, {
    message: 'Category name is too long (maximum 50 characters)',
  })
  name: string;
}
