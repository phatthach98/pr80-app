import { localStorageUtil } from './local-storage.util';

const TOKEN_KEY = 'pr-80.auth.token';
const REFRESH_TOKEN_KEY = 'pr-80.auth.refreshToken';

export const authLocalStorageUtil = {
  getToken: () => localStorageUtil.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorageUtil.getItem(REFRESH_TOKEN_KEY),
  setTokens: (token: string, refreshToken: string) => {
    localStorageUtil.setItem(TOKEN_KEY, token);
    localStorageUtil.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  resetTokens: () => {
    localStorageUtil.removeItem(TOKEN_KEY);
    localStorageUtil.removeItem(REFRESH_TOKEN_KEY);
  },
};
