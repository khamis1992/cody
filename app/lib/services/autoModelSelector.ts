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
 * 3-Tier System: OpenRouter free models → LongCat → DeepSeek fallback
 * Uses defensive checks to prevent runtime errors from missing providers
 */
export const FREE_MODEL_PRIORITY: AutoModelConfig[] = [
  // Tier 1: OpenRouter free models (priority 1-12)
  ...(PROVIDER_LIST.find(p => p.name === 'OpenRouter') ? [
    {
      provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
      model: 'x-ai/grok-4-fast:free',
      isFree: true,
      priority: 1,
    },
    {
      provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
      model: 'deepseek/deepseek-chat',
      isFree: true,
      priority: 2,
    },
    {
      provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
      model: 'qwen/qwen-2.5-coder-32b-instruct:free',
      isFree: true,
      priority: 3,
    },
    {
      provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
      model: 'meta-llama/llama-3.2-90b-vision-instruct:free',
      isFree: true,
      priority: 4,
    },
    {
      provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      isFree: true,
      priority: 5,
    },
    {
      provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
      model: 'google/gemini-flash-1.5-8b:free',
      isFree: true,
      priority: 6,
    },
    {
      provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
      model: 'microsoft/phi-3-medium-128k-instruct:free',
      isFree: true,
      priority: 7,
    },
    {
      provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
      model: 'microsoft/phi-3-mini-128k-instruct:free',
      isFree: true,
      priority: 8,
    },
    {
      provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
      model: 'mistralai/mistral-7b-instruct:free',
      isFree: true,
      priority: 9,
    },
    {
      provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
      model: 'nousresearch/hermes-2-pro-llama-3-8b:free',
      isFree: true,
      priority: 10,
    },
    {
      provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
      model: 'huggingfaceh4/zephyr-7b-beta:free',
      isFree: true,
      priority: 11,
    },
    {
      provider: PROVIDER_LIST.find(p => p.name === 'OpenRouter')!,
      model: 'openchat/openchat-7b:free',
      isFree: true,
      priority: 12,
    },
  ] : []),

  // Tier 2: LongCat (priority 15) - 100k free tokens/day, excellent performance
  ...(PROVIDER_LIST.find(p => p.name === 'LongCat') ? [
    {
      provider: PROVIDER_LIST.find(p => p.name === 'LongCat')!,
      model: 'longcat-flash-chat',
      isFree: true, // 100k tokens/day free
      priority: 15,
    },
  ] : []),

  // Tier 3: DeepSeek direct API as final fallback (priority 20+)
  ...(PROVIDER_LIST.find(p => p.name === 'Deepseek') ? [
    {
      provider: PROVIDER_LIST.find(p => p.name === 'Deepseek')!,
      model: 'deepseek-chat',
      isFree: true,
      priority: 20,
    },
  ] : []),
].filter(Boolean);

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
    // console.log(`Auto Model Selector: Marked ${configKey} as failed`);
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

      // Payment/billing errors
      if (errorMessage.includes('Payment Required') || errorMessage.includes('402') || errorMessage.includes('insufficient funds') || errorMessage.includes('billing') || errorMessage.includes('quota exceeded')) {
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

    // console.log(`Auto Model Selector: Selected ${config.provider.name} - ${config.model}`);

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
        // console.log(`Auto Model Selector: Falling back to ${nextConfig.provider.name} - ${nextConfig.model}`);

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
    // console.log('Auto Model Selector: Reset failed configurations');
  }
}