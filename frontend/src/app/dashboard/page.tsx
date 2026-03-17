'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/src/features/auth/authSlice';
import { RootState } from '@/src/store';

// 1. We move the logic into a sub-component so we can wrap it in Suspense
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  
  // Look directly at the URL. No need for a useState!
  const urlToken = searchParams.get('token');

  useEffect(() => {
    if (urlToken) {
      // 1. Save it to Redux
      dispatch(setCredentials({ token: urlToken }));
      // 2. Clean the URL
      router.replace('/dashboard');
    } else if (!isAuthenticated) {
      // 3. Boot them out if they aren't logged in and have no token
      router.replace('/'); 
    }
  }, [urlToken, isAuthenticated, dispatch, router]);

  // Show loading IF there's a token in the URL we are currently processing, 
  // OR if they aren't authenticated yet.
  if (urlToken || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">Authenticating...</p>
      </div>
    );
  }

  // If we get here, they are fully authenticated!
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">Mastery Tiers Dashboard</h1>
        <p className="mt-2 text-gray-500">Welcome back! Your secure token is locked and loaded.</p>
        
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100">
          <h2 className="text-sm font-semibold text-green-800">System Status: Online</h2>
          <p className="text-xs text-green-600 mt-1 break-all">
            Redux Token: {token?.substring(0, 30)}...
          </p>
        </div>
      </div>
    </div>
  );
}

// 2. The main page component just wraps the content in Suspense
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