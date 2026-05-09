const DANGEROUS_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

export function sanitizePayload<T>(input: T): T {
  if (input === null || input === undefined) return input;
  if (Array.isArray(input)) return input.map(sanitizePayload) as T;
  if (typeof input !== 'object') return input;

  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (DANGEROUS_KEYS.has(key)) continue;
    if (typeof value === 'string') {
      output[key] = value.replace(/[<>]/g, '');
      continue;
    }
    output[key] = sanitizePayload(value);
  }
  return output as T;
}
