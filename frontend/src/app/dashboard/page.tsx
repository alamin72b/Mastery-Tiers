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
  decrementCount 
} from '@/src/features/categories/categorySlice';
import { RootState, AppDispatch } from '@/src/store';
import { SubCategory } from '@/src/features/categories/categoryApi';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items: categories, status, error } = useSelector((state: RootState) => state.categories);
  
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
    dispatch(createSubCategory({ categoryId: activeCategoryId, name: newSubCategoryName }));
    setNewSubCategoryName('');
    setIsSubModalOpen(false);
    setActiveCategoryId(null);
  };

  // Updated to use semantic Increment/Decrement thunks
  const handleIncrement = (categoryId: number, subId: number) => {
    dispatch(incrementCount({ categoryId, subId }));
  };

  const handleDecrement = (categoryId: number, subId: number, currentCount: number) => {
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
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-500">Manage your categories and nested skills.</p>
          </div>
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            + New Category
          </button>
        </div>

        {status === 'loading' && <p className="text-gray-500 animate-pulse">Loading data...</p>}
        {status === 'failed' && <p className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-100">Error: {error}</p>}

        {/* Category Grid */}
        {status === 'succeeded' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.length === 0 ? (
              <p className="text-gray-500 col-span-full bg-white p-8 text-center rounded-xl border border-gray-100 border-dashed">
                No categories found. Create your first one above!
              </p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                  <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
                    <button 
                      onClick={() => handleOpenSubModal(category.id)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-2 py-1 rounded transition-colors"
                    >
                      + Sub
                    </button>
                  </div>
                  
                  <div className="flex-grow">
                    {category.children && category.children.length > 0 ? (
                      <ul className="space-y-2">
                        {category.children.map((sub) => (
                          <li key={sub.id} className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="font-medium">{sub.name}</span>
                            
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleDecrement(category.id, sub.id, sub.count)}
                                className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                                disabled={sub.count <= 0}
                              >
                                -
                              </button>
                              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full min-w-[2rem] text-center">
                                {sub.count}
                              </span>
                              <button 
                                onClick={() => handleIncrement(category.id, sub.id)}
                                className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No sub-categories yet.</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* --- Create Category Modal --- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-50 rounded-xl shadow-lg p-6 w-full max-w-md border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Category</h2>
            <form onSubmit={handleCreateCategory}>
              <input
                type="text"
                autoFocus
                placeholder="e.g., Programming, Languages..."
                /* UPDATED COLOR: bg-slate-100 instead of white */
                className="w-full border border-slate-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-100 placeholder-slate-400"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCategoryName.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Create Sub-Category Modal --- */}
      {isSubModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Sub-Category</h2>
            <form onSubmit={handleCreateSubCategory}>
              <input
                type="text"
                autoFocus
                placeholder="e.g., React, Spanish, Tomatoes..."
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => { setIsSubModalOpen(false); setActiveCategoryId(null); }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newSubCategoryName.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg transition-colors shadow-sm"
                >
                  Add Sub-Category
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
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">Loading Application...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}