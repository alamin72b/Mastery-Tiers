import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchCategoriesApi, 
  createCategoryApi, 
  createSubCategoryApi, 
  incrementSubCategoryApi, // Updated API name
  decrementSubCategoryApi, // Updated API name
  Category 
} from './categoryApi';

interface CategoryState {
  items: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- THUNKS ---

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  return await fetchCategoriesApi();
});

export const createCategory = createAsyncThunk('categories/createCategory', async (name: string) => {
  return await createCategoryApi(name);
});

export const createSubCategory = createAsyncThunk(
  'categories/createSubCategory',
  async ({ categoryId, name }: { categoryId: number; name: string }) => {
    const data = await createSubCategoryApi(categoryId, name);
    return { categoryId, subCategory: data };
  }
);

export const incrementCount = createAsyncThunk(
  'categories/incrementCount',
  async ({ categoryId, subId }: { categoryId: number; subId: number }) => {
    const data = await incrementSubCategoryApi(subId);
    return { categoryId, subCategory: data };
  }
);

export const decrementCount = createAsyncThunk(
  'categories/decrementCount',
  async ({ categoryId, subId }: { categoryId: number; subId: number }) => {
    const data = await decrementSubCategoryApi(subId);
    return { categoryId, subCategory: data };
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Categories Cases
      .addCase(fetchCategories.pending, (state) => { 
        state.status = 'loading'; 
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; 
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      })

      // Create Category Case
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Create Sub-Category Case
      .addCase(createSubCategory.fulfilled, (state, action) => {
        const category = state.items.find(c => c.id === action.payload.categoryId);
        if (category) {
          if (!category.children) category.children = [];
          category.children.push(action.payload.subCategory);
        }
      })

      // Increment Count Case
      .addCase(incrementCount.fulfilled, (state, action) => {
        const category = state.items.find(c => c.id === action.payload.categoryId);
        if (category && category.children) {
          const sub = category.children.find(s => s.id === action.payload.subCategory.id);
          if (sub) {
            sub.count = action.payload.subCategory.count;
          }
        }
      })

      // Decrement Count Case
      .addCase(decrementCount.fulfilled, (state, action) => {
        const category = state.items.find(c => c.id === action.payload.categoryId);
        if (category && category.children) {
          const sub = category.children.find(s => s.id === action.payload.subCategory.id);
          if (sub) {
            sub.count = action.payload.subCategory.count;
          }
        }
      });
  },
});

export default categorySlice.reducer;