import { addUserAgent, cloneDeep } from './reflexion';
import { logError } from '../stores/logs';

// Clean object utility (removes undefined values)
function cleanObject(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(cleanObject);

  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (value !== undefined) {
      cleaned[key] = cleanObject(value);
    }
  }
  return cleaned;
}

// Humanize file size utility
function humanizeSize(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

// returns the copied content length
export async function copyToClipboard(s: string | unknown, addUA = false): Promise<number> {
  let content: string;
  if (typeof s === 'string') {
    content = s;
  } else {
    let processedData = s;
    if (addUA) processedData = addUserAgent(processedData);
    content = JSON.stringify(cleanObject(cloneDeep(processedData)));
  }
  try {
    await navigator.clipboard.writeText(content);
  } catch (error: unknown) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      operation: 'clipboard_write',
      contentLength: content.length
    });
    return 0;
  }
  return content.length;
}

// returns the saved content length
export function saveAs(filename: string, s: string): number {
  try {
    const el = document.createElement('a');
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(s));
    el.setAttribute('download', filename);

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    el.dispatchEvent(event);

    return s.length;
  } catch (error: unknown) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      operation: 'file_download',
      filename,
      contentLength: s.length
    });
    return 0;
  }
}

// Copy with toast notification
export async function copyNotify(
  s: string | unknown,
  addUA = false,
  notify = true,
  toast?: (options: {
    title: string;
    status: 'success' | 'error';
    duration?: number;
    isClosable?: boolean;
  }) => void
): Promise<boolean> {
  const n = await copyToClipboard(s, addUA);
  if (!notify || !toast) {
    return n > 0;
  }

  if (n > 0) {
    toast({
      title: `Copied ${n} characters`,
      status: 'success',
      duration: 2000,
      isClosable: true
    });
    return true;
  } else {
    toast({
      title: 'Failed to copy, check clipboard permissions',
      status: 'error',
      duration: 3000,
      isClosable: true
    });
    return false;
  }
}

// Save with toast notification
export function saveAsNotify(
  filename: string,
  s: string,
  notify = true,
  toast?: (options: {
    title: string;
    status: 'success' | 'error';
    duration?: number;
    isClosable?: boolean;
  }) => void
): boolean {
  const n = saveAs(filename, s);
  if (!notify || !toast) {
    return n > 0;
  }

  if (n > 0) {
    toast({
      title: `Saved ${filename} (${humanizeSize(n)})`,
      status: 'success',
      duration: 2000,
      isClosable: true
    });
    return true;
  } else {
    toast({
      title: 'Failed to save file, check permissions',
      status: 'error',
      duration: 3000,
      isClosable: true
    });
    return false;
  }
}
