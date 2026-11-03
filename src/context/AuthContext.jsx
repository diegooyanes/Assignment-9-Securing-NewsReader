/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const isAuthenticated = user !== null;

  const login = (username, password, role = 'regular') => {
    if (!username.trim() || !password.trim()) {
      throw new Error('Username and password are required');
    }
    const mockToken = `mock_jwt_token_${Date.now()}`;
    const userData = { username: username.trim(), role, token: mockToken };
    setUser(userData);
    localStorage.setItem('authToken', mockToken);
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
