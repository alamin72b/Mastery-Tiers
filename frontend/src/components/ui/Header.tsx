'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { logout } from '@/src/features/auth/authSlice';
import { useRouter } from 'next/navigation';
// 1. Import the Image component
import Image from 'next/image';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          onClick={() => router.push('/dashboard')}
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          MasteryTiers
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-none">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{user.email}</p>
              </div>
              {/* 2. Use the optimized Image component */}
              <Image
                
                src={
                  user?.picture ||
                  `https://ui-avatars.com/api/?name=${user?.name || 'User'}`
                }
                alt="Profile"
                width={40} // Matches w-10
                height={40} // Matches h-10
                className="rounded-full border border-gray-200 shadow-sm"
              />
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-red-500 hover:text-red-700 ml-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/')}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
