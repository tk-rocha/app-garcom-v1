import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  name: string;
  usuario: string;
}

interface AuthContextType {
  user: User | null;
  login: (usuario: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auth-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (usuario: string, senha: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Fetch user from database
      const { data: garcons, error } = await supabase
        .from('garcons')
        .select('*')
        .eq('usuario', usuario)
        .eq('ativo', true)
        .single();

      if (error || !garcons) {
        console.error('User not found or inactive:', error);
        return false;
      }

      // Verify password
      const passwordValid = bcrypt.compareSync(senha, garcons.senha_hash);
      if (!passwordValid) {
        console.error('Invalid password');
        return false;
      }

      // Login successful
      const userData: User = {
        id: garcons.id,
        name: garcons.nome,
        usuario: garcons.usuario
      };
      
      setUser(userData);
      localStorage.setItem('auth-user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};