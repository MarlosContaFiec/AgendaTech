import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Empresa from './pages/Empresa';
import Cliente from './pages/Cliente';

function PrivateRoute({ children, tipo }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a1a]">
      <div className="w-8 h-8 border-2 border-[#6c5ce7] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (tipo && user?.tipo !== tipo) return <Navigate to={`/${user?.tipo}`} replace />;

  return children;
}

export default function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a1a]">
      <div className="w-8 h-8 border-2 border-[#6c5ce7] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated()
          ? <Navigate to={`/${user?.tipo}`} replace />
          : <Login />
      } />
      <Route path="/empresa/*" element={
        <PrivateRoute tipo="empresa"><Empresa /></PrivateRoute>
      } />
      <Route path="/cliente/*" element={
        <PrivateRoute tipo="cliente"><Cliente /></PrivateRoute>
      } />
      <Route path="*" element={
        <Navigate to={isAuthenticated() ? `/${user?.tipo}` : '/login'} replace />
      } />
    </Routes>
  );
}
