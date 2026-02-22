
import { Injectable, inject, signal } from '@angular/core';
import { HistoryRecord, AnalysisInputs, ScenarioInputs, RecordType } from '../models/types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private readonly HISTORY_KEY = 'didban_history_v2';
  private authService = inject(AuthService);

  // Reactive signal for the entire history (Admin view)
  history = signal<HistoryRecord[]>([]);

  constructor() {
    this.loadInitialHistory();
  }

  private async loadInitialHistory() {
    const all = await this.fetchAll();
    this.history.set(all);
  }

  /**
   * Save Analysis Result
   */
  async saveAnalysis(inputs: AnalysisInputs, result: string): Promise<HistoryRecord> {
    const record = await this.createAndPersist(inputs, result, 'analysis');
    this.history.update(list => [record, ...list]);
    return record;
  }

  /**
   * Save Scenario Result
   */
  async saveScenario(inputs: ScenarioInputs, result: string): Promise<HistoryRecord> {
    const record = await this.createAndPersist(inputs, result, 'scenario');
    this.history.update(list => [record, ...list]);
    return record;
  }

  /**
   * Get User History
   */
  async getAnalysisHistory(): Promise<HistoryRecord[]> {
    const all = this.history();
    const userId = this.authService.currentUser()?.id;
    return all.filter(x => x.type === 'analysis' && x.userId === userId).sort((a,b) => b.timestamp - a.timestamp);
  }

  async getScenarioHistory(): Promise<HistoryRecord[]> {
    const all = this.history();
    const userId = this.authService.currentUser()?.id;
    return all.filter(x => x.type === 'scenario' && x.userId === userId).sort((a,b) => b.timestamp - a.timestamp);
  }



  async getRecordById(id: string): Promise<HistoryRecord | undefined> {
    const all = this.history(); // Use the signal directly
    return all.find(x => x.id === id);
  }

  // --- INTERNAL MOCK IMPLEMENTATION ---

  private async createAndPersist(inputs: AnalysisInputs | ScenarioInputs, result: string, type: RecordType): Promise<HistoryRecord> {
    const userId = this.authService.currentUser()?.id || 'anonymous';
    
    const record: HistoryRecord = {
      id: crypto.randomUUID(), // UUIDv7 recommended for Backend
      userId: userId,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('fa-IR', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      }),
      inputs: inputs,
      result: result,
      type: type
    };

    return this.persistItem(record);
  }

  private async persistItem(newItem: HistoryRecord): Promise<HistoryRecord> {
    const currentItems = await this.fetchAll();
    const updatedItems = [newItem, ...currentItems]; // Newest first
    
    // Simple cap to prevent LocalStorage overflow
    if (updatedItems.length > 200) {
      updatedItems.length = 200;
    }

    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(updatedItems));
      return newItem;
    } catch (e) {
      console.error('Storage Quota Exceeded', e);
      throw new Error('Failed to save locally. Storage full.');
    }
  }

  private async fetchAll(): Promise<HistoryRecord[]> {
    const data = localStorage.getItem(this.HISTORY_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}
