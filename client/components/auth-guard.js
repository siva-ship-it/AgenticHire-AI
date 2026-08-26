'use client';
import { useEffect } from 'react'; import { useRouter } from 'next/navigation'; import { useAuthStore } from '@/store/auth';
export function AuthGuard({ children }) { const router = useRouter(); const { user, hydrated, hydrate } = useAuthStore(); useEffect(() => { hydrate(); }, [hydrate]); useEffect(() => { if (hydrated && !user) router.replace('/login'); }, [hydrated, user, router]); if (!hydrated || !user) return <div className="min-h-screen grid place-items-center text-gray-500">Loading workspace…</div>; return children; }
