import { useAuth } from '@/contexts/AuthContext';
import VisaoGeral from './sections/VisaoGeral';
import Explorar from './sections/Explorar';
import MeusAgendamentos from './sections/MeusAgendamentos';
import PerfilCliente from './sections/PerfilCliente';
import Servicos from './sections/Servicos';
import AgendamentosEmpresa from './sections/AgendamentosEmpresa';
import Solicitacoes from './sections/Solicitacoes';
import Notificacoes from './sections/Notificacoes';
import PerfilEmpresa from './sections/PerfilEmpresa';
import PerfilEmpresaPublico from './sections/PerfilEmpresaPublico';

export default function DashboardPage({ secao, setSecao }) {
  const { usuario } = useAuth();
  const isEmp = usuario?.tipo === 'empresa';

  const emp = { 'visao-geral':VisaoGeral, servicos:Servicos, agendamentos:AgendamentosEmpresa, solicitacoes:Solicitacoes, notificacoes:Notificacoes, perfil:PerfilEmpresa, 'perfil-publico':PerfilEmpresaPublico };
  const cli = { 'visao-geral':VisaoGeral, explorar:Explorar, agendamentos:MeusAgendamentos, perfil:PerfilCliente };

  const map = isEmp ? emp : cli;
  const C = map[secao] || map['visao-geral'];
  return <C setSecao={setSecao} />;
}
