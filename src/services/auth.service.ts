
import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  
  // =========================================================================================
  // 🔐 BACKEND HANDOFF: AUTHENTICATION STRATEGY
  // =========================================================================================
  // 1. JWT STRATEGY:
  //    - Login (POST /api/auth/login) -> Returns { accessToken: string, user: User }
  //    - Store 'accessToken' in memory (Signals) or LocalStorage (if simple).
  //    - BEST PRACTICE: Backend sets an 'HttpOnly' Cookie for the Refresh Token.
  //
  // 2. HTTP INTERCEPTOR (Angular):
  //    - You must create an HttpInterceptor that appends `Authorization: Bearer <token>`
  //      to every request going to /api/*.
  //
  // 3. ROUTE GUARDS:
  //    - The current 'authGuard' checks if 'currentUser()' is set. This is correct.
  // =========================================================================================

  private readonly STORAGE_KEY_USER = 'didban_user_v1';
  private readonly STORAGE_KEY_TOKEN = 'didban_token_v1'; // Simulating JWT storage

  // State Signals
  currentUser = signal<User | null>(null);
  users = signal<User[]>([]); // Mock DB for demo only

  // Derived State
  isSuperAdmin = computed(() => this.currentUser()?.role === 'super_admin');
  isAdmin = computed(() => this.currentUser()?.role === 'admin' || this.currentUser()?.role === 'super_admin');
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    this.initMockDB();
    this.restoreSession();
  }

  /**
   * ATTEMPT LOGIN
   * Endpoint: POST /api/auth/login
   * Payload: { username, password }
   */
  async login(username: string, password: string): Promise<boolean> {
    // ⏳ Simulate Network Latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // [MOCK LOGIC] - Replace with HttpClient.post()
    const foundUser = this.users().find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      // ⚠️ In Production: The user object returned from backend MUST NOT contain the password
      const { ...safeUser } = foundUser; 
      this.startSession(safeUser as User, 'mock-jwt-token-12345');
      return true;
    }
    return false;
  }

  /**
   * LOGOUT
   * Endpoint: POST /api/auth/logout (to invalidate cookies)
   */
  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(this.STORAGE_KEY_USER);
    localStorage.removeItem(this.STORAGE_KEY_TOKEN);
    this.router.navigate(['/login']);
  }

  // --- INTERNAL SESSION MANAGEMENT ---

  private startSession(user: User, token: string) {
    this.currentUser.set(user);
    localStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(this.STORAGE_KEY_TOKEN, token);
  }

  private restoreSession() {
    const storedUser = localStorage.getItem(this.STORAGE_KEY_USER);
    const storedToken = localStorage.getItem(this.STORAGE_KEY_TOKEN);

    if (storedUser && storedToken) {
      try {
        // [VALIDATION] In real app, check if token is expired here (jwt-decode)
        this.currentUser.set(JSON.parse(storedUser));
      } catch {
        this.logout();
      }
    }
  }

  // --- MOCK USER MANAGEMENT (ADMIN) ---
  // In production, these align with User Management API endpoints

  private initMockDB() {
    const savedUsers = localStorage.getItem('didban_users_db');
    if (savedUsers) {
      this.users.set(JSON.parse(savedUsers));
    } else {
      this.users.set([
        { id: '1', username: 'sadmin', password: 'sadmin', role: 'super_admin', fullName: 'مدیر ارشد (Super)', email: 'super@system.local', createdAt: Date.now(), isActive: true, lastLogin: Date.now() },
        { id: '2', username: 'admin', password: 'admin', role: 'admin', fullName: 'مدیر سیستم', email: 'admin@system.local', createdAt: Date.now() - 86400000 * 10, isActive: true, lastLogin: Date.now() - 3600000 },
        { id: '3', username: 'analyst', password: '123', role: 'analyst', fullName: 'تحلیلگر ارشد', email: 'analyst@system.local', createdAt: Date.now() - 86400000 * 5, isActive: true, lastLogin: Date.now() - 7200000 }
      ]);
    }
  }

  addUser(user: Partial<User>) {
    const newUser: User = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      isActive: true,
      role: user.role || 'analyst',
      fullName: user.fullName || 'User',
      username: user.username || 'user',
      password: user.password // Hash this on backend!
    };
    
    this.users.update(list => [...list, newUser]);
    this.saveMockDB();
  }

  updateUser(id: string, updates: Partial<User>) {
    this.users.update(list => list.map(u => u.id === id ? { ...u, ...updates } : u));
    this.saveMockDB();
  }

  removeUser(id: string) {
    this.users.update(list => list.filter(u => u.id !== id));
    this.saveMockDB();
  }

  resetPassword(id: string) {
    const user = this.users().find(u => u.id === id);
    if (user) {
      this.updateUser(id, { password: user.username });
    }
  }

  private saveMockDB() {
    localStorage.setItem('didban_users_db', JSON.stringify(this.users()));
  }
}
