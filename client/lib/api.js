const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export async function api(path, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('agentichire-token') : null;
  const headers = { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const response = await fetch(`${API_URL}${path}`, { ...options, headers, cache: 'no-store' });
  const payload = await response.json().catch(() => ({ success: false, error: { message: 'Invalid server response' } }));
  if (!response.ok) throw new Error(payload.error?.message || 'Request failed');
  return payload.data;
}
