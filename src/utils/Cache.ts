export interface ICache<T> {
  has: (key: string) => boolean;
  set: (key: string, value: T) => void;
  get: (key: string) => T;
}

interface CacheValue<T> {
  data: T;
  timeStamp: number;
}

export class Cache<T> implements ICache<T> {
  private cache: { [key: string]: CacheValue<T> };
  private readonly EXPIRE_TIME = 20 * 1000;

  constructor() {
    this.cache = {};
  }

  set(key: string, value: T) {
    this.cache[key] = {
      data: value,
      timeStamp: Date.now(),
    };
  }

  has(key: string) {
    if (
      this.cache[key] &&
      Date.now() - this.cache[key].timeStamp <= this.EXPIRE_TIME
    ) {
      return true;
    } else {
      delete this.cache[key];
      return false;
    }
  }

  get(key: string) {
    return this.cache[key].data;
  }
}
