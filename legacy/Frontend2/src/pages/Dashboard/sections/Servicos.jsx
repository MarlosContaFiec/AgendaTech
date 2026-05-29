import { useState, useEffect } from 'react';
import { apiListarServicos, apiCriarServico, apiEditarServico } from '@/services/servicos';
import { BotaoPrimario } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

export default function Servicos() {
  const [items, setItems] = useState([]);
  const [load, setLoad] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ nome:'', descricao:'', duracao_minutos:30, preco_base:'', aceitamento_automatico:true });
  const [toast, setToast] = useState('');

  async function carregar() { setLoad(true); const r = await apiListarServicos(); if (r.success) setItems(r.data||[]); setLoad(false); }
  useEffect(() => { carregar(); }, []);

  function upd(k, v) { setForm(p => ({ ...p, [k]: v })); }

  async function salvar() {
    const dados = { ...form, preco_base: Number(form.preco_base), duracao_minutos: Number(form.duracao_minutos) };
    const r = modal?.tipo === 'editar' ? await apiEditarServico(modal.servico.id, dados) : await apiCriarServico(dados);
    if (r.success) { setToast(modal?.tipo === 'editar' ? 'Atualizado!' : 'Criado!'); setModal(null); carregar(); }
    setTimeout(() => setToast(''), 3000);
  }

  async function toggleAtivo(s) { await apiEditarServico(s.id, { ativo: !s.ativo }); carregar(); }

  function abrirEditar(s) { setForm({ nome:s.nome, descricao:s.descricao||'', duracao_minutos:s.duracao_minutos, preco_base:String(s.preco_base), aceitamento_automatico:s.aceitamento_automatico }); setModal({ tipo:'editar', servico:s }); }
  function abrirCriar() { setForm({ nome:'', descricao:'', duracao_minutos:30, preco_base:'', aceitamento_automatico:true }); setModal('criar'); }

  if (load) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-[3px] border-tb-accent/20 border-t-tb-accent rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Serviços</h1><p className="text-[0.85rem] text-[#7c819a]">{items.length} cadastrados</p></div>
        <button onClick={abrirCriar} className="flex items-center gap-2 py-2.5 px-5 rounded-lg font-bold text-[0.85rem] bg-[#5b6cff] text-white border-none hover:bg-[#4a5be8]"><span className="material-icons-outlined" style={{fontSize:18}}>add</span> Novo</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(s => (
          <div key={s.id} className="bg-[#13161e] border border-[#2a2f42] rounded-xl overflow-hidden hover:border-[#3a3f55] transition-all">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[0.63rem] font-bold uppercase py-1 px-2.5 rounded-full ${s.ativo ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>{s.ativo ? 'Ativo' : 'Inativo'}</span>
              </div>
              <h4 className="text-[0.95rem] font-bold text-[#e8eaf2] mb-1">{s.nome}</h4>
              {s.descricao && <p className="text-[0.78rem] text-[#7c819a] mb-2 line-clamp-2">{s.descricao}</p>}
              <div className="flex gap-4 text-[0.78rem] text-[#7c819a]">
                <span className="flex items-center gap-1"><span className="material-icons-outlined" style={{fontSize:14}}>payments</span> R$ {Number(s.preco_base).toFixed(2)}</span>
                <span className="flex items-center gap-1"><span className="material-icons-outlined" style={{fontSize:14}}>schedule</span> {s.duracao_minutos}min</span>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-[#2a2f42] flex gap-2">
              <button onClick={() => abrirEditar(s)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-semibold text-[0.8rem] bg-[#1a1e29] text-[#e8eaf2] border border-[#2a2f42] hover:bg-[#222636]"><span className="material-icons-outlined" style={{fontSize:15}}>edit</span> Editar</button>
              <button onClick={() => toggleAtivo(s)} className={`flex items-center gap-1.5 py-2 px-3 rounded-lg font-semibold text-[0.8rem] border ${s.ativo ? 'bg-red-500/10 text-red-400 border-red-500/25 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/25 hover:bg-green-500/20'}`}>
                <span className="material-icons-outlined" style={{fontSize:15}}>{s.ativo ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="text-center py-16 text-[#7c819a]"><span className="material-icons-outlined" style={{fontSize:48}}>inventory_2</span><p className="mt-2">Nenhum serviço cadastrado.</p></div>}

      {modal && (
        <Modal onClose={() => setModal(null)}>
          <ModalHeader titulo={modal?.tipo === 'editar' ? 'Editar Serviço' : 'Novo Serviço'} onClose={() => setModal(null)} />
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input label="Nome" value={form.nome} onChange={v => upd('nome',v.target.value)} obrigatorio />
              <Input label="Descrição" value={form.descricao} onChange={v => upd('descricao',v.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Duração (min)" type="number" value={form.duracao_minutos} onChange={v => upd('duracao_minutos',v.target.value)} />
                <Input label="Preço (R$)" type="number" value={form.preco_base} onChange={v => upd('preco_base',v.target.value)} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.aceitamento_automatico} onChange={e => upd('aceitamento_automatico',e.target.checked)} className="accent-[#5b6cff] w-4 h-4" /><span className="text-[0.85rem] text-[#a0a4ba]">Aceitamento automático</span></label>
            </div>
          </ModalBody>
          <ModalFooter>
            <button onClick={() => setModal(null)} className="py-2 px-4 rounded-lg font-semibold text-[0.82rem] bg-[#1a1e29] text-[#e8eaf2] border border-[#2a2f42]">Cancelar</button>
            <BotaoPrimario onClick={salvar} className="w-auto px-6">Salvar</BotaoPrimario>
          </ModalFooter>
        </Modal>
      )}
      <Toast msg={toast} type="success" />
    </div>
  );
}
