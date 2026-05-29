import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import { Input, Button, Spinner } from '../../components/ui'
import { StepIndicator, PasswordStrength } from '../../components/shared'
import { registerClienteRequest, registerEmpresaRequest } from '../../services/auth'
import { maskCPF, maskCNPJ, maskCEP, maskPhone } from '../../utils/masks'
import { validateEmail, validateCPF, validateCNPJ, validatePassword } from '../../utils/validators'

const initial = {
  nome: '',
  email: '',
  cpf: '',
  cnpj: '',
  razao_social: '',
  nome_fantasia: '',
  telefone: '',
  cep: '',
  senha: '',
  confirmar: '',
}

export default function CadastroPage() {
  const { tipo = 'cliente' } = useParams()
  const navigate = useNavigate()
  const isCliente = tipo === 'cliente'
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordOk = useMemo(() => validatePassword(form.senha) && form.senha === form.confirmar, [form.senha, form.confirmar])

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit() {
    setError('')
    setLoading(true)
    const payload = isCliente
      ? { nome: form.nome, email: form.email, senha: form.senha, cpf: form.cpf.replace(/\D/g, ''), telefone: form.telefone }
      : { email: form.email, senha: form.senha, cnpj: form.cnpj.replace(/\D/g, ''), razao_social: form.razao_social, nome_fantasia: form.nome_fantasia, telefone: form.telefone, cep: form.cep }

    const res = isCliente ? await registerClienteRequest(payload) : await registerEmpresaRequest(payload)
    setLoading(false)

    if (!res?.success) {
      setError(res?.message || 'Erro ao cadastrar')
      return
    }

    setStep(2)
  }

  function handleNext() {
    if (step === 0) {
      const valid = isCliente
        ? form.nome.trim() && validateEmail(form.email) && validateCPF(form.cpf) && validatePassword(form.senha) && passwordOk
        : validateEmail(form.email) && validateCNPJ(form.cnpj) && form.razao_social.trim() && form.nome_fantasia.trim() && validatePassword(form.senha) && passwordOk

      if (!valid) {
        setError('Preencha os campos obrigatórios corretamente')
        return
      }
      setError('')
      setStep(1)
      return
    }
    if (step === 1) handleSubmit()
  }

  return (
    <AuthLayout title="Cadastro" subtitle={`Criando conta de ${isCliente ? 'cliente' : 'empresa'}`}>
      <StepIndicator steps={['Dados', 'Extra', 'Pronto']} current={step} />

      {step === 2 ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[rgba(0,184,148,.12)] text-4xl text-success">✓</div>
          <h3 className="text-4xl text-foreground">Conta criada com sucesso!</h3>
          <p className="text-sm text-muted">Verifique seu email para ativar a conta.</p>
          <Button className="w-full" onClick={() => navigate('/login')}>Ir para login</Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {step === 0 && (
            <div className="space-y-4">
              {isCliente ? (
                <>
                  <Input label="Nome completo" value={form.nome} onChange={(e) => setField('nome', e.target.value)} />
                  <Input label="Email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
                  <Input label="CPF" value={form.cpf} onChange={(e) => setField('cpf', maskCPF(e.target.value))} />
                  <Input label="Telefone" value={form.telefone} onChange={(e) => setField('telefone', maskPhone(e.target.value))} />
                </>
              ) : (
                <>
                  <Input label="Email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
                  <Input label="CNPJ" value={form.cnpj} onChange={(e) => setField('cnpj', maskCNPJ(e.target.value))} />
                  <Input label="Razão social" value={form.razao_social} onChange={(e) => setField('razao_social', e.target.value)} />
                  <Input label="Nome fantasia" value={form.nome_fantasia} onChange={(e) => setField('nome_fantasia', e.target.value)} />
                  <Input label="Telefone" value={form.telefone} onChange={(e) => setField('telefone', maskPhone(e.target.value))} />
                  <Input label="CEP" value={form.cep} onChange={(e) => setField('cep', maskCEP(e.target.value))} />
                </>
              )}
              <Input label="Senha" type="password" value={form.senha} onChange={(e) => setField('senha', e.target.value)} />
              <PasswordStrength value={form.senha} />
              <Input label="Confirmar senha" type="password" value={form.confirmar} onChange={(e) => setField('confirmar', e.target.value)} />
            </div>
          )}

          {step === 1 ? (
            <div className="panel text-sm text-muted">
              Etapa reservada para extensões futuras. Clique em concluir para finalizar o cadastro.
            </div>
          ) : null}

          {error ? <div className="rounded-[12px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div> : null}

          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="w-full" onClick={() => navigate('/login')}>Cancelar</Button>
            <Button type="button" className="w-full" onClick={handleNext} disabled={loading}>
              {loading ? <><Spinner size={18} /> Salvando...</> : step === 0 ? 'Próximo' : 'Concluir'}
            </Button>
          </div>

          <div className="auth-links">
            <Link to="/login" className="hover:text-foreground">Já tem conta? Faça login</Link>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
