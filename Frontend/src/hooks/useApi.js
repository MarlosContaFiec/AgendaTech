import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export function useApi() {
  const { tokens, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (method, path, body) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api[method](path, body, tokens?.access);
      return result;
    } catch (err) {
      if (err.status === 401) {
        logout();
        window.location.href = '/login';
      }
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tokens, logout]);

  return { call, loading, error };
}
