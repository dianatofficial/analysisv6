
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User, UserRole } from '../../models/types';
import { IconComponent } from '../ui/icon.component';
import { DatePipe } from '@angular/common';

import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, DatePipe],
  template: `
    <div class="space-y-10 animate-fade-in">
      
      <!-- Header & Search -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="relative flex-1 max-w-2xl group">
          <lucide-icon name="search" class="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors"></lucide-icon>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="جستجوی نام، نام کاربری یا ایمیل..." 
            class="w-full pr-14 pl-6 py-4 bg-white border border-slate-200 rounded-[2rem] focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all font-bold text-sm shadow-sm"
          >
        </div>
        
        <div class="flex items-center gap-3">
          <button (click)="exportUsers()" class="w-12 h-12 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm" title="خروجی اکسل">
            <lucide-icon name="download" class="w-6 h-6"></lucide-icon>
          </button>
          
          <div class="relative">
            <select [(ngModel)]="roleFilter" class="pr-10 pl-4 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none focus:border-indigo-500 appearance-none cursor-pointer shadow-sm min-w-[140px]">
              <option value="all">همه نقش‌ها</option>
              <option value="super_admin">مدیر ارشد</option>
              <option value="admin">مدیر سیستم</option>
              <option value="analyst">تحلیلگر</option>
            </select>
            <lucide-icon name="chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"></lucide-icon>
          </div>
          
          <button (click)="showAddForm.set(!showAddForm())" class="px-8 py-3.5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
            <lucide-icon [name]="showAddForm() ? 'x' : 'plus'" class="w-5 h-5"></lucide-icon>
            <span>{{ showAddForm() ? 'بستن فرم' : 'تعریف کاربر جدید' }}</span>
          </button>
        </div>
      </div>

      <!-- User Form Card (Collapsible) -->
      @if (showAddForm() || editingUser()) {
        <section class="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-200 relative overflow-hidden animate-fade-in">
          <div class="absolute top-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none opacity-50"></div>
          
          <div class="relative z-10">
             <div class="flex items-center gap-4 mb-10">
                <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                   <lucide-icon [name]="editingUser() ? 'pencil' : 'user-plus'" class="w-6 h-6"></lucide-icon>
                </div>
                <div>
                   <h3 class="text-2xl font-black text-slate-900">
                    {{ editingUser() ? 'ویرایش اطلاعات کاربر' : 'تعریف دسترسی جدید' }}
                   </h3>
                   <p class="text-slate-400 text-xs font-bold mt-1">مشخصات و سطح دسترسی کاربر را تعیین کنید</p>
                </div>
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">نام و نام خانوادگی</label>
                  <input type="text" [(ngModel)]="userForm.fullName" class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 shadow-inner">
                </div>
                
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">نام کاربری (Username)</label>
                  <input type="text" [(ngModel)]="userForm.username" class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 ltr text-left shadow-inner">
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">آدرس ایمیل</label>
                  <input type="email" [(ngModel)]="userForm.email" class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 ltr text-left shadow-inner">
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">رمز عبور</label>
                  <input type="password" [(ngModel)]="userForm.password" class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 ltr text-left shadow-inner" placeholder="••••••••">
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">سطح دسترسی (Role)</label>
                  <div class="relative">
                    <select [(ngModel)]="userForm.role" class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer shadow-inner">
                      <option value="analyst">تحلیلگر (Analyst)</option>
                      <option value="admin">مدیر سیستم (Admin)</option>
                      @if (authService.isSuperAdmin()) {
                        <option value="super_admin">مدیر ارشد (Super Admin)</option>
                      }
                    </select>
                    <lucide-icon name="chevron-down" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"></lucide-icon>
                  </div>
                </div>

                <div class="flex items-end pb-2">
                   <label class="flex items-center gap-4 cursor-pointer group bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full shadow-inner">
                      <div class="relative">
                        <input type="checkbox" [(ngModel)]="userForm.isActive" class="sr-only peer">
                        <div class="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </div>
                      <span class="text-sm font-black text-slate-600">حساب کاربری فعال باشد</span>
                   </label>
                </div>
             </div>

             <div class="mt-12 pt-8 border-t border-slate-100 flex justify-end gap-4">
                <button (click)="cancelEdit()" class="px-8 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">انصراف</button>
                <button (click)="saveUser()" class="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center gap-3">
                  <lucide-icon name="check-circle" class="w-6 h-6"></lucide-icon>
                  <span>{{ editingUser() ? 'ذخیره تغییرات نهایی' : 'تایید و ایجاد کاربر' }}</span>
                </button>
             </div>
          </div>
        </section>
      }

      <!-- Users Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        @for (u of filteredUsers(); track u.id) {
          <div class="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-indigo-600 transition-colors"></div>
            
            <div class="flex items-start justify-between relative z-10">
              <div class="flex items-center gap-5">
                <div class="relative">
                  <div class="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-400 font-black text-3xl border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-500">
                    {{ u.fullName.substring(0,1) }}
                  </div>
                  <div [class]="u.isActive ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'" class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div>
                  <h4 class="font-black text-slate-900 text-xl flex items-center gap-2">
                    {{ u.fullName }}
                    @if (u.role === 'super_admin') {
                      <lucide-icon name="shield-alert" class="w-5 h-5 text-amber-500" title="مدیر ارشد"></lucide-icon>
                    }
                  </h4>
                  <p class="text-xs font-black text-slate-400 ltr text-left mt-1 tracking-wider">@{{ u.username }}</p>
                  <div class="mt-3 flex items-center gap-2">
                     <span [class]="u.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'" class="px-3 py-1 rounded-lg text-[10px] font-black border uppercase">
                        {{ u.isActive ? 'Active' : 'Disabled' }}
                     </span>
                     <span class="px-3 py-1 rounded-lg text-[10px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase">
                        {{ u.role }}
                     </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                 <button (click)="editUser(u)" class="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100" title="ویرایش">
                    <lucide-icon name="pencil" class="w-5 h-5"></lucide-icon>
                 </button>
                 <button (click)="resetPassword(u.id)" class="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100" title="تغییر رمز">
                    <lucide-icon name="key" class="w-5 h-5"></lucide-icon>
                 </button>
                 <button (click)="deleteUser(u.id)" class="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100" title="حذف">
                    <lucide-icon name="trash-2" class="w-5 h-5"></lucide-icon>
                 </button>
              </div>
            </div>

            <div class="mt-8 grid grid-cols-2 gap-6 border-t border-slate-50 pt-6 relative z-10">
               <div class="space-y-1">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">سطح دسترسی</span>
                  <p class="text-sm font-black text-slate-800">{{ getRoleLabel(u.role) }}</p>
               </div>
               <div class="space-y-1">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">آخرین فعالیت</span>
                  <p class="text-sm font-black text-slate-800">{{ u.lastLogin ? (u.lastLogin | date:'HH:mm - yyyy/MM/dd') : 'ثبت نشده' }}</p>
               </div>
               <div class="space-y-1">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">پست الکترونیک</span>
                  <p class="text-sm font-black text-slate-500 truncate">{{ u.email || 'بدون ایمیل' }}</p>
               </div>
               <div class="space-y-1">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">عضویت</span>
                  <p class="text-sm font-black text-slate-500">{{ u.createdAt | date:'yyyy/MM/dd' }}</p>
               </div>
            </div>

            <!-- Quick Toggle Status Overlay -->
            <div class="absolute top-8 left-16">
               <button (click)="toggleUserStatus(u)" [class]="u.isActive ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-200'" class="px-4 py-1.5 rounded-full text-[10px] font-black transition-all border hover:scale-105 active:scale-95">
                  {{ u.isActive ? 'غیرفعال سازی' : 'فعال سازی حساب' }}
               </button>
            </div>
          </div>
        }
      </div>

      @if (filteredUsers().length === 0) {
        <div class="bg-white rounded-[3rem] p-32 text-center border-2 border-dashed border-slate-200">
           <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
              <lucide-icon name="users" class="w-12 h-12 text-slate-200"></lucide-icon>
           </div>
           <h3 class="text-2xl font-black text-slate-400 tracking-tight">کاربری با این مشخصات یافت نشد</h3>
           <p class="text-slate-300 mt-2 font-bold">لطفاً پارامترهای جستجو یا فیلتر نقش را تغییر دهید</p>
           <button (click)="searchQuery.set(''); roleFilter.set('all')" class="mt-8 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-sm transition-all">پاک کردن فیلترها</button>
        </div>
      }

    </div>
  `,
  styles: [`
    .ltr { direction: ltr; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class UserManagementComponent {
  authService = inject(AuthService);

  showAddForm = signal(false);
  editingUser = signal<User | null>(null);
  searchQuery = signal('');
  roleFilter = signal('all');

  userForm: Partial<User> = {
    username: '',
    password: '',
    role: 'analyst',
    fullName: '',
    email: '',
    isActive: true
  };

  // Filtered users: admin cannot see super_admin + search + role filter
  filteredUsers = computed(() => {
    let list = this.authService.users();
    
    // Role exclusion for regular admins
    if (!this.authService.isSuperAdmin()) {
      list = list.filter(u => u.role !== 'super_admin');
    }

    // Role filter
    if (this.roleFilter() !== 'all') {
      list = list.filter(u => u.role === this.roleFilter());
    }

    // Search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      list = list.filter(u => 
        u.fullName.toLowerCase().includes(query) || 
        u.username.toLowerCase().includes(query) || 
        (u.email && u.email.toLowerCase().includes(query))
      );
    }

    return list;
  });

  getRoleLabel(role: UserRole) {
    switch(role) {
      case 'super_admin': return 'مدیر ارشد';
      case 'admin': return 'مدیر سیستم';
      case 'analyst': return 'تحلیلگر';
      case 'viewer': return 'مشاهده‌گر';
      default: return role;
    }
  }

  toggleUserStatus(user: User) {
    this.authService.updateUser(user.id, { isActive: !user.isActive });
  }

  resetPassword(id: string) {
    if (confirm('آیا از بازنشانی رمز عبور این کاربر به نام کاربری اطمینان دارید؟')) {
      this.authService.resetPassword(id);
      alert('رمز عبور با موفقیت بازنشانی شد.');
    }
  }

  exportUsers() {
    const data = this.filteredUsers().map(u => ({
      'نام کامل': u.fullName,
      'نام کاربری': u.username,
      'ایمیل': u.email,
      'نقش': this.getRoleLabel(u.role),
      'وضعیت': u.isActive ? 'فعال' : 'غیرفعال'
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().getTime()}.json`;
    a.click();
  }

  saveUser() {
    if (!this.userForm.username || !this.userForm.fullName) return;

    if (this.editingUser()) {
      this.authService.updateUser(this.editingUser()!.id, this.userForm);
    } else {
      if (!this.userForm.password) return;
      this.authService.addUser(this.userForm as User);
    }
    
    this.cancelEdit();
  }

  editUser(user: User) {
    this.editingUser.set(user);
    this.userForm = { ...user };
    this.showAddForm.set(true);
  }

  deleteUser(id: string) {
    if(confirm('آیا از حذف این کاربر اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
      this.authService.removeUser(id);
    }
  }

  cancelEdit() {
    this.editingUser.set(null);
    this.showAddForm.set(false);
    this.userForm = { username: '', password: '', role: 'analyst', fullName: '', email: '', isActive: true };
  }
}
