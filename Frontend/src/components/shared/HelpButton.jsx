import React, { useState } from 'react'
import { FiHelpCircle, FiX } from 'react-icons/fi'
import Modal from '../ui/Modal'

const helpContent = {
  empresa: {
    'Visão Geral': {
      title: 'Visão Geral',
      steps: [
        { n: 1, text: 'Veja os KPIs principais da sua empresa: total de clientes, agendamentos, avaliação média e receita.', color: '#6c5ce7' },
        { n: 2, text: 'Na seção "Últimos agendamentos", acompanhe os agendamentos mais recentes e seus status.', color: '#00d4ff' },
        { n: 3, text: 'Em "Receita por serviço", analise quais serviços geram mais receita.', color: '#00b894' },
      ],
    },
    'Serviços': {
      title: 'Gerenciar Serviços',
      steps: [
        { n: 1, text: 'Clique em "Novo serviço" para cadastrar um serviço com nome, preço, duração e horários.', color: '#6c5ce7' },
        { n: 2, text: 'Defina se o aceitamento é automático ou manual. Se manual, você aprova cada agendamento.', color: '#00d4ff' },
        { n: 3, text: 'Configure "Máx. por horário" para limitar quantas pessoas podem agendar no mesmo horário.', color: '#00b894' },
        { n: 4, text: 'Use os botões Editar e Excluir para gerenciar serviços existentes.', color: '#fdcb6e' },
      ],
    },
    'Tags': {
      title: 'Gerenciar Tags',
      steps: [
        { n: 1, text: 'Tags são rótulos aplicados a dias do calendário (ex: fechado, desconto, feriado).', color: '#6c5ce7' },
        { n: 2, text: 'Crie uma tag com nome, cor e defina se aceita agendamento ou não.', color: '#00d4ff' },
        { n: 3, text: 'Tags com "Aceita = Não" bloqueiam agendamentos nos dias em que são aplicadas.', color: '#ff6b6b' },
        { n: 4, text: 'Use informações extras para detalhar promoções ou condições especiais.', color: '#00b894' },
      ],
    },
    'Agendamentos': {
      title: 'Gerenciar Agendamentos',
      steps: [
        { n: 1, text: 'Veja todos os agendamentos da empresa com filtros de status e data.', color: '#6c5ce7' },
        { n: 2, text: 'Use "Aceitar" para confirmar agendamentos pendentes (modo manual).', color: '#00b894' },
        { n: 3, text: 'Use "Recusar" para negar agendamentos e "Concluir" para finalizar.', color: '#ff6b6b' },
        { n: 4, text: 'Ao lado do nome do cliente aparece seu score de frequência.', color: '#fdcb6e' },
      ],
    },
    'Calendário': {
      title: 'Calendário da Empresa',
      steps: [
        { n: 1, text: 'Navegue pelos meses usando as setas. Dias com tags aparecem marcados.', color: '#6c5ce7' },
        { n: 2, text: 'Clique em um dia para ver as tags aplicadas e seus detalhes.', color: '#00d4ff' },
        { n: 3, text: 'Configure regras: padrões (todo domingo = fechado), exceções e datas únicas.', color: '#00b894' },
      ],
    },
    'Mensagens': {
      title: 'Caixa de Mensagens',
      steps: [
        { n: 1, text: 'Veja todas as conversas com clientes na lista à esquerda.', color: '#6c5ce7' },
        { n: 2, text: 'Clique em uma conversa para abrir o chat e enviar/receber mensagens.', color: '#00d4ff' },
        { n: 3, text: 'Configure mensagens automáticas nas Configurações > Chat / FAQ.', color: '#00b894' },
      ],
    },
    'Configurações': {
      title: 'Configurações da Empresa',
      steps: [
        { n: 1, text: 'Em "Regras de Negócio", crie regras de notificação, cancelamento e reagendamento.', color: '#6c5ce7' },
        { n: 2, text: 'Use templates com variáveis como {nome_cliente} para mensagens automáticas.', color: '#00d4ff' },
        { n: 3, text: 'Em "Capacidade", defina limites de agendamentos por faixa horária.', color: '#00b894' },
        { n: 4, text: 'Em "Chat / FAQ", configure a mensagem de abertura e perguntas frequentes.', color: '#fdcb6e' },
      ],
    },
  },
  cliente: {
    'Explorar': {
      title: 'Explorar Empresas',
      steps: [
        { n: 1, text: 'Use a barra de busca para encontrar empresas por nome ou serviço.', color: '#6c5ce7' },
        { n: 2, text: 'Filtre por nicho (beleza, culinária) e cidade para resultados mais precisos.', color: '#00d4ff' },
        { n: 3, text: 'Veja as empresas em destaque (mais agendamentos nas últimas 24h).', color: '#00b894' },
        { n: 4, text: 'Clique em uma empresa para ver seus serviços e agendar.', color: '#fdcb6e' },
      ],
    },
    'Meus Agendamentos': {
      title: 'Meus Agendamentos',
      steps: [
        { n: 1, text: 'Veja todos os seus agendamentos: confirmados, pendentes e histórico.', color: '#6c5ce7' },
        { n: 2, text: 'Use "Cancelar" para cancelar um agendamento (pode haver taxa dependendo da empresa).', color: '#ff6b6b' },
        { n: 3, text: 'Use "Reagendar" para escolher nova data e horário.', color: '#00d4ff' },
        { n: 4, text: 'Após um serviço concluído, clique em "Avaliar" para dar sua nota e feedback.', color: '#00b894' },
      ],
    },
    'Calendário': {
      title: 'Calendário Pessoal',
      steps: [
        { n: 1, text: 'Veja seus agendamentos futuros e passados no calendário.', color: '#6c5ce7' },
        { n: 2, text: 'Clique em um dia para ver detalhes: horário, serviço e endereço.', color: '#00d4ff' },
      ],
    },
    'Perfil': {
      title: 'Meu Perfil',
      steps: [
        { n: 1, text: 'Edite seus dados pessoais: nome, telefone e data de nascimento.', color: '#6c5ce7' },
        { n: 2, text: 'Veja seu score de frequência — ele sobe quando você comparece e desce com faltas.', color: '#00d4ff' },
        { n: 3, text: 'Gerencie seus dependentes na seção abaixo dos dados pessoais.', color: '#00b894' },
      ],
    },
    'Documentos': {
      title: 'Meus Documentos',
      steps: [
        { n: 1, text: 'Envie documentos como RG, certidão ou comprovante de residência.', color: '#6c5ce7' },
        { n: 2, text: 'Acompanhe o status de cada documento: pendente, aprovado ou rejeitado.', color: '#00d4ff' },
        { n: 3, text: 'Remova documentos que não são mais necessários.', color: '#ff6b6b' },
      ],
    },
  },
}

export default function HelpButton({ currentPage, userType }) {
  const [open, setOpen] = useState(false)
  const content = helpContent[userType]?.[currentPage]

  if (!content) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-30 grid h-12 w-12 place-items-center rounded-full border border-line bg-surface text-muted shadow-xl transition hover:border-purple hover:text-purple hover:scale-110"
        title="Ajuda"
      >
        <FiHelpCircle size={22} />
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={`Ajuda — ${content.title}`} size="max-w-xl">
        <div className="space-y-4">
          {content.steps.map((step) => (
            <div key={step.n} className="flex gap-4 items-start">
              <div
                className="shrink-0 grid h-10 w-10 place-items-center rounded-xl text-lg font-bold text-white"
                style={{ backgroundColor: step.color }}
              >
                {step.n}
              </div>
              <p className="text-base leading-relaxed text-foreground pt-1.5">{step.text}</p>
            </div>
          ))}
          <div className="mt-6 rounded-xl border border-line bg-surface-alt p-4 text-sm text-muted">
            Dica: se precisar de mais ajuda, use o chat no canto inferior direito da tela.
          </div>
        </div>
      </Modal>
    </>
  )
}
