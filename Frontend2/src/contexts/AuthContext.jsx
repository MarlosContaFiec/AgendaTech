import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiRegisterCliente, apiRegisterEmpresa, apiGetMe } from '@/services/auth';
import { salvarAuth, limparAuth, getToken, getTipo, setEmailNaoVerificado, limparEmailPendente } from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificar() {
      const tipo = getTipo();
      const token = getToken();
      if (tipo && token) {
        const res = await apiGetMe();
        if (res.success) setUsuario({ ...res.data, tipo });
        else limparAuth();
      }
      setCarregando(false);
    }
    verificar();
  }, []);

  async function login(documento, senha) {
    const res = await apiLogin(documento, senha);
    if (res.success) {
      const tipo = res.data.user.tipo;
      salvarAuth(tipo, res.data.tokens.access, res.data.tokens.refresh);
      limparEmailPendente();
      setUsuario({ ...res.data.user, tipo });
    }
    return res;
  }

  async function cadastrarCliente(dados) {
    const res = await apiRegisterCliente(dados);
    if (res.success && dados.email) setEmailNaoVerificado(dados.email);
    return res;
  }

  async function cadastrarEmpresa(dados) {
    const res = await apiRegisterEmpresa(dados);
    if (res.success && dados.email) setEmailNaoVerificado(dados.email);
    return res;
  }

  function logout() {
    limparAuth();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, cadastrarCliente, cadastrarEmpresa, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
