interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface EnvConfig {
  required?: string[];
  optional?: string[];
}

export function validateEnvironment(env: Record<string, any>, config: EnvConfig): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  // Check required environment variables
  if (config.required) {
    for (const key of config.required) {
      if (!env[key] || env[key] === '') {
        result.errors.push(`Required environment variable '${key}' is missing or empty`);
        result.isValid = false;
      }
    }
  }

  // Check optional environment variables and warn if missing
  if (config.optional) {
    for (const key of config.optional) {
      if (!env[key]) {
        result.warnings.push(`Optional environment variable '${key}' is not set`);
      }
    }
  }

  return result;
}

export function validateCloudflareEnv(env: any): ValidationResult {
  console.log('Validating Cloudflare environment variables...');

  const config: EnvConfig = {
    required: [
      // Add your required environment variables here
      // Example: 'DATABASE_URL', 'API_KEY', etc.
    ],
    optional: [
      'OPENAI_LIKE_API_BASE_URL',
      'OPENAI_LIKE_API_MODELS',
      'OLLAMA_API_BASE_URL',
      'LMSTUDIO_API_BASE_URL',
      'TOGETHER_API_BASE_URL',
      'ANTHROPIC_API_KEY',
      'OPENAI_API_KEY',
      'GOOGLE_API_KEY',
    ],
  };

  const result = validateEnvironment(env || {}, config);

  if (result.errors.length > 0) {
    console.error('Environment validation errors:', result.errors);
  }

  if (result.warnings.length > 0) {
    console.warn('Environment validation warnings:', result.warnings);
  }

  if (result.isValid) {
    console.log('Environment validation passed');
  }

  return result;
}

export function logEnvironmentStatus(env: any) {
  console.log('Environment status:', {
    hasOpenAI: !!env?.OPENAI_API_KEY,
    hasAnthropic: !!env?.ANTHROPIC_API_KEY,
    hasGoogle: !!env?.GOOGLE_API_KEY,
    hasOllama: !!env?.OLLAMA_API_BASE_URL,
    hasLMStudio: !!env?.LMSTUDIO_API_BASE_URL,
    timestamp: new Date().toISOString(),
  });
}