import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import VerificarEmail from "@/pages/VerificarEmail";
import Dashboard from "@/pages/Dashboard";
import Spinner from "@/components/ui/Spinner";

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-base">
      <div className="text-center">
        <Spinner size={32} />
        <p className="text-muted text-sm mt-4">Carregando...</p>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/verificar/:token" element={<VerificarEmail />} />
      <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}
