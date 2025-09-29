import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class LongCatProvider extends BaseProvider {
  name = 'LongCat';
  getApiKeyLink = 'https://longcat.chat/platform';

  config = {
    apiTokenKey: 'LONGCAT_API_KEY',
    baseUrl: 'https://api.longcat.chat/openai/v1',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'longcat-flash-chat',
      label: 'LongCat Flash Chat (128k context)',
      provider: 'LongCat',
      maxTokenAllowed: 128000,
      maxCompletionTokens: 32000,
    },
  ];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    try {
      const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
        apiKeys,
        providerSettings: settings,
        serverEnv: serverEnv as any,
        defaultBaseUrlKey: 'LONGCAT_BASE_URL',
        defaultApiTokenKey: 'LONGCAT_API_KEY',
      });

      if (!apiKey) {
        return [];
      }

      const response = await fetch(`${baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        return [];
      }

      return data.data.map((model: any) => ({
        name: model.id,
        label: `${model.id} (${Math.floor(model.context_length / 1000)}k context)`,
        provider: this.name,
        maxTokenAllowed: model.context_length || 128000,
        maxCompletionTokens: 32000,
      }));
    } catch (error) {
      console.error('Error fetching LongCat models:', error);
      return [];
    }
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'LONGCAT_BASE_URL',
      defaultApiTokenKey: 'LONGCAT_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const openai = createOpenAI({
      baseURL: baseUrl || this.config.baseUrl,
      apiKey,
    });

    return openai(model);
  }
}