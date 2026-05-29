import React,{useContext} from 'react';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {AuthProvider,AuthContext} from './contexts/AuthContext';
import TelaLogin from './pages/Auth/TelaLogin';
import TelaEscolhaTipo from './pages/Auth/TelaEscolhaTipo';
import TelaCadastro from './pages/Auth/TelaCadastro';
import TelaVerificarEmail from './pages/Auth/TelaVerificarEmail';
import TelaSucesso from './pages/Auth/TelaSucesso';
import VerificarEmail from './pages/Auth/VerificarEmail';
import AppLayout from './components/layout/AppLayout';
function PrivateRoute({children}){
  const {isAuthenticated,loading}=useContext(AuthContext);
  if(loading)return <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]"><div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"/></div>;
  return isAuthenticated?children:<Navigate to="/login"/>;
}
function PublicRoute({children}){
  const {isAuthenticated,loading}=useContext(AuthContext);
  if(loading)return null;
  return isAuthenticated?<Navigate to="/dashboard"/>:children;
}
export default function App(){
  return(<AuthProvider><BrowserRouter><Routes>
    <Route path="/login" element={<PublicRoute><TelaLogin/></PublicRoute>}/>
    <Route path="/login/escolha" element={<PublicRoute><TelaEscolhaTipo/></PublicRoute>}/>
    <Route path="/login/cadastro/:tipo" element={<PublicRoute><TelaCadastro/></PublicRoute>}/>
    <Route path="/login/verificar" element={<TelaVerificarEmail/>}/>
    <Route path="/login/sucesso" element={<TelaSucesso/>}/>
    <Route path="/verificar/:token" element={<VerificarEmail/>}/>
    <Route path="/dashboard/*" element={<PrivateRoute><AppLayout/></PrivateRoute>}/>
    <Route path="*" element={<Navigate to="/login"/>}/>
  </Routes></BrowserRouter></AuthProvider>);
}