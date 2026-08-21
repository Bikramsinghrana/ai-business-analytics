import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, AuthUser, LoginPayload, RegisterPayload } from '../modules/auth/api/authApi';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  permissions: string[];
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    const token = localStorage.getItem('aura_auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [userRes, permRes]: any[] = await Promise.all([
        authApi.getCurrentUser(),
        authApi.getPermissions(),
      ]);

      const userData = userRes.data?.user || userRes.data || null;
      const permData = permRes.data?.permissions || permRes.permissions || [];

      setUser(userData);
      setPermissions(permData);
    } catch (err) {
      console.error('Failed to restore session:', err);
      localStorage.removeItem('aura_auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload: LoginPayload) => {
    const res: any = await authApi.login(payload);
    const authData = res.data || res;
    if (authData.access_token) {
      localStorage.setItem('aura_auth_token', authData.access_token);
      setUser(authData.user);
      await initAuth();
    }
  };

  const register = async (payload: RegisterPayload) => {
    const res: any = await authApi.register(payload);
    const authData = res.data || res;
    if (authData.access_token) {
      localStorage.setItem('aura_auth_token', authData.access_token);
      setUser(authData.user);
      await initAuth();
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('aura_auth_token');
      localStorage.removeItem('aura_active_tenant_id');
      setUser(null);
      setPermissions([]);
    }
  };

  const refetchUser = async () => {
    await initAuth();
  };

  const hasPermission = (permission: string) => {
    if (user?.role === 'SUPER_ADMIN') return true;
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        permissions,
        loading,
        login,
        register,
        logout,
        refetchUser,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
