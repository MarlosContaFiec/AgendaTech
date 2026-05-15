import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setTokens(parsed.tokens);
      } catch { localStorage.removeItem('auth'); }
    }
    setLoading(false);
  }, []);

  function login(data) {
    setUser(data.user);
    setTokens(data.tokens);
    localStorage.setItem('auth', JSON.stringify({ user: data.user, tokens: data.tokens }));
  }

  function logout() {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('auth');
  }

  function isAuthenticated() {
    return !!tokens?.access;
  }

  function isEmpresa() {
    return user?.tipo === 'empresa';
  }

  function isCliente() {
    return user?.tipo === 'cliente';
  }

  return (
    <AuthContext.Provider value={{ user, tokens, loading, login, logout, isAuthenticated, isEmpresa, isCliente }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve estar dentro de AuthProvider');
  return ctx;
}
