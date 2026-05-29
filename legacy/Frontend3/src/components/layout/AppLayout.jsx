import React,{useContext,useState} from 'react';
import {Routes,Route,NavLink,useNavigate} from 'react-router-dom';
import {AuthContext} from '../../contexts/AuthContext';
import Logo from '../shared/Logo';
import {FiLogOut,FiMenu,FiX,FiGrid,FiScissors,FiCalendar,FiClock,FiSettings,FiBell,FiUser,FiGlobe,FiSearch,FiUsers,FiFile,FiMessageCircle} from 'react-icons/fi';
import VisaoGeral from '../../pages/Dashboard/sections/empresa/VisaoGeral';
import Servicos from '../../pages/Dashboard/sections/empresa/Servicos';
import AgendamentosEmpresa from '../../pages/Dashboard/sections/empresa/AgendamentosEmpresa';
import Solicitacoes from '../../pages/Dashboard/sections/empresa/Solicitacoes';
import Notificacoes from '../../pages/Dashboard/sections/empresa/Notificacoes';
import PerfilEmpresa from '../../pages/Dashboard/sections/empresa/PerfilEmpresa';
import PerfilEmpresaPublico from '../../pages/Dashboard/sections/empresa/PerfilEmpresaPublico';
import Calendario from '../../pages/Dashboard/sections/empresa/Calendario';
import Configuracoes from '../../pages/Dashboard/sections/empresa/Configuracoes';
import Mensagens from '../../pages/Dashboard/sections/empresa/Mensagens';
import Explorar from '../../pages/Dashboard/sections/cliente/Explorar';
import MeusAgendamentos from '../../pages/Dashboard/sections/cliente/MeusAgendamentos';
import PerfilCliente from '../../pages/Dashboard/sections/cliente/PerfilCliente';
import CalendarioCliente from '../../pages/Dashboard/sections/cliente/CalendarioCliente';
import Dependentes from '../../pages/Dashboard/sections/cliente/Dependentes';
import Documentos from '../../pages/Dashboard/sections/cliente/Documentos';
import FilaEspera from '../../pages/Dashboard/sections/cliente/FilaEspera';
var empNav=[
  {path:'/dashboard',icon:FiGrid,label:'Visao Geral',end:true},
  {path:'/dashboard/servicos',icon:FiScissors,label:'Servicos'},
  {path:'/dashboard/agendamentos',icon:FiCalendar,label:'Agendamentos'},
  {path:'/dashboard/solicitacoes',icon:FiClock,label:'Solicitacoes'},
  {path:'/dashboard/calendario',icon:FiCalendar,label:'Calendario'},
  {path:'/dashboard/configuracoes',icon:FiSettings,label:'Configuracoes'},
  {path:'/dashboard/mensagens',icon:FiMessageCircle,label:'Mensagens'},
  {path:'/dashboard/notificacoes',icon:FiBell,label:'Notificacoes'},
  {path:'/dashboard/perfil',icon:FiUser,label:'Perfil'},
  {path:'/dashboard/perfil-publico',icon:FiGlobe,label:'Perfil Publico'}
];
var cliNav=[
  {path:'/dashboard',icon:FiSearch,label:'Explorar',end:true},
  {path:'/dashboard/agendamentos',icon:FiCalendar,label:'Agendamentos'},
  {path:'/dashboard/dependentes',icon:FiUsers,label:'Dependentes'},
  {path:'/dashboard/documentos',icon:FiFile,label:'Documentos'},
  {path:'/dashboard/calendario',icon:FiCalendar,label:'Calendario'},
  {path:'/dashboard/fila',icon:FiClock,label:'Fila de Espera'},
  {path:'/dashboard/notificacoes',icon:FiBell,label:'Notificacoes'},
  {path:'/dashboard/perfil',icon:FiUser,label:'Perfil'}
];
export default function AppLayout(){
  const {user,logout}=useContext(AuthContext);const [open,setOpen]=useState(false);const navigate=useNavigate();
  var nav=user&&user.tipo==='empresa'?empNav:cliNav;
  function out(){logout();navigate('/login');}
  return(<div className="min-h-screen flex bg-[var(--bg-primary)]">
    {open&&<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={function(){setOpen(false);}}/>}
    <aside className={'fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col transition-transform duration-300 '+(open?'translate-x-0':'-translate-x-full lg:translate-x-0')}>
      <div className="p-5 flex items-center justify-between"><Logo size="sm"/><button className="lg:hidden p-1 rounded-lg hover:bg-[var(--bg-surface)]" onClick={function(){setOpen(false);}}><FiX size={20} className="text-[var(--text-muted)]"/></button></div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">{nav.map(function(item){return <NavLink key={item.path} to={item.path} end={item.end} onClick={function(){setOpen(false);}} className={function(a){return 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors '+(a.isActive?'bg-[var(--accent-muted)] text-[var(--accent)]':'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]');}}><item.icon size={18}/>{item.label}</NavLink>})}</nav>
      <div className="p-4 border-t border-[var(--border)]"><div className="flex items-center gap-3 mb-3 px-2"><div className="w-8 h-8 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] text-sm font-bold">{user&&user.tipo==='empresa'?'E':'C'}</div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-[var(--text-primary)] truncate">{user&&(user.nome||user.nome_fantasia||user.documento)||'Usuario'}</p><p className="text-xs text-[var(--text-muted)]">{user&&user.tipo}</p></div></div><button onClick={out} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--error)] transition-colors"><FiLogOut size={18}/>Sair</button></div>
    </aside>
    <main className="flex-1 min-w-0">
      <div className="lg:hidden flex items-center gap-3 p-4 border-b border-[var(--border)]"><button onClick={function(){setOpen(true);}} className="p-2 rounded-lg hover:bg-[var(--bg-surface)]"><FiMenu size={20} className="text-[var(--text-secondary)]"/></button><Logo size="sm"/></div>
      <div className="p-4 lg:p-6 dashboard-content">
        <Routes>
          {user&&user.tipo==='empresa'&&(<> 
            <Route index element={<VisaoGeral/>}/>
            <Route path="servicos" element={<Servicos/>}/>
            <Route path="agendamentos" element={<AgendamentosEmpresa/>}/>
            <Route path="solicitacoes" element={<Solicitacoes/>}/>
            <Route path="calendario" element={<Calendario/>}/>
            <Route path="configuracoes" element={<Configuracoes/>}/>
            <Route path="mensagens" element={<Mensagens/>}/>
            <Route path="notificacoes" element={<Notificacoes/>}/>
            <Route path="perfil" element={<PerfilEmpresa/>}/>
            <Route path="perfil-publico" element={<PerfilEmpresaPublico/>}/>
          </>)}
          {user&&user.tipo==='cliente'&&(<> 
            <Route index element={<Explorar/>}/>
            <Route path="agendamentos" element={<MeusAgendamentos/>}/>
            <Route path="dependentes" element={<Dependentes/>}/>
            <Route path="documentos" element={<Documentos/>}/>
            <Route path="calendario" element={<CalendarioCliente/>}/>
            <Route path="fila" element={<FilaEspera/>}/>
            <Route path="notificacoes" element={<Notificacoes/>}/>
            <Route path="perfil" element={<PerfilCliente/>}/>
          </>)}
        </Routes>
      </div>
    </main>
  </div>);
}