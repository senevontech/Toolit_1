export type StructuredLogLevel = 'info' | 'warn' | 'error';

export function logStructured(
  level: StructuredLogLevel,
  event: string,
  payload: Record<string, unknown> = {},
) {
  const entry = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  const message = JSON.stringify(entry);

  if (level === 'error') {
    console.error(message);
    return;
  }

  if (level === 'warn') {
    console.warn(message);
    return;
  }

  console.log(message);
}

export function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}
