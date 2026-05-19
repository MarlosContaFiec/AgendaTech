import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import TelaLogin from "./TelaLogin";
import TelaEscolhaTipo from "./TelaEscolhaTipo";
import TelaCadastro from "./TelaCadastro";
import TelaVerificarEmail from "./TelaVerificarEmail";
import TelaSucesso from "./TelaSucesso";

export default function Login() {
  const [tela, setTela] = useState("login");
  const [emailP, setEmailP] = useState("");
  const [tipoP, setTipoP] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function aoConcluirCadastro(email, tipo) {
    setEmailP(email);
    setTipoP(tipo);
    setTela("verificar");
  }

  function aoLoginOk() {
    navigate("/dashboard");
  }

  return (
    <AuthLayout>
      {tela === "login" && <TelaLogin onCriarConta={() => setTela("escolha")} onLoginOk={aoLoginOk} />}
      {tela === "escolha" && <TelaEscolhaTipo onEscolher={t => setTela("cadastro_" + t)} onVoltar={() => setTela("login")} />}
      {tela === "cadastro_cliente" && <TelaCadastro tipo="cliente" onConcluir={aoConcluirCadastro} onVoltar={() => setTela("escolha")} />}
      {tela === "cadastro_empresa" && <TelaCadastro tipo="empresa" onConcluir={aoConcluirCadastro} onVoltar={() => setTela("escolha")} />}
      {tela === "verificar" && <TelaVerificarEmail email={emailP} onVoltar={() => setTela("login")} />}
      {tela === "sucesso" && <TelaSucesso tipo={tipoP} onIrLogin={() => setTela("login")} />}
    </AuthLayout>
  );
}
