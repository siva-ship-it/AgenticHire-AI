import { AuthGuard } from '@/components/auth-guard'; import { Sidebar } from '@/components/sidebar';
export default function DashboardLayout({ children }) { return <AuthGuard><Sidebar/><main className="ml-64 min-h-screen p-8"><div className="max-w-7xl mx-auto">{children}</div></main></AuthGuard>; }
