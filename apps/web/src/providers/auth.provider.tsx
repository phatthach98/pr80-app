import * as React from 'react';
import { apiClient, tokenStorage } from '@/api/api-client';

export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  roles: Array<{
    id: string;
    name: string;
  }>;
}

export interface AuthContext {
  isAuthenticated: boolean;
  login: (phoneNumber: string, passCode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  user: User | null;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const USER_KEY = 'pr-80.auth.user';

function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(getStoredUser());
  const [loading, setLoading] = React.useState(false);
  const isAuthenticated = !!user && !!tokenStorage.getToken();

  const logout = React.useCallback(async () => {
    setStoredUser(null);
    setUser(null);
    tokenStorage.clearTokens();
  }, []);

  const login = React.useCallback(async (phoneNumber: string, passCode: string) => {
    setLoading(true);
    try {
      const result = await apiClient.post<{ token: string; refreshToken: string; user: User }>(
        '/api/auth/login',
        {
          phoneNumber,
          passCode,
        },
      );

      if (result.success && result.data) {
        const { token, refreshToken, user: userData } = result.data;

        // Store tokens
        tokenStorage.setTokens(token, refreshToken);

        // Store user data
        setStoredUser(userData);
        setUser(userData);

        return { success: true };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle automatic logout on token expiry
  React.useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, [logout]);

  // Initialize user state from storage
  React.useEffect(() => {
    const storedUser = getStoredUser();
    const token = tokenStorage.getToken();

    if (storedUser && token) {
      setUser(storedUser);
    } else if (!token) {
      // Clear user data if no token is available
      setStoredUser(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
