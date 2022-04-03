function getCacheKey(id: string, args: any[]): string {
  return `cache:${id}:${args.join(',')}`;
}

interface CacheEntry {
  data: any
  timestamp: number
}

export interface CacheOptions {
  expiry?: number
}

function getCacheEntry(key: string, options: CacheOptions): CacheEntry | undefined {
  const entry = localStorage.getItem(key);
  if(!entry) {
    return undefined;
  }
  const parsed = JSON.parse(entry);
  if(options.expiry && Date.now() - parsed.timestamp > options.expiry) {
    return undefined;
  }
  return parsed;
}

export function cache(options: CacheOptions = {}) {
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any) => any>
    ) => {
      const method = descriptor.value!;
      descriptor.value = async function(this: any, ...args: any) {
        const key = getCacheKey(`${target.constructor.name}.${propertyName}`, args);
        const cached = getCacheEntry(key, options);
        if(cached) {
          return cached.data;
        }
        const result = await method.apply(this, args);
        const entry: CacheEntry = {
          data: result,
          timestamp: Date.now(),
        }
        localStorage.setItem(key, JSON.stringify(entry));
        return result;
      }
  }
}