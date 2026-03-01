import { createContext, useState, useCallback, useMemo } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

/**
 * Proveedor de contexto de autenticación.
 * Maneja login, logout y estado del token.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(token);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await authService.login(username, password);
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      return true;
    } catch (err) {
      const message =
        err.response?.data?.detail || 'Error al iniciar sesión';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({ token, isAuthenticated, loading, error, login, logout, clearError }),
    [token, isAuthenticated, loading, error, login, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
