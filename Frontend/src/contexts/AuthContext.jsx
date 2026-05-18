import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAccessToken, getRefreshToken, getTipo, salvarTokens, salvarTipo, limparAuth } from "@/services/auth";
import api from "@/services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  const tipo = user?.tipo || getTipo();

  const carregarPerfil = useCallback(async () => {
    const token = getAccessToken();
    const tipoSalvo = getTipo();
    if (!token || !tipoSalvo) { setLoading(false); return; }

    const res = await api("GET", "/api/auth/me", null, token);
    if (res.success) {
      setUser({ ...res.data, tipo: tipoSalvo });
    } else {
      const ok = await tentarRefresh();
      if (!ok) limparAuth();
    }
    setLoading(false);
  }, []);

  useEffect(() => { carregarPerfil(); }, [carregarPerfil]);

  async function tentarRefresh() {
    const refresh = getRefreshToken();
    if (!refresh) return false;
    const res = await api("POST", "/api/auth/refresh", { refresh_token: refresh });
    if (!res.success) return false;
    salvarTokens(res.data.tokens.access, res.data.tokens.refresh);
    const me = await api("GET", "/api/auth/me", null, res.data.tokens.access);
    if (me.success) setUser({ ...me.data, tipo: getTipo() });
    return true;
  }

  async function login(email, senha) {
    const res = await api("POST", "/api/auth/login", { email, senha });
    if (!res.success) return res;
    const t = res.data.user.tipo;
    salvarTokens(res.data.tokens.access, res.data.tokens.refresh);
    salvarTipo(t);
    setUser({ ...res.data.user, tipo: t });
    return { success: true };
  }

  function logout() {
    limparAuth();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, tipo, loading, isAuthenticated, login, logout, tentarRefresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
