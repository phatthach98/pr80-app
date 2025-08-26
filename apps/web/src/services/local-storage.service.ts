class LocalStorageService {
  private readonly storage: Storage;
  private _localStorage: { [key: string]: string } = {};

  constructor() {
    this.storage = window.localStorage ?? {};
  }

  setItem(key: string, value: string) {
    if (this.storage instanceof Storage) {
      this.storage.setItem(key, value);
    } else {
      this._localStorage[key] = value;
    }
  }

  getItem(key: string) {
    if (this.storage instanceof Storage) {
      return this.storage.getItem(key);
    } else {
      return this._localStorage[key];
    }
  }

  removeItem(key: string) {
    if (this.storage instanceof Storage) {
      this.storage.removeItem(key);
    } else {
      delete this._localStorage[key];
    }
  }
}

export const customLocalStorage = new LocalStorageService();
