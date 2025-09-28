import type { ProviderInfo } from '~/types/model';
import type { ModelInfo } from '~/lib/modules/llm/types';
import { PROVIDER_LIST } from '~/utils/constants';

/**
 * Automatic Model Selection Service
 * Handles automatic selection of free models with fallback mechanisms
 */

export interface AutoModelConfig {
  provider: ProviderInfo;
  model: string;
  isFree: boolean;
  priority: number;
}

/**
 * Priority list of free models to try in order
 * OpenRouter free models first, then DeepSeek as fallback
 */
export const FREE_MODEL_PRIORITY: AutoModelConfig[] = [
  // OpenRouter free models (priority 1-10)
  {
    provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
    model: 'deepseek/deepseek-chat',
    isFree: true,
    priority: 1,
  },
  {
    provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
    model: 'qwen/qwen-2.5-coder-32b-instruct',
    isFree: true,
    priority: 2,
  },
  {
    provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    isFree: true,
    priority: 3,
  },
  {
    provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
    model: 'microsoft/phi-3-mini-128k-instruct:free',
    isFree: true,
    priority: 4,
  },
  // Deepseek direct API as fallback (priority 20+)
  {
    provider: PROVIDER_LIST.find(p => p.name === 'Deepseek')!,
    model: 'deepseek-chat',
    isFree: true,
    priority: 20,
  },
];

export class AutoModelSelector {
  private static instance: AutoModelSelector;
  private currentConfig: AutoModelConfig | null = null;
  private failedConfigs: Set<string> = new Set();

  static getInstance(): AutoModelSelector {
    if (!AutoModelSelector.instance) {
      AutoModelSelector.instance = new AutoModelSelector();
    }
    return AutoModelSelector.instance;
  }

  /**
   * Get the best available free model configuration
   */
  getBestFreeModel(): AutoModelConfig {
    // Filter out failed configurations
    const availableConfigs = FREE_MODEL_PRIORITY.filter(config => {
      const configKey = `${config.provider.name}:${config.model}`;
      return !this.failedConfigs.has(configKey);
    });

    if (availableConfigs.length === 0) {
      // Reset failed configs if all have failed (allows retry)
      this.failedConfigs.clear();
      return FREE_MODEL_PRIORITY[0];
    }

    // Return highest priority (lowest number) available config
    return availableConfigs.sort((a, b) => a.priority - b.priority)[0];
  }

  /**
   * Mark a model configuration as failed
   */
  markConfigAsFailed(provider: string, model: string): void {
    const configKey = `${provider}:${model}`;
    this.failedConfigs.add(configKey);
    console.log(`Auto Model Selector: Marked ${configKey} as failed`);
  }

  /**
   * Check if we should try the next model in the priority list
   */
  shouldFallback(provider: string, model: string, error?: any): boolean {
    // Check for specific API failure patterns
    if (error) {
      const errorMessage = error.message || error.toString();

      // Rate limit errors
      if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        return true;
      }

      // API key errors
      if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
        return true;
      }

      // Service unavailable
      if (errorMessage.includes('503') || errorMessage.includes('502')) {
        return true;
      }
    }

    return false;
  }

  /**
   * Automatically select the best model configuration
   */
  autoSelectModel(): { provider: ProviderInfo; model: string } {
    const config = this.getBestFreeModel();
    this.currentConfig = config;

    console.log(`Auto Model Selector: Selected ${config.provider.name} - ${config.model}`);

    return {
      provider: config.provider,
      model: config.model,
    };
  }

  /**
   * Handle API failure and switch to next available model
   */
  handleApiFailure(provider: string, model: string, error?: any): { provider: ProviderInfo; model: string } | null {
    if (this.shouldFallback(provider, model, error)) {
      this.markConfigAsFailed(provider, model);

      const nextConfig = this.getBestFreeModel();
      if (nextConfig && (nextConfig.provider.name !== provider || nextConfig.model !== model)) {
        this.currentConfig = nextConfig;
        console.log(`Auto Model Selector: Falling back to ${nextConfig.provider.name} - ${nextConfig.model}`);

        return {
          provider: nextConfig.provider,
          model: nextConfig.model,
        };
      }
    }

    return null;
  }

  /**
   * Get current selected configuration
   */
  getCurrentConfig(): AutoModelConfig | null {
    return this.currentConfig;
  }

  /**
   * Reset failed configurations (useful for testing or manual reset)
   */
  resetFailedConfigs(): void {
    this.failedConfigs.clear();
    console.log('Auto Model Selector: Reset failed configurations');
  }
}