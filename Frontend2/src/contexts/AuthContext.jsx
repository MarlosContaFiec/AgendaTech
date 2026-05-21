import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiRegisterCliente, apiRegisterEmpresa, apiVerificarEmail } from '@/services/auth';

const AuthContext = createContext(null);

const TIPO_KEY = 'tb_tipo';
const TOKENS = { empresa: 'tb_empresa_token', cliente: 'tb_cliente_token' };
const REFRESHES = { empresa: 'tb_empresa_refresh', cliente: 'tb_cliente_refresh' };

function salvarTokens(tipo, access, refresh) {
  try {
    localStorage.setItem(TOKENS[tipo], access);
    localStorage.setItem(REFRESHES[tipo], refresh);
    localStorage.setItem(TIPO_KEY, tipo);
  } catch {}
}

function limparTudo() {
  try {
    Object.values(TOKENS).forEach(k => localStorage.removeItem(k));
    Object.values(REFRESHES).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem(TIPO_KEY);
  } catch {}
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const tipo = localStorage.getItem(TIPO_KEY);
    const token = tipo ? localStorage.getItem(TOKENS[tipo]) : null;
    if (tipo && token) setUsuario({ tipo, token });
    setCarregando(false);
  }, []);

  async function login(cpfCnpj, senha) {
    const res = await apiLogin(cpfCnpj, senha);
    if (res.success) {
      const tipo = res.data?.user?.tipo || (cpfCnpj.replace(/\D/g, '').length > 11 ? 'empresa' : 'cliente');
      salvarTokens(tipo, res.data.tokens.access, res.data.tokens.refresh);
      setUsuario({ tipo, token: res.data.tokens.access });
    }
    return res;
  }

  function logout() { limparTudo(); setUsuario(null); }

  return (
    <AuthContext.Provider value={{
      usuario, carregando, login, logout,
      cadastrarCliente: apiRegisterCliente,
      cadastrarEmpresa: apiRegisterEmpresa,
      verificarEmail: apiVerificarEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
