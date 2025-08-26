class LocalStorageService {
  private readonly storage: Storage | null;
  private _localStorage: { [key: string]: string } = {};
  private _isLocalStorageAvailable: boolean = false;

  constructor() {
    this.storage = this.initializeStorage();
  }

  private initializeStorage(): Storage | null {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return null;
      }

      // Check if localStorage exists and is accessible
      if (!window.localStorage) {
        return null;
      }

      // Test localStorage functionality by trying to use it
      const testKey = '__localStorage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      
      this._isLocalStorageAvailable = true;
      return window.localStorage;
    } catch (error) {
      // localStorage might be disabled, in private mode, or quota exceeded
      console.warn('localStorage is not available, falling back to in-memory storage:', error);
      return null;
    }
  }

  setItem(key: string, value: string) {
    if (this._isLocalStorageAvailable && this.storage) {
      try {
        this.storage.setItem(key, value);
      } catch (error) {
        // Handle quota exceeded or other storage errors
        console.warn('Failed to write to localStorage, using in-memory fallback:', error);
        this._localStorage[key] = value;
      }
    } else {
      this._localStorage[key] = value;
    }
  }

  getItem(key: string): string | null {
    if (this._isLocalStorageAvailable && this.storage) {
      try {
        return this.storage.getItem(key);
      } catch (error) {
        console.warn('Failed to read from localStorage, using in-memory fallback:', error);
        return this._localStorage[key] ?? null;
      }
    } else {
      return this._localStorage[key] ?? null;
    }
  }

  removeItem(key: string) {
    if (this._isLocalStorageAvailable && this.storage) {
      try {
        this.storage.removeItem(key);
      } catch (error) {
        console.warn('Failed to remove from localStorage, using in-memory fallback:', error);
        delete this._localStorage[key];
      }
    } else {
      delete this._localStorage[key];
    }
  }

  /**
   * Check if localStorage is available and functional
   */
  isAvailable(): boolean {
    return this._isLocalStorageAvailable;
  }

  /**
   * Clear all stored data (both localStorage and in-memory fallback)
   */
  clear() {
    if (this._isLocalStorageAvailable && this.storage) {
      try {
        this.storage.clear();
      } catch (error) {
        console.warn('Failed to clear localStorage:', error);
      }
    }
    this._localStorage = {};
  }
}

export const customLocalStorage = new LocalStorageService();
