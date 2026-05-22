import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/services/api";
import { Spinner } from "@/components/ui";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function VerificarEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); setMsg("Token não informado."); return; }
    api("GET", "/api/auth/verificar/" + token).then(res => {
      if (res.success) { setStatus("ok"); setMsg(res.message || "E-mail verificado com sucesso!"); }
      else { setStatus("error"); setMsg(res.message || "Token inválido ou expirado."); }
    });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base font-body p-6">
      <div className="w-full max-w-[440px] bg-surface border border-line rounded-[20px] px-9 py-10 text-center animate-[fadeUp_.3s_ease]">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-3">
            <Spinner size={28} />
            <p className="text-muted text-sm">Verificando...</p>
          </div>
        )}
        {status === "ok" && (
          <>
            <div className="w-16 h-16 rounded-full bg-success/12 border-2 border-success inline-flex items-center justify-center mb-4 animate-[bounceIn_.5s_ease]">
              <FiCheckCircle size={28} className="text-success" />
            </div>
            <h2 className="font-heading font-black text-xl text-success mb-2">{msg}</h2>
            <p className="text-muted-light text-[0.88rem] mb-6">Sua conta está ativa. Você já pode fazer login.</p>
            <Link to="/login" className="inline-block bg-gradient-to-br from-purple to-neon text-white font-bold py-3 px-6 rounded-btn shadow-[0_0_12px_rgba(108,92,231,0.5)] hover:brightness-110 transition-all">Ir para o Login →</Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-danger/12 border-2 border-danger inline-flex items-center justify-center mb-4 animate-[bounceIn_.5s_ease]">
              <FiXCircle size={28} className="text-danger" />
            </div>
            <h2 className="font-heading font-black text-xl text-danger mb-2">Falha na verificação</h2>
            <p className="text-muted-light text-[0.88rem] mb-6">{msg}</p>
            <Link to="/login" className="inline-block bg-surface-alt text-foreground border border-line font-bold py-3 px-6 rounded-btn hover:border-purple/50 transition-all">Voltar ao Login</Link>
          </>
        )}
      </div>
    </div>
  );
}
