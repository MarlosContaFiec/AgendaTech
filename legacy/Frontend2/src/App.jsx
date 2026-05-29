import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/layout/AuthLayout';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/Login';
import VerificarEmailPage from '@/pages/VerificarEmail';
import DashboardPage from '@/pages/Dashboard';

function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return (
    <div className="flex items-center justify-center h-screen bg-tb-bg">
      <div className="w-8 h-8 border-[3px] border-tb-accent/20 border-t-tb-accent rounded-full animate-spin" />
    </div>
  );
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { usuario } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={usuario ? <Navigate to="/dashboard" replace /> : <AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/verificar-email" element={<AuthLayout><VerificarEmailPage /></AuthLayout>} />
      <Route path="/dashboard/*" element={<RotaProtegida><AppLayout><DashboardPage /></AppLayout></RotaProtegida>} />
      <Route path="*" element={<Navigate to={usuario ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
