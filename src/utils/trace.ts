export function traceToString(trace: string[] = []): string {
  if (trace.length === 0) return '';

  // Format the first line differently, if needed, and join all lines
  return trace.map((line, index) => (index === 0 ? line.replace('    ', ' - ') : line)).join('\n');
}

// Convert Error stack to formatted trace string
export function errorStackToTrace(error: Error): string {
  if (!error.stack) return '';

  const stackLines = error.stack.split('\n');
  return traceToString(stackLines);
}

// Get current stack trace
export function getCurrentTrace(): string[] {
  const error = new Error();
  if (!error.stack) return [];

  return error.stack.split('\n').slice(1); // Remove the first line (Error message)
}
