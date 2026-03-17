import { apiClient } from '@/src/lib/api/client';

export interface SubCategory {
  id: number;
  name: string;
  count: number;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  userId: number;
  children: SubCategory[]; 
}

export const fetchCategoriesApi = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories');
  return response.data.data; 
};

export const createCategoryApi = async (name: string): Promise<Category> => {
  const response = await apiClient.post('/categories', { name });
  return response.data.data; 
};

// --- NEW SUB-CATEGORY APIs ---

export const createSubCategoryApi = async (categoryId: number, name: string): Promise<SubCategory> => {
  const response = await apiClient.post(`/categories/${categoryId}/subcategories`, { name });
  return response.data.data;
};

export const updateSubCategoryCountApi = async (categoryId: number, subCategoryId: number, count: number): Promise<SubCategory> => {
  const response = await apiClient.patch(`/categories/${categoryId}/subcategories/${subCategoryId}`, { count });
  return response.data.data;
};


export const incrementSubCategoryApi = async (subId: number): Promise<SubCategory> => {
  const response = await apiClient.patch(`/categories/sub/${subId}/increment`);
  return response.data.data;
};

export const decrementSubCategoryApi = async (subId: number): Promise<SubCategory> => {
  const response = await apiClient.patch(`/categories/sub/${subId}/decrement`);
  return response.data.data;
};