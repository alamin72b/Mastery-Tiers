'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/src/features/auth/authSlice';
import {
  fetchCategories,
  createCategory,
  createSubCategory,
  incrementCount,
  decrementCount,
} from '@/src/features/categories/categorySlice';
import { RootState, AppDispatch } from '@/src/store';
import Header from '@/src/components/ui/Header';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const {
    items: categories,
    status,
    error,
  } = useSelector((state: RootState) => state.categories);

  // Modals State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');

  const urlToken = searchParams.get('token');

  useEffect(() => {
    if (urlToken) {
      dispatch(setCredentials({ token: urlToken }));
      router.replace('/dashboard');
    } else if (!isAuthenticated) {
      router.replace('/');
    }
  }, [urlToken, isAuthenticated, dispatch, router]);

  useEffect(() => {
    if (isAuthenticated && status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [isAuthenticated, status, dispatch]);

  // Handlers
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    dispatch(createCategory(newCategoryName));
    setNewCategoryName('');
    setIsCategoryModalOpen(false);
  };

  const handleOpenSubModal = (categoryId: number) => {
    setActiveCategoryId(categoryId);
    setIsSubModalOpen(true);
  };

  const handleCreateSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCategoryName.trim() || activeCategoryId === null) return;
    dispatch(
      createSubCategory({
        categoryId: activeCategoryId,
        name: newSubCategoryName,
      }),
    );
    setNewSubCategoryName('');
    setIsSubModalOpen(false);
    setActiveCategoryId(null);
  };

  const handleIncrement = (categoryId: number, subId: number) => {
    dispatch(incrementCount({ categoryId, subId }));
  };

  const handleDecrement = (
    categoryId: number,
    subId: number,
    currentCount: number,
  ) => {
    if (currentCount <= 0) return;
    dispatch(decrementCount({ categoryId, subId }));
  };

  if (urlToken || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="p-8 flex-grow">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Dashboard Header Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Main Dashboard</h1>
              <p className="mt-1 text-gray-500">
                Track your progress across all categories.
              </p>
            </div>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span> New Category
            </button>
          </div>

          {status === 'loading' && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {status === 'failed' && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
              <p className="font-medium">Update failed: {error}</p>
            </div>
          )}

          {/* Category Grid */}
          {status === 'succeeded' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.length === 0 ? (
                <div className="text-gray-400 col-span-full bg-white p-12 text-center rounded-2xl border border-gray-100 border-dashed">
                  <p className="text-4xl mb-4">📂</p>
                  <p className="font-medium">No categories found.</p>
                  <p className="text-sm">Start by creating your first category above!</p>
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow h-full"
                  >
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
                      <h2 className="text-lg font-bold text-gray-800 truncate pr-2">
                        {category.name}
                      </h2>
                      <button
                        onClick={() => handleOpenSubModal(category.id)}
                        className="text-[10px] uppercase tracking-wider bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-2 py-1 rounded-md transition-colors"
                      >
                        + Add Sub
                      </button>
                    </div>

                    <div className="flex-grow">
                      {category.children && category.children.length > 0 ? (
                        <ul className="space-y-3">
                          {category.children.map((sub) => (
                            <li
                              key={sub.id}
                              className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100"
                            >
                              <span className="text-sm font-semibold text-gray-700 truncate pr-2">
                                {sub.name}
                              </span>

                              <div className="flex items-center space-x-2 shrink-0">
                                <button
                                  onClick={() => handleDecrement(category.id, sub.id, sub.count)}
                                  className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-500 transition-all disabled:opacity-30"
                                  disabled={sub.count <= 0}
                                >
                                  −
                                </button>
                                <span className="bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-lg border border-gray-100 min-w-[2.2rem] text-center">
                                  {sub.count}
                                </span>
                                <button
                                  onClick={() => handleIncrement(category.id, sub.id)}
                                  className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-blue-600 transition-all"
                                >
                                  +
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="h-full flex items-center justify-center py-4">
                          <p className="text-xs text-gray-400 italic">No items added yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* --- Modals with fixed text color --- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">New Category</h2>
            <form onSubmit={handleCreateCategory}>
              <input
                type="text"
                autoFocus
                placeholder="e.g., Programming, Gardening..."
                className="w-full border border-gray-200 rounded-xl p-4 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 placeholder-gray-400 font-medium text-gray-900"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCategoryName.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 text-white rounded-xl font-bold transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSubModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Sub-category</h2>
            <form onSubmit={handleCreateSubCategory}>
              <input
                type="text"
                autoFocus
                placeholder="e.g., React, Spanish, Tomatoes..."
                className="w-full border border-gray-200 rounded-xl p-4 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 font-medium text-gray-900"
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubModalOpen(false);
                    setActiveCategoryId(null);
                  }}
                  className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newSubCategoryName.trim()}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-200 text-white rounded-xl font-bold transition-all"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading your tiers...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}