interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateRequest(request: Request): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
  };

  // Check Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      result.errors.push({
        field: 'Content-Type',
        message: 'Content-Type must be application/json for POST/PUT/PATCH requests',
      });
      result.isValid = false;
    }
  }

  // Check for required headers
  const userAgent = request.headers.get('User-Agent');
  if (!userAgent || userAgent.trim() === '') {
    result.errors.push({
      field: 'User-Agent',
      message: 'User-Agent header is required',
    });
    result.isValid = false;
  }

  return result;
}

export function validateJsonBody(body: any, requiredFields: string[] = []): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
  };

  if (!body || typeof body !== 'object') {
    result.errors.push({
      field: 'body',
      message: 'Request body must be a valid JSON object',
    });
    result.isValid = false;
    return result;
  }

  // Check required fields
  for (const field of requiredFields) {
    if (!(field in body) || body[field] === undefined || body[field] === null) {
      result.errors.push({
        field,
        message: `Required field '${field}' is missing`,
      });
      result.isValid = false;
    }
  }

  return result;
}

export function sanitizeHeaders(headers: Headers): Headers {
  const sanitized = new Headers();

  // Copy safe headers and sanitize values
  headers.forEach((value, key) => {
    // Skip potentially dangerous headers
    if (key.toLowerCase().startsWith('x-forwarded') ||
        key.toLowerCase() === 'host' ||
        key.toLowerCase() === 'authorization') {
      return;
    }

    // Sanitize header values
    const sanitizedValue = value.replace(/[\r\n]/g, '').substring(0, 1000);
    sanitized.set(key, sanitizedValue);
  });

  return sanitized;
}

export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: any
): Response {
  const errorBody = {
    error: true,
    message,
    statusCode: status,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
  };

  return new Response(JSON.stringify(errorBody), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
}

export function validateAndParseJson(request: Request): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  return new Promise(async (resolve) => {
    try {
      // Check content type first
      const contentType = request.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        resolve({
          success: false,
          error: 'Content-Type must be application/json',
        });
        return;
      }

      const data = await request.json();
      resolve({ success: true, data });
    } catch (error) {
      resolve({
        success: false,
        error: 'Invalid JSON in request body',
      });
    }
  });
}