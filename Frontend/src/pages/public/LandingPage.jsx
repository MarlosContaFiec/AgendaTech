import React from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiUsers, FiStar, FiBarChart2, FiShield, FiClock, FiArrowRight } from 'react-icons/fi'
import Logo from '../../components/shared/Logo'

const features = [
  { icon: FiCalendar, title: 'Agendamento Inteligente', desc: 'Seus clientes agendam online 24h. Aceitamento automático ou manual, fila de espera e horário estendido.' },
  { icon: FiUsers, title: 'Gestão de Clientes', desc: 'Score de frequência, dependentes, documentos e histórico completo de cada cliente.' },
  { icon: FiStar, title: 'Avaliações e Feedback', desc: 'Sistema de estrelas, feedback escrito e respostas automáticas por faixa de nota.' },
  { icon: FiBarChart2, title: 'Dashboard Completo', desc: 'KPIs de receita, agendamentos, cancelamentos e taxa de ocupação em tempo real.' },
  { icon: FiShield, title: 'Regras Personalizadas', desc: 'Cancele, reagende ou notifique automaticamente com regras de negócio flexíveis.' },
  { icon: FiClock, title: 'Calendário com Tags', desc: 'Dias com tags (fechado, desconto, feriado) e prioridades. Padrões, exceções e datas únicas.' },
]

const steps = [
  { n: '01', title: 'Cadastre-se', desc: 'Crie sua conta como cliente ou empresa em poucos minutos.' },
  { n: '02', title: 'Configure', desc: 'Empresas cadastram serviços, tags e regras. Clientes exploram e agendam.' },
  { n: '03', title: 'Agende', desc: 'Escolha serviço, data e horário. Confirmação automática ou por aprovação.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-line/50 bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Logo compact />
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-ghost text-sm">Entrar</Link>
            <Link to="/login/escolha" className="btn btn-primary text-sm">Criar conta</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-purple/10 blur-[120px]" />
          <div className="absolute bottom-10 right-1/4 h-56 w-56 rounded-full bg-cyan/10 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface-alt px-4 py-1.5 text-xs text-muted">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Sistema de agendamentos completo
          </div>
          <h1 className="font-heading text-6xl leading-none tracking-wide md:text-8xl">
            Sua agenda,{' '}
            <span className="bg-gradient-to-r from-purple to-cyan bg-clip-text text-transparent">
              mais inteligente
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted leading-relaxed">
            Gerencie agendamentos, clientes e serviços em um único lugar.
            Para empresas que querem organização e clientes que querem praticidade.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/login/cadastro/empresa" className="btn btn-primary px-8 py-3.5 text-base">
              Sou Empresa <FiArrowRight className="ml-1" />
            </Link>
            <Link to="/login/cadastro/cliente" className="btn btn-ghost border border-line px-8 py-3.5 text-base">
              Sou Cliente <FiArrowRight className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-line/50 bg-surface/50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-5xl md:text-6xl">Tudo que você precisa</h2>
            <p className="mt-2 text-muted">Funcionalidades pensadas para empresas de todos os tamanhos</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-line bg-surface p-6 transition-all hover:border-purple/40 hover:shadow-[0_0_30px_rgba(108,92,231,.1)]">
                <div className="mb-4 inline-flex rounded-xl bg-purple/10 p-3 text-purple transition group-hover:bg-purple group-hover:text-white">
                  <f.icon size={22} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-5xl md:text-6xl">Como funciona</h2>
            <p className="mt-2 text-muted">Três passos para começar</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-purple to-cyan text-2xl font-heading text-white">
                  {s.n}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for empresa vs cliente */}
      <section className="border-t border-line/50 bg-surface/50 py-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-8 transition hover:border-purple/40">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple/10 blur-[60px]" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-purple/10 p-3 text-purple">
                  <FiBarChart2 size={28} />
                </div>
                <h3 className="mb-2 font-heading text-4xl">Para Empresas</h3>
                <p className="mb-6 text-sm text-muted leading-relaxed">
                  Cadastre seus serviços, defina regras de cancelamento e reagendamento,
                  configure tags no calendário, gerencie fila de espera e acompanhe KPIs em tempo real.
                </p>
                <Link to="/login/cadastro/empresa" className="btn btn-primary">
                  Cadastrar empresa <FiArrowRight className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-8 transition hover:border-cyan/40">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan/10 blur-[60px]" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-cyan/10 p-3 text-cyan">
                  <FiUsers size={28} />
                </div>
                <h3 className="mb-2 font-heading text-4xl">Para Clientes</h3>
                <p className="mb-6 text-sm text-muted leading-relaxed">
                  Explore empresas por nicho e cidade, agende serviços em poucos cliques,
                  acompanhe seu calendário pessoal, score de frequência e gerencie dependentes.
                </p>
                <Link to="/login/cadastro/cliente" className="btn btn-ghost border border-line">
                  Criar conta <FiArrowRight className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line/50 py-10">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Logo compact />
            <p className="text-sm text-muted">&copy; {new Date().getFullYear()} AgendaTech. Todos os direitos reservados.</p>
            <div className="flex gap-4 text-sm text-muted">
              <Link to="/login" className="hover:text-foreground">Entrar</Link>
              <Link to="/login/escolha" className="hover:text-foreground">Criar conta</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
