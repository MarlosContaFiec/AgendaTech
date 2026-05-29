import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChatBot from '@/components/shared/ChatBot';

const NAV_CLIENTE = [
  { id: 'visao-geral', icon: '📊', texto: 'Visão Geral' },
  { id: 'explorar', icon: '🔍', texto: 'Explorar' },
  { id: 'agendamentos', icon: '📅', texto: 'Agendamentos' },
  { id: 'perfil', icon: '👤', texto: 'Meu Perfil' },
];

const NAV_EMPRESA = [
  { id: 'visao-geral', icon: '📊', texto: 'Visão Geral' },
  { id: 'servicos', icon: '⚙️', texto: 'Serviços' },
  { id: 'agendamentos', icon: '📅', texto: 'Agendamentos' },
  { id: 'solicitacoes', icon: '📋', texto: 'Solicitações' },
  { id: 'notificacoes', icon: '🔔', texto: 'Notificações' },
  { id: 'perfil', icon: '🏢', texto: 'Perfil Empresa' },
];

export default function AppLayout({ children }) {
  const { usuario, logout } = useAuth();
  const [secao, setSecao] = useState('visao-geral');
  const [mob, setMob] = useState(false);

  const isEmp = usuario?.tipo === 'empresa';
  const nav = isEmp ? NAV_EMPRESA : NAV_CLIENTE;

  const content = children && typeof children === 'object' && children.props
    ? { ...children, props: { ...children.props, secao, setSecao } }
    : children;

  return (
    <div className="flex h-screen bg-[#0d0f14] text-[#e8eaf2] font-sans overflow-hidden">
      {mob && <div className="fixed inset-0 bg-black/60 z-[100] lg:hidden" onClick={() => setMob(false)} />}

      <aside className={'w-[230px] bg-[#13161e] border-r border-[#2a2f42] flex flex-col pt-5 flex-shrink-0 fixed lg:relative h-full z-[110] transition-transform duration-200 ' + (mob ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div className="px-5 pb-5 flex items-center gap-2.5">
          <div className="bg-gradient-to-br from-[#5b6cff] to-violet-500 w-7 h-7 rounded-md flex items-center justify-center text-sm font-extrabold text-white">T</div>
          <span className="font-extrabold text-[1.1rem] text-[#e8eaf2]">TrustBook</span>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <div className="px-5 pb-1.5 text-[0.62rem] text-[#7c819a] uppercase tracking-widest">Menu</div>
          {nav.map(item => {
            const ativo = secao === item.id;
            return (
              <button key={item.id} onClick={() => { setSecao(item.id); setMob(false); }}
                className={'w-full flex items-center gap-2.5 text-[0.88rem] cursor-pointer border-l-[3px] transition-all duration-200 py-[11px] px-5 ' + (ativo ? 'bg-[rgba(91,108,255,0.12)] text-[#8b9eff] border-l-[#5b6cff]' : 'text-[#7c819a] border-l-transparent hover:bg-white/[0.03]')}>
                <span>{item.icon}</span><span>{item.texto}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-auto p-4 border-t border-[#2a2f42]">
          <button onClick={logout} className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-[0.85rem] text-[#7c819a] cursor-pointer border-none bg-none hover:bg-red-500/10 hover:text-red-400 transition-all duration-150">
            <span>🚪</span> Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[62px] px-7 flex items-center justify-between border-b border-[#2a2f42] bg-[#13161e] flex-shrink-0">
          <button onClick={() => setMob(true)} className="lg:hidden bg-none border-none text-[#7c819a] cursor-pointer text-xl">☰</button>
          <div className="flex items-center gap-2.5">
            <span className="text-lg">{isEmp ? '🏢' : '👤'}</span>
            <span className="text-[0.88rem] text-[#e8eaf2] font-semibold">{isEmp ? 'Painel Empresa' : 'Minha Conta'}</span>
          </div>
          <span className="text-[#7c819a] cursor-pointer text-lg hover:text-[#e8eaf2] transition-colors">🔔</span>
        </header>
        <main className="flex-1 p-7 overflow-y-auto">{content}</main>
      </div>

      <ChatBot />
    </div>
  );
}
