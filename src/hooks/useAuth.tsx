import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api, { User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; tenant_name: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = api.getToken();
    if (token) {
      // For now, just trust the token exists and set a basic authenticated user
      // We'll fetch the actual user profile later if needed
      setUser({
        id: 'temp-id',
        email: 'user@example.com', // We'll update this when we fetch profile
        full_name: 'User',
        role: 'user',
        tenant_id: 'default',
        avatar_url: undefined,
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);

    // Set user with basic info - trust that login succeeded
    setUser({
      id: 'temp-id',
      email: email,
      full_name: email,
      role: 'user',
      tenant_id: 'default',
      avatar_url: undefined,
    });

    navigate('/dashboard');
  };

  const register = async (data: { email: string; password: string; full_name: string; tenant_name: string }) => {
    await api.register(data);
    // After registration, user needs to login
    toast.success("Account created successfully! Please login.");
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
