import { UAParser, IResult as IUserAgent } from 'ua-parser-js';

let ua: Partial<IUserAgent> | undefined;

export function getUserAgent(): Partial<IUserAgent> {
  if (!ua) {
    const parser = new UAParser();
    ua = parser.getResult() as Partial<IUserAgent>;
    delete ua.ua; // noisy full string
  }
  return ua;
}

export function addUserAgent(o: unknown): unknown {
  if (typeof o !== 'object' || o === null) return o;
  (o as Record<string, unknown>).userAgent = getUserAgent();
  return o;
}

export function stringifyWithUA(o: unknown): string {
  return JSON.stringify(addUserAgent(o));
}

const safeScopeBlockedList = new Set([
  'eval',
  'window',
  'global',
  'Function',
  'setTimeout',
  'setInterval',
  'importScripts',
  'XMLHttpRequest',
  'fetch',
  'postMessage'
]);

export function safeEval(src: string, ctx: Record<string, unknown> = {}): unknown {
  if (!ctx.hasOwnProperty('result')) ctx.result = null;
  ctx = new Proxy(ctx, {
    has: (target: Record<string, unknown>, prop: string) => {
      if (safeScopeBlockedList.has(prop)) throw new Error(`${prop} blocked`);
      return prop in target;
    },
    get: (target: Record<string, unknown>, prop: string) => {
      if (safeScopeBlockedList.has(prop)) throw new Error(`${prop} blocked`);
      return target?.[prop];
    }
  });

  const fn = new Function(`with(this) { result = (${src}) }`);
  try {
    fn.call(ctx);
  } catch (e) {
    console.error(e);
  }
  return ctx.result;
}

export function getObjectKeyForValue(
  o: Record<string, unknown>,
  value: unknown
): string | undefined {
  for (const key in o) {
    if (o.hasOwnProperty(key) && o[key] === value) {
      return key;
    }
  }
  return undefined;
}

export function intersect<T>(a: T[], b: T[]): T[] {
  // return a.filter((x) => b.includes(x));
  const set = new Set(a);
  return b.filter(v => set.has(v));
}

// Enhanced cloneDeep implementation - handles more edge cases
export function cloneDeep<T>(val: T, map = new WeakMap()): T {
  // Primitive types and null
  if (val === null || typeof val !== 'object') {
    return val;
  }

  // Handle special object types
  if (val instanceof Date) {
    return new Date(val.getTime()) as T;
  }

  if (val instanceof RegExp) {
    return new RegExp(val.source, val.flags) as T;
  }

  if (val instanceof Map) {
    const clonedMap = new Map();
    map.set(val, clonedMap);
    for (const [key, value] of val) {
      clonedMap.set(cloneDeep(key, map), cloneDeep(value, map));
    }
    return clonedMap as T;
  }

  if (val instanceof Set) {
    const clonedSet = new Set();
    map.set(val, clonedSet);
    for (const item of val) {
      clonedSet.add(cloneDeep(item, map));
    }
    return clonedSet as T;
  }

  // Handle functions (return as-is, they're typically immutable references)
  if (typeof val === 'function') {
    return val;
  }

  // Check for circular references
  if (map.has(val as object)) {
    return map.get(val as object);
  }

  let clone: Record<string, unknown> | unknown[];

  if (Array.isArray(val)) {
    clone = [];
    map.set(val as object, clone);
    for (let i = 0; i < val.length; i++) {
      (clone as unknown[])[i] = cloneDeep(val[i], map);
    }
  } else {
    // Handle plain objects and class instances
    const proto = Object.getPrototypeOf(val);
    clone = proto === Object.prototype ? {} : Object.create(proto);
    map.set(val as object, clone);

    // Copy all enumerable properties
    for (const key in val as Record<string, unknown>) {
      if ((val as Record<string, unknown>).hasOwnProperty(key)) {
        (clone as Record<string, unknown>)[key] = cloneDeep(
          (val as Record<string, unknown>)[key],
          map
        );
      }
    }
  }

  return clone as T;
}

// Helper function to check if value is a plain object
function isObject(item: unknown): boolean {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function merge(target: Record<string, unknown>, ...sources: Record<string, unknown>[]) {
  if (!sources.length) return target;

  const source = sources.shift();

  if (source === null || source === undefined) return merge(target, ...sources);

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (isObject(source[key])) {
          if (!target[key] || !isObject(target[key])) {
            target[key] = {};
          }
          merge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>); // recursively merge
        } else {
          target[key] = source[key];
        }
      }
    }
  }

  return merge(target, ...sources);
}

export function transposeObject(o: {
  [k: string | number]: string | number;
}): Record<string | number, string | number> {
  if (!o) {
    return {};
  }
  const t: Record<string | number, string | number> = {};
  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      const value = o[key];
      if (value !== undefined) {
        t[value] = key;
      }
    }
  }
  return t;
}
