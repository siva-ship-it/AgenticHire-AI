'use client';
import { create } from 'zustand';
export const useAuthStore = create((set) => ({ user: null, hydrated: false, hydrate: () => { const raw = localStorage.getItem('agentichire-user'); set({ user: raw ? JSON.parse(raw) : null, hydrated: true }); }, login: ({ token, user }) => { localStorage.setItem('agentichire-token', token); localStorage.setItem('agentichire-user', JSON.stringify(user)); set({ user }); }, logout: () => { localStorage.removeItem('agentichire-token'); localStorage.removeItem('agentichire-user'); set({ user: null }); } }));
