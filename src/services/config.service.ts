
import { Injectable, signal, effect } from '@angular/core';
import { AppConfig, AIProviderConfig } from '../models/types';

// =========================================================================================
// ⚙️ BACKEND HANDOFF: DYNAMIC CONFIGURATION
// =========================================================================================
// In a microservices architecture, this service should fetch configuration from a 
// "Config Server" or a Meta-Metadata Endpoint at application startup (APP_INITIALIZER).
//
// 🔗 ENDPOINTS:
// 1. GET /api/v1/meta/public-config
//    - Returns: { appName, footerText, formOptions }
//    - Accessible to: Everyone
//
// 2. GET /api/v1/admin/ai-config
//    - Returns: { aiConfig } (Encrypted/Masked API Keys)
//    - Accessible to: Admin Only
// =========================================================================================

const DEFAULT_CONFIG: AppConfig = {
  appName: 'سامانه هوشمند دیدبان',
  footerText: 'نسخه ۶.۰.۰ (Rel 2026) | زمستان ۱۴۰۴ | واحد پردازش استراتژیک',
  logoText: 'Sentinel',
  themeColor: '#6366f1',
  maintenanceMode: false,
  allowRegistration: true,
  formOptions: {
    analysisDomains: ['سیاسی و دیپلماتیک', 'اقتصادی و ارزی', 'اجتماعی و فرهنگی', 'امنیت سایبری و فیزیکی', 'فناوری و هوش مصنوعی', 'نظامی و دفاعی'],
    analysisDepths: ['خلاصه مدیریتی (یک صفحه)', 'تحلیل استاندارد (سه صفحه)', 'گزارش جامع راهبردی'],
    scenarioDomains: ['تهدیدات ترکیبی', 'بحران‌های زیست‌محیطی', 'تنش‌های ژئوپلیتیک', 'ناآرامی‌های اجتماعی', 'شوک‌های اقتصادی'],
    scenarioStatuses: ['سیگنال‌های ضعیف (Early Warning)', 'بحران نوظهور', 'اوج بحران', 'دوران گذار / پسا-بحران'],
    scenarioRisks: ['ریسک‌گریز (محافظه‌کارانه)', 'ریسک‌پذیر (تهاجمی)', 'مدیریت ریسک هوشمند']
  },
  analysisFields: [
    { id: 'subject', label: 'موضوع تحلیل', type: 'text', required: true, order: 1, width: 'full', placeholder: 'مثال: تاثیر نوسانات ارزی بر معیشت' },
    { id: 'domain', label: 'حوزه تحلیل', type: 'select', required: true, order: 2, width: 'half', options: ['سیاسی و دیپلماتیک', 'اقتصادی و ارزی', 'اجتماعی و فرهنگی', 'امنیت سایبری و فیزیکی', 'فناوری و هوش مصنوعی', 'نظامی و دفاعی'] },
    { id: 'scope', label: 'بازه زمانی', type: 'text', required: false, order: 3, width: 'half', placeholder: 'مثال: میان‌مدت (۱ تا ۳ سال)' },
    { id: 'geographicFocus', label: 'تمرکز جغرافیایی', type: 'text', required: false, order: 4, width: 'half', placeholder: 'مثال: غرب آسیا' },
    { id: 'depth', label: 'عمق تحلیل', type: 'select', required: true, order: 5, width: 'half', options: ['خلاصه مدیریتی (یک صفحه)', 'تحلیل استاندارد (سه صفحه)', 'گزارش جامع راهبردی'] },
    { id: 'actors', label: 'بازیگران کلیدی', type: 'textarea', required: false, order: 6, width: 'full', placeholder: 'نام نهادها یا اشخاص تاثیرگذار را وارد کنید...' },
    { id: 'facts', label: 'داده‌ها و واقعیت‌های موجود', type: 'textarea', required: true, order: 7, width: 'full', placeholder: 'اطلاعات تایید شده و فکت‌های مرتبط را اینجا بنویسید...' },
    { id: 'question', label: 'پرسش اصلی تحقیق', type: 'textarea', required: true, order: 8, width: 'full', placeholder: 'دقیقا به دنبال پاسخ به چه سوالی هستید؟' }
  ],
  scenarioFields: [
    { id: 'issue', label: 'مسئله محوری', type: 'text', required: true, order: 1, width: 'full', placeholder: 'مثال: آینده امنیت انرژی در منطقه' },
    { id: 'domain', label: 'حوزه مسئله', type: 'select', required: true, order: 2, width: 'half', options: ['تهدیدات ترکیبی', 'بحران‌های زیست‌محیطی', 'تنش‌های ژئوپلیتیک', 'ناآرامی‌های اجتماعی', 'شوک‌های اقتصادی'] },
    { id: 'status', label: 'وضعیت فعلی', type: 'select', required: true, order: 3, width: 'half', options: ['سیگنال‌های ضعیف (Early Warning)', 'بحران نوظهور', 'اوج بحران', 'دوران گذار / پسا-بحران'] },
    { id: 'timeHorizon', label: 'افق زمانی', type: 'text', required: true, order: 4, width: 'half', placeholder: 'مثال: ۵ ساله (۱۴۰۹)' },
    { id: 'riskTolerance', label: 'سطح ریسک‌پذیری', type: 'select', required: true, order: 5, width: 'half', options: ['ریسک‌گریز (محافظه‌کارانه)', 'ریسک‌پذیر (تهاجمی)', 'مدیریت ریسک هوشمند'] },
    { id: 'actors', label: 'بازیگران و ذینفعان', type: 'textarea', required: false, order: 6, width: 'full' },
    { id: 'objectives', label: 'اهداف استراتژیک', type: 'textarea', required: true, order: 7, width: 'full' },
    { id: 'constraints', label: 'محدودیت‌ها و موانع', type: 'textarea', required: false, order: 8, width: 'full' }
  ],
  aiConfig: {
    activeProvider: 'openai',
    providers: [
      {
        id: 'openai',
        name: 'OpenAI GPT-4o (Strategic)',
        isEnabled: true,
        apiKey: (typeof process !== 'undefined' ? process.env['OPENAI_API_KEY'] : '') || '',
        baseUrl: 'https://api.openai.com/v1',
        selectedModel: 'gpt-4o',
        availableModels: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        params: {
          temperature: 0.7,
          topP: 1.0,
          maxTokens: 4000,
          thinkingBudget: 0,
          enableSearch: false
        }
      }
    ]
  }
};

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // CHANGED KEY TO FORCE RESET LOCALSTORAGE
  private readonly CONFIG_KEY = 'didban_config_v10_openai_only'; 
  
  // Signal holds the "Single Source of Truth" for app configuration
  config = signal<AppConfig>(DEFAULT_CONFIG);


  constructor() {
    this.loadConfig();
    
    // Sync to LocalStorage on change (Mocking Server Sync)
    effect(() => {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.config()));
    });
  }

  private loadConfig() {
    const saved = localStorage.getItem(this.CONFIG_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // We do NOT merge providers here to ensure Gemini is gone if it was cached.
        // We only merge form options.
        const mergedConfig: AppConfig = { 
            ...this.config(), 
            ...parsed,
            formOptions: { ...this.config().formOptions, ...parsed.formOptions },
            aiConfig: {
                ...this.config().aiConfig,
                providers: this.config().aiConfig.providers.map(defaultProvider => {
                    const savedProvider = parsed.aiConfig?.providers?.find((p: AIProviderConfig) => p.id === defaultProvider.id);
                    return savedProvider ? { ...defaultProvider, ...savedProvider } : defaultProvider;
                })
            }
        };
        this.config.set(mergedConfig);
      } catch (e) {
        console.error('Config corruption detected. Reverting to defaults.', e);
        // Keep default
      }
    }
    // If not saved, default is already set in signal init
  }

  // ... rest of the class
  
  /**
   * Updates configuration and propagates changes.
   * In production, this would make a PUT request to the Admin API.
   */
  updateConfig(newConfig: Partial<AppConfig>) {
    this.config.update(current => ({ ...current, ...newConfig }));
  }

  resetToDefaults() {
    if (confirm('آیا از بازنشانی تمامی تنظیمات به حالت پیش‌فرض اطمینان دارید؟ تمامی تغییرات شما حذف خواهد شد.')) {
      this.config.set({ ...DEFAULT_CONFIG });
      localStorage.removeItem(this.CONFIG_KEY);
      window.location.reload(); // Reload to ensure all services pick up defaults
    }
  }
}
