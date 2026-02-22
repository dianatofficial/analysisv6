
// =========================================================================================
// 🚀 BACKEND ENGINEERING HANDOFF SPECIFICATION (Winter 1404 / 2026)
// =========================================================================================
// This file serves as the strict contract between Frontend (Angular) and Backend (Node/NestJS/Python).
// 
// 🟢 DATABASE STRATEGY:
//    - Recommended: PostgreSQL (Relational) + JSONB columns for flexible AI inputs.
//    - Alternative: MongoDB (if schema changes frequently).
//
// 🔒 SECURITY NOTES:
//    - All 'id' fields should be UUIDv7 (Time-sortable UUIDs).
//    - Never return 'password' hash in User entity.
//    - Validate all DTOs using 'class-validator' or 'zod' on the backend.
// =========================================================================================

// --- ENUMS & CONSTANTS ---

export type UserRole = 'super_admin' | 'admin' | 'analyst' | 'viewer';
export type RecordType = 'analysis' | 'scenario';

export interface DynamicField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'boolean';
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select type
  defaultValue?: any;
  order: number;
  width?: 'full' | 'half'; // UI layout hint
}

// -----------------------------------------------------------------------------------------
// 1. ENTITIES (Database Rows)
// -----------------------------------------------------------------------------------------

export interface User {
  /** PK: UUIDv7 */
  id: string;
  /** Unique, Indexed */
  username: string;
  /** Hashed (Argon2id or Bcrypt). NEVER send to frontend. */
  password?: string; 
  /** Access Control Level */
  role: UserRole;
  /** Display Name */
  fullName: string;
  /** Email for notifications */
  email?: string;
  /** ISO 8601 Date String or Epoch */
  createdAt: number;
  /** Last login timestamp */
  lastLogin?: number;
  /** User status */
  isActive: boolean;
  /** Profile image URL */
  avatarUrl?: string;
}

export interface HistoryRecord {
  /** PK: UUIDv7 */
  id: string;
  /** FK: User.id (Indexed) */
  userId: string; 
  /** Created Timestamp */
  timestamp: number;
  /** Human readable date (Persian/Gregorian based on locale) */
  dateStr: string;
  /** Discriminator column: 'analysis' | 'scenario' */
  type: RecordType;
  /** JSONB Column: Stores the exact form inputs used to generate this result */
  inputs: AnalysisInputs | ScenarioInputs;
  /** TEXT / LONGTEXT: The Markdown output from AI */
  result: string;
  /** Metadata: Tokens used, Model version, Latency (optional) */
  meta?: {
    model: string;
    processingTimeMs: number;
    tokensUsed: number;
  };
}

// -----------------------------------------------------------------------------------------
// 2. DATA TRANSFER OBJECTS (DTOs) - API Payloads
// -----------------------------------------------------------------------------------------

// Endpoint: POST /api/v1/ai/analyze
export interface AnalysisInputs {
  [key: string]: any;
  /** @Validation: Required, MinLength(5) */
  subject: string;
  /** @Validation: Enum(AnalysisDomains) */
  domain: string;
  /** @Validation: Optional, MaxLength(100) */
  scope: string;
  /** @Validation: Required, Context for AI */
  timeContext: string;
  geographicFocus: string;
  /** @Validation: MaxLength(2000) */
  actors: string;
  /** @Validation: MaxLength(5000) - RAG Context */
  facts: string;
  question: string;
  constraints: string;
  audience: string;
  depth: string;
  
  // Feature Flags for Charts/Tables
  includeCharts?: boolean;
  includeTables?: boolean;
}

// Endpoint: POST /api/v1/ai/scenario
export interface ScenarioInputs {
  [key: string]: any;
  /** @Validation: Required */
  issue: string;
  domain: string;
  /** @Validation: Enum(ScenarioStatuses) */
  status: string;
  scope: string;
  actors: string;
  resources: string;
  constraints: string;
  objectives: string;
  timeHorizon: string;
  riskTolerance: string;
  audience: string;
  previousActions: string;

  // Feature Flags for Charts/Tables
  includeCharts?: boolean;
  includeTables?: boolean;
}

// -----------------------------------------------------------------------------------------
// 3. CONFIGURATION & SYSTEM STATE
// -----------------------------------------------------------------------------------------

// Endpoint: GET /api/v1/meta/config
export interface FormOptions {
  analysisDomains: string[];
  analysisDepths: string[];
  scenarioDomains: string[];
  scenarioStatuses: string[];
  scenarioRisks: string[];
}

export interface AIModelParams {
  temperature: number;
  topP: number;
  maxTokens?: number;
  /** Controls "Thinking" process budget for reasoning models */
  thinkingBudget?: number; 
  /** Grounding with Search */
  enableSearch?: boolean; 
}

export interface AIProviderConfig {
  id: 'openai' | 'anthropic' | 'gemini';
  name: string;
  isEnabled: boolean;
  /** 
   * ⚠️ SECURITY CRITICAL:
   * In a real deployment, the API Key is NEVER sent to the frontend.
   * This field is here ONLY for the Admin Panel to configure the backend via API.
   * The backend stores this in Vault/Secrets Manager.
   */
  apiKey: string; 
  baseUrl?: string;
  selectedModel: string;
  availableModels: string[];
  params: AIModelParams;
}

export interface AppConfig {
  appName: string;
  footerText: string;
  logoText: string;
  themeColor: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  formOptions: FormOptions;
  analysisFields: DynamicField[];
  scenarioFields: DynamicField[];
  aiConfig: {
    activeProvider: 'openai' | 'gemini';
    providers: AIProviderConfig[];
  };
}
