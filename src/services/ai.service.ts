
import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { AnalysisInputs, ScenarioInputs } from '../models/types';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private configService = inject(ConfigService);
  private genAI!: GoogleGenAI;

  private readonly SYSTEM_PROMPT = `
# ROLE & IDENTITY (CONTEXT: WINTER 1404 / EARLY 2026)
You are "Didban" (Sentinel), a senior strategic AI analyst operating in **Winter 1404 (Late 2025/Early 2026)**. 
The world has evolved. You possess deep expertise in the geopolitical, technological, and socio-economic landscape of this specific era.

# TEMPORAL AWARENESS (1404/2026)
- You are aware that we are in the mid-2020s.
- You consider the maturity of AI, the status of global energy transitions, and current regional dynamics in the Middle East as of 1404.

# CORE PRINCIPLES
1. **Ruthless Objectivity:** No sugar-coating. Realpolitik analysis.
2. **Predictive Modeling:** When analyzing, project outcomes 6-18 months ahead (into 1405).
3. **Persian Excellence:** Write in high-level, formal, bureaucratic Persian (Farsi) suitable for top-level cabinet reports.
4. **Structured Thinking:** Use Markdown extensively.
`;

  constructor() {
    // This check is for development time warning.
    // The actual key is injected at build time.
    if (typeof GEMINI_API_KEY === 'undefined') {
        console.warn('Gemini API Key is not defined.');
    }
    this.genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }

  async generateAnalysis(inputs: AnalysisInputs): Promise<string> {
    let prompt = `
[SYSTEM TIMESTAMP: WINTER 1404 / 2026]
MODE: STRATEGIC ANALYSIS (Type 1)

INPUT DATA:
- Subject: ${inputs.subject}
- Domain: ${inputs.domain}
- Scope: ${inputs.scope}
- Timeframe: ${inputs.timeContext}
- Geography: ${inputs.geographicFocus}
- Key Actors: ${inputs.actors}
- Confirmed Intelligence: ${inputs.facts}
- Core Question: ${inputs.question}
- Constraints: ${inputs.constraints}
- Target Audience: ${inputs.audience}
- Depth Level: ${inputs.depth}

INSTRUCTIONS:
Provide a comprehensive strategic report in Persian. 
Focus on the implications for the year 1405. 
Analyze second and third-order consequences.
`;

    if (inputs.includeTables) {
      prompt += `\n- Include at least one comparison table using Markdown table syntax.`;
    }

    if (inputs.includeCharts) {
      prompt += `\n- Provide data for a SWOT analysis in a JSON block at the end of the response:
\`\`\`json
{
  "type": "swot",
  "data": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "opportunities": ["..."],
    "threats": ["..."]
  }
}
\`\`\`
`;
    }

    return this.executeRequest(prompt);
  }

  async generateScenario(inputs: ScenarioInputs): Promise<string> {
    let prompt = `
[SYSTEM TIMESTAMP: WINTER 1404 / 2026]
MODE: CRISIS SCENARIO PLANNING (Type 2)

INPUT DATA:
- Crisis Issue: ${inputs.issue}
- Domain: ${inputs.domain}
- Current Phase: ${inputs.status}
- Scope: ${inputs.scope}
- Actors & Posture: ${inputs.actors}
- Resources: ${inputs.resources}
- Red Lines: ${inputs.constraints}
- Objectives: ${inputs.objectives}
- Time Horizon: ${inputs.timeHorizon}
- Risk Appetite: ${inputs.riskTolerance}
- Previous Actions: ${inputs.previousActions}

INSTRUCTIONS:
Design 3 distinct scenarios for this crisis in Persian:
1. Best Case (Optimistic)
2. Status Quo (continuation)
3. Worst Case (Catastrophic)

For each, provide "Early Warning Indicators" and "Mitigation Strategies".
`;

    if (inputs.includeTables) {
      prompt += `\n- Include a table comparing the 3 scenarios based on Probability, Impact, and Cost.`;
    }

    if (inputs.includeCharts) {
      prompt += `\n- Provide data for a Bar Chart comparing the probability of each scenario in a JSON block at the end:
\`\`\`json
{
  "type": "bar",
  "title": "Scenario Probability Distribution",
  "labels": ["Best Case", "Status Quo", "Worst Case"],
  "data": [20, 50, 30] // Example percentages
}
\`\`\`
`;
    }

    return this.executeRequest(prompt, 0.8); 
  }

  async generateSmartField(
    fieldType: 'subject' | 'question' | 'facts' | 'actors' | 'constraints' | 'issue' | 'resources', 
    contextData: string, 
    mode: 'generate' | 'enrich' | 'summarize' | 'expand' = 'generate',
    domain: string = 'عمومی'
  ): Promise<string> {
    
    let prompt = `[CONTEXT: Domain=${domain}, Year=1404]\n`;

    if (mode === 'generate') {
      const generators: Record<string, string> = {
        'subject': `Generate 3 distinct, professional, and strategic analysis titles (Subjects) based on: "${contextData}". Output ONLY the 3 titles separated by " | ". Do not number them.`,
        'issue': `Generate 3 distinct crisis scenario titles based on: "${contextData}". Output ONLY the 3 titles separated by " | ". Do not number them.`,
        'question': `Based on "${contextData}", generate 3 precise, high-level strategic questions. Output ONLY the 3 questions separated by " | ". Do not number them.`,
        'facts': `Generate a bulleted list of strategic facts/trends relevant to "${contextData}" in 1404.`,
        'actors': `List key political/economic actors for "${contextData}". Comma-separated.`,
        'resources': `List strategic resources for "${contextData}".`,
        'constraints': `List likely political/legal constraints for "${contextData}".`
      };
      prompt += generators[fieldType] || `Generate text for ${fieldType}`;
    } else {
      const instructions: Record<string, string> = {
        'enrich': 'Make the following text more formal, strategic, and add relevant 1404 context.',
        'summarize': 'Summarize the following text into concise bullet points.',
        'expand': 'Expand on the following text, adding potential implications.'
      };
      prompt += `${instructions[mode]}\n\nTEXT:\n"${contextData}"\n\nOutput only the result in Persian.`;
    }

    return this.executeRequest(prompt, 0.7);
  }

  private async executeRequest(prompt: string, temperatureOverride?: number): Promise<string> {
    const config = this.configService.config();
    const activeProviderId = config.aiConfig.activeProvider;

    if (activeProviderId !== 'gemini' || !config.aiConfig.providers.find(p => p.id === 'gemini')?.isEnabled) {
      return 'سرویس هوش مصنوعی غیرفعال است یا برای Gemini پیکربندی نشده است. لطفا با مدیر سیستم تماس بگیرید.';
    }

    const provider = config.aiConfig.providers.find(p => p.id === 'gemini');
    if (!provider) {
        return 'پیکربندی ارائه دهنده Gemini یافت نشد.';
    }
    const params = provider.params;

    try {
      const response: GenerateContentResponse = await this.genAI.models.generateContent({
        model: provider.selectedModel || 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: this.SYSTEM_PROMPT,
          temperature: temperatureOverride ?? params.temperature,
          maxOutputTokens: params.maxTokens,
          topP: params.topP,
        }
      });

      const text = response.text;
      if (text) {
        return text.trim();
      }
      return '';

    } catch (error: any) {
      console.error('AI Processing Error:', error);
      if (error.message && error.message.includes('API key not valid')) {
          return 'خطا: کلید API Gemini نامعتبر است. لطفاً آن را در متغیرهای محیطی بررسی کنید.';
      }
      return `خطا در پردازش هوش مصنوعی (Gemini). لطفا تنظیمات را بررسی کنید.`;
    }
  }
}

