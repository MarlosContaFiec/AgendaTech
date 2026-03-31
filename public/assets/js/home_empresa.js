async function req(action, method = 'GET', data = null) {
    const opts = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (data) opts.body = JSON.stringify(data);
    const r = await fetch(`${API}?action=${action}`, opts);
    const json = await r.json();
    if (json.erro) throw new Error(json.erro);
    return json;
}

let toastTimer;

function toast(msg, type = 'success') {
    const el = document.getElementById('toast');
    el.className = `show ${type}`;
    document.getElementById('toast-msg').textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.className = '', 3200);
}

function abrirModal(id) {
    document.getElementById(id).classList.add('open');
}

function fecharModal(id) {
    document.getElementById(id).classList.remove('open');
}

// Fechar modal ao clicar fora
document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => {
        if (e.target === o) o.classList.remove('open');
    });
});

const TITLES = {
    perfil: 'Perfil da Empresa',
    servicos: 'Serviços',
    tags: 'Tags',
    regras: 'Regras de Disponibilidade'
};

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        item.classList.add('active');
        const sec = item.dataset.section;
        document.getElementById(`section-${sec}`).classList.add('active');
        document.getElementById('topbar-title').textContent = TITLES[sec];
        if (sec === 'servicos') carregarServicos();
        if (sec === 'tags') carregarTags();
        if (sec === 'regras') carregarRegras();
    });
});

async function carregarPerfil() {
    try {
        const d = await req('perfil_buscar');
        if (!d) return;
        document.getElementById('p-razao').value = d.razao_social || '';
        document.getElementById('p-fantasia').value = d.nome_fantasia || '';
        document.getElementById('p-cnpj').value = d.cnpj || '';
        document.getElementById('p-telefone').value = d.telefone || '';
        document.getElementById('p-cidade').value = d.cidade || '';
        document.getElementById('p-cep').value = d.cep || '';
        document.getElementById('p-descricao').value = d.descricao || '';
        document.getElementById('p-logo').value = d.logo_url || '';
        document.getElementById('p-cor1').value = d.cor_primaria || '#5b6cff';
        document.getElementById('p-cor2').value = d.cor_secundaria || '#ffffff';
        document.getElementById('p-cor1-picker').value = d.cor_primaria || '#5b6cff';
        document.getElementById('p-cor2-picker').value = d.cor_secundaria || '#ffffff';
        atualizarPreview();
        document.getElementById('sb-name').textContent = d.nome_fantasia || d.razao_social || 'Empresa';
        document.getElementById('sb-avatar').textContent = (d.nome_fantasia || 'E')[0].toUpperCase();
    } catch (e) {
        console.warn('Perfil não carregado:', e.message);
    }
}

function atualizarPreview() {
    const nf = document.getElementById('p-fantasia').value || '–';
    const city = document.getElementById('p-cidade').value || '–';
    const cor1 = document.getElementById('p-cor1').value;
    const cor2 = document.getElementById('p-cor2').value;
    const logo = document.getElementById('p-logo').value;
    document.getElementById('preview-nf').textContent = nf;
    document.getElementById('preview-city').textContent = city;
    document.getElementById('prev-cor1').style.background = cor1;
    document.getElementById('prev-cor2').style.background = cor2;
    const pl = document.getElementById('preview-logo');
    pl.innerHTML = logo ? `<img src="${logo}" alt="logo">` : '🏢';
}

['p-fantasia', 'p-cidade', 'p-cor1', 'p-cor2', 'p-logo'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', atualizarPreview);
});

function syncColor(pickerId, textId) {
    const picker = document.getElementById(pickerId);
    const text = document.getElementById(textId);
    picker.addEventListener('input', () => {
        text.value = picker.value;
        atualizarPreview();
    });
    text.addEventListener('input', () => {
        if (/^#[0-9a-fA-F]{6}$/.test(text.value)) {
            picker.value = text.value;
            atualizarPreview();
        }
    });
}
syncColor('p-cor1-picker', 'p-cor1');
syncColor('p-cor2-picker', 'p-cor2');
syncColor('t-cor-picker', 't-cor');

async function salvarPerfil() {
    try {
        const dados = {
            razao_social: document.getElementById('p-razao').value,
            nome_fantasia: document.getElementById('p-fantasia').value,
            cnpj: document.getElementById('p-cnpj').value,
            telefone: document.getElementById('p-telefone').value,
            cidade: document.getElementById('p-cidade').value,
            cep: document.getElementById('p-cep').value,
            descricao: document.getElementById('p-descricao').value,
            logo_url: document.getElementById('p-logo').value,
            cor_primaria: document.getElementById('p-cor1').value,
            cor_secundaria: document.getElementById('p-cor2').value,
        };
        await req('perfil_salvar', 'POST', dados);
        toast('Perfil salvo com sucesso!');
        document.getElementById('sb-name').textContent = dados.nome_fantasia || dados.razao_social || 'Empresa';
        document.getElementById('sb-avatar').textContent = (dados.nome_fantasia || 'E')[0].toUpperCase();
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function carregarTags() {
    const grid = document.getElementById('tags-grid');
    grid.innerHTML = '<div class="empty"><div class="empty-icon">🏷️</div><div class="empty-text">Carregando...</div></div>';
    try {
        const tags = await req('tags_listar');
        tagsCache = tags;
        if (!tags.length) {
            grid.innerHTML = '<div class="empty"><div class="empty-icon">🏷️</div><div class="empty-text">Nenhuma tag criada ainda</div></div>';
            return;
        }
        grid.innerHTML = tags.map(t => `
      <div class="tag-card" style="--tag-color:${t.cor}">
        <div class="tag-card-head">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:12px;height:12px;border-radius:50%;background:${t.cor};flex-shrink:0"></div>
            <span class="tag-card-name">${esc(t.nome)}</span>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-secondary btn-sm btn-icon" title="Editar" onclick="editarTag(${t.id})">✏️</button>
            <button class="btn btn-danger btn-sm btn-icon" title="Excluir" onclick="excluirTag(${t.id},'${esc(t.nome)}')">🗑️</button>
          </div>
        </div>
        <div class="tag-card-label">${esc(t.label)}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <span class="stat-pill ${t.aceita_agendamento ? 'stat-active' : 'stat-inactive'}">
            ${t.aceita_agendamento ? '✓ Aceita agendamento' : '✗ Sem agendamento'}
          </span>
        </div>
        ${t.info ? `<div style="font-size:0.78rem;color:var(--muted);margin-top:10px">${esc(t.info)}</div>` : ''}
      </div>
    `).join('');
    } catch (e) {
        toast(e.message, 'error');
    }
}

function abrirModalTag(tag = null) {
    document.getElementById('t-id').value = '';
    document.getElementById('t-nome').value = '';
    document.getElementById('t-label').value = '';
    document.getElementById('t-cor').value = '#888888';
    document.getElementById('t-cor-picker').value = '#888888';
    document.getElementById('t-info').value = '';
    document.getElementById('t-aceita').checked = false;
    document.getElementById('modal-tag-title').textContent = 'Nova Tag';
    if (tag) {
        document.getElementById('t-id').value = tag.id;
        document.getElementById('t-nome').value = tag.nome;
        document.getElementById('t-label').value = tag.label;
        document.getElementById('t-cor').value = tag.cor;
        document.getElementById('t-cor-picker').value = tag.cor;
        document.getElementById('t-info').value = tag.info || '';
        document.getElementById('t-aceita').checked = !!tag.aceita_agendamento;
        document.getElementById('modal-tag-title').textContent = 'Editar Tag';
    }
    abrirModal('modal-tag');
}

async function editarTag(id) {
    try {
        const tags = await req('tags_listar');
        const tag = tags.find(t => t.id == id);
        if (tag) abrirModalTag(tag);
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function salvarTag() {
    const id = document.getElementById('t-id').value;
    const dados = {
        id: id ? parseInt(id) : null,
        nome: document.getElementById('t-nome').value.trim(),
        label: document.getElementById('t-label').value.trim(),
        cor: document.getElementById('t-cor').value,
        info: document.getElementById('t-info').value.trim(),
        aceita_agendamento: document.getElementById('t-aceita').checked ? 1 : 0,
    };
    try {
        if (id) {
            await req('tag_atualizar', 'POST', dados);
            toast('Tag atualizada!');
        } else {
            await req('tag_criar', 'POST', dados);
            toast('Tag criada!');
        }
        fecharModal('modal-tag');
        carregarTags();
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function excluirTag(id, nome) {
    if (!confirm(`Excluir a tag "${nome}"? As regras vinculadas também serão removidas.`)) return;
    try {
        await req('tag_excluir', 'POST', {
            id
        });
        toast('Tag excluída!');
        carregarTags();
    } catch (e) {
        toast(e.message, 'error');
    }
}
async function carregarServicos() {
    const el = document.getElementById('servicos-list');
    el.innerHTML = '<div class="empty"><div class="empty-icon">⚙️</div><div class="empty-text">Carregando...</div></div>';
    try {
        const servicos = await req('servicos_listar');
        if (!servicos.length) {
            el.innerHTML = '<div class="empty"><div class="empty-icon">⚙️</div><div class="empty-text">Nenhum serviço cadastrado</div></div>';
            return;
        }
        el.innerHTML = `<div class="grid-2">${servicos.map(s => `
      <div class="card" style="padding:20px">
        <div class="card-head">
          <div>
            <div class="card-title">${esc(s.nome)}</div>
            <div style="font-size:0.78rem;color:var(--muted);margin-top:3px">${s.duracao_minutos} min · R$ ${parseFloat(s.preco_base).toFixed(2)}</div>
          </div>
          <div class="card-actions">
            <span class="stat-pill ${s.ativo ? 'stat-active' : 'stat-inactive'}">${s.ativo ? 'Ativo' : 'Inativo'}</span>
          </div>
        </div>
        ${s.descricao ? `<div style="font-size:0.82rem;color:var(--muted);margin-bottom:10px">${esc(s.descricao)}</div>` : ''}
        ${s.tags_nome ? `<div style="font-size:0.78rem;color:var(--muted);margin-bottom:12px">🏷️ ${esc(s.tags_nome)}</div>` : ''}
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary btn-sm" onclick="editarServico(${s.id})">✏️ Editar</button>
          <button class="btn btn-secondary btn-sm" onclick="toggleServico(${s.id})">${s.ativo ? '⏸ Pausar' : '▶ Ativar'}</button>
          <button class="btn btn-danger btn-sm" onclick="excluirServico(${s.id},'${esc(s.nome)}')">🗑️</button>
        </div>
      </div>
    `).join('')}</div>`;
    } catch (e) {
        toast(e.message, 'error');
    }
}

function preencherTagsCheckbox(selecionadas = []) {
    const el = document.getElementById('s-tags-check');
    if (!tagsCache.length) {
        el.innerHTML = '<span style="color:var(--muted);font-size:0.82rem">Nenhuma tag disponível</span>';
        return;
    }
    el.innerHTML = tagsCache.map(t => `
    <label class="tag-check-item ${selecionadas.includes(t.id) ? 'selected' : ''}" id="tc-${t.id}">
      <input type="checkbox" value="${t.id}" ${selecionadas.includes(t.id) ? 'checked' : ''} onchange="syncTagCheck(this, ${t.id})">
      <div class="tag-dot" style="background:${t.cor}"></div>
      ${esc(t.label)}
    </label>
  `).join('');
}

function syncTagCheck(input, id) {
    const lbl = document.getElementById(`tc-${id}`);
    lbl.classList.toggle('selected', input.checked);
}

async function abrirModalServico() {
    if (!tagsCache.length) await carregarTagsCache();
    document.getElementById('s-id').value = '';
    document.getElementById('s-nome').value = '';
    document.getElementById('s-descricao').value = '';
    document.getElementById('s-duracao').value = '';
    document.getElementById('s-preco').value = '';
    document.getElementById('s-ativo').checked = true;
    document.getElementById('modal-servico-title').textContent = 'Novo Serviço';
    preencherTagsCheckbox([]);
    abrirModal('modal-servico');
}

async function editarServico(id) {
    if (!tagsCache.length) await carregarTagsCache();
    try {
        const s = await req(`servicos_listar`); // Podemos fazer busca individual no futuro
        const servico = (await req('servicos_listar')).find(x => x.id == id);
        document.getElementById('s-id').value = id;
        document.getElementById('s-nome').value = servico.nome;
        document.getElementById('s-descricao').value = servico.descricao || '';
        document.getElementById('s-duracao').value = servico.duracao_minutos;
        document.getElementById('s-preco').value = servico.preco_base;
        document.getElementById('s-ativo').checked = !!servico.ativo;
        document.getElementById('modal-servico-title').textContent = 'Editar Serviço';
        const tagIds = servico.tag_ids ? servico.tag_ids.split(',').map(Number) : [];
        preencherTagsCheckbox(tagIds);
        abrirModal('modal-servico');
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function salvarServico() {
    const id = document.getElementById('s-id').value;
    const tagInputs = document.querySelectorAll('#s-tags-check input:checked');
    const dados = {
        id: id ? parseInt(id) : null,
        nome: document.getElementById('s-nome').value.trim(),
        descricao: document.getElementById('s-descricao').value.trim(),
        duracao_minutos: parseInt(document.getElementById('s-duracao').value),
        preco_base: parseFloat(document.getElementById('s-preco').value),
        ativo: document.getElementById('s-ativo').checked ? 1 : 0,
        tags: Array.from(tagInputs).map(i => parseInt(i.value)),
    };
    try {
        if (id) {
            await req('servico_atualizar', 'POST', dados);
            toast('Serviço atualizado!');
        } else {
            await req('servico_criar', 'POST', dados);
            toast('Serviço criado!');
        }
        fecharModal('modal-servico');
        carregarServicos();
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function toggleServico(id) {
    try {
        await req('servico_toggle', 'POST', {
            id
        });
        toast('Status alterado!');
        carregarServicos();
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function excluirServico(id, nome) {
    if (!confirm(`Excluir o serviço "${nome}"?`)) return;
    try {
        await req('servico_excluir', 'POST', {
            id
        });
        toast('Serviço excluído!');
        carregarServicos();
    } catch (e) {
        toast(e.message, 'error');
    }
}
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

async function carregarRegras() {
    const tbody = document.getElementById('regras-tbody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--muted)">Carregando...</td></tr>';
    try {
        const regras = await req('regras_listar');
        if (!regras.length) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--muted)">Nenhuma regra configurada</td></tr>';
            return;
        }
        tbody.innerHTML = regras.map(r => {
            let config = '';
            if (r.tipo === 'padrao' || r.tipo === 'excecao') {
                const dia = r.dia_semana !== null ? DIAS[r.dia_semana] : '–';
                const sem = r.qnd_ocorre ? `${r.qnd_ocorre}ª sem.` : '–';
                const mes = r.mes ? MESES[r.mes] : 'Todo mês';
                config = `${dia} · ${sem} · ${mes}`;
            } else if (r.tipo === 'unico') {
                config = r.unico_repete_anual ?
                    `${String(r.unico_dia).padStart(2, '0')}/${MESES[r.unico_mes]} (anual)` :
                    `${String(r.unico_dia).padStart(2, '0')}/${MESES[r.unico_mes]}/${r.unico_ano ?? '–'}`;
            }
            return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:10px;height:10px;border-radius:50%;background:${r.tag_cor};flex-shrink:0"></div>
              <span>${esc(r.tag_label)}</span>
            </div>
          </td>
          <td><span class="tipo-badge tipo-${r.tipo}">${r.tipo}</span></td>
          <td style="font-size:0.83rem;color:var(--muted)">${config}</td>
          <td style="font-size:0.83rem">${r.prioridade}</td>
          <td><span class="stat-pill ${r.ativo ? 'stat-active' : 'stat-inactive'}">${r.ativo ? 'Ativa' : 'Inativa'}</span></td>
          <td>
            <div style="display:flex;gap:6px">
              <button class="btn btn-secondary btn-sm" onclick="editarRegra(${r.id})">✏️</button>
              <button class="btn btn-danger btn-sm" onclick="excluirRegra(${r.id})">🗑️</button>
            </div>
          </td>
        </tr>
      `;
        }).join('');
    } catch (e) {
        toast(e.message, 'error');
    }
}

function atualizarCamposRegra() {
    const tipo = document.getElementById('r-tipo').value;
    document.getElementById('r-campos-padrao').style.display = tipo === 'padrao' ? '' : 'none';
    document.getElementById('r-campos-excecao').style.display = tipo === 'excecao' ? '' : 'none';
    document.getElementById('r-campos-unico').style.display = tipo === 'unico' ? '' : 'none';
}

async function carregarTagsCache() {
    tagsCache = await req('tags_listar');
}

function preencherTagSelect() {
    const sel = document.getElementById('r-tag');
    sel.innerHTML = '<option value="">— selecionar —</option>' +
        tagsCache.map(t => `<option value="${t.id}">${esc(t.label)}</option>`).join('');
}

async function abrirModalRegra() {
    if (!tagsCache.length) await carregarTagsCache();
    preencherTagSelect();
    document.getElementById('r-id').value = '';
    document.getElementById('r-tipo').value = '';
    document.getElementById('r-prioridade').value = 10;
    document.getElementById('r-ativo').checked = true;
    document.getElementById('r-repete').checked = false;
    atualizarCamposRegra();
    document.getElementById('modal-regra-title').textContent = 'Nova Regra';
    abrirModal('modal-regra');
}

async function editarRegra(id) {
    if (!tagsCache.length) await carregarTagsCache();
    preencherTagSelect();
    try {
        const regras = await req('regras_listar');
        const r = regras.find(x => x.id == id);
        document.getElementById('r-id').value = r.id;
        document.getElementById('r-tag').value = r.tag_id;
        document.getElementById('r-tipo').value = r.tipo;
        document.getElementById('r-prioridade').value = r.prioridade;
        document.getElementById('r-ativo').checked = !!r.ativo;
        atualizarCamposRegra();

        if (r.tipo === 'padrao') {
            document.getElementById('r-diasemana').value = r.dia_semana ?? '';
            document.getElementById('r-qndocorre').value = r.qnd_ocorre ?? '';
            document.getElementById('r-mes').value = r.mes ?? '';
        } else if (r.tipo === 'excecao') {
            document.getElementById('r-exc-diasemana').value = r.dia_semana ?? '';
            document.getElementById('r-exc-qndocorre').value = r.qnd_ocorre ?? '';
            document.getElementById('r-exc-mes').value = r.mes ?? '';
        } else if (r.tipo === 'unico') {
            document.getElementById('r-unico-dia').value = r.unico_dia ?? '';
            document.getElementById('r-unico-mes').value = r.unico_mes ?? '';
            document.getElementById('r-unico-ano').value = r.unico_ano ?? '';
            document.getElementById('r-repete').checked = !!r.unico_repete_anual;
        }
        document.getElementById('modal-regra-title').textContent = 'Editar Regra';
        abrirModal('modal-regra');
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function salvarRegra() {
    const id = document.getElementById('r-id').value;
    const tipo = document.getElementById('r-tipo').value;
    const dados = {
        id: id ? parseInt(id) : null,
        tag_id: parseInt(document.getElementById('r-tag').value),
        tipo,
        prioridade: parseInt(document.getElementById('r-prioridade').value) || 10,
        ativo: document.getElementById('r-ativo').checked ? 1 : 0,
    };
    if (tipo === 'padrao') {
        dados.dia_semana = document.getElementById('r-diasemana').value || null;
        dados.qnd_ocorre = document.getElementById('r-qndocorre').value || null;
        dados.mes = document.getElementById('r-mes').value || null;
    } else if (tipo === 'excecao') {
        dados.dia_semana = document.getElementById('r-exc-diasemana').value || null;
        dados.qnd_ocorre = document.getElementById('r-exc-qndocorre').value || null;
        dados.mes = document.getElementById('r-exc-mes').value || null;
    } else if (tipo === 'unico') {
        dados.unico_dia = document.getElementById('r-unico-dia').value || null;
        dados.unico_mes = document.getElementById('r-unico-mes').value || null;
        dados.unico_ano = document.getElementById('r-unico-ano').value || null;
        dados.unico_repete_anual = document.getElementById('r-repete').checked ? 1 : 0;
    }
    try {
        if (id) {
            await req('regra_atualizar', 'POST', dados);
            toast('Regra atualizada!');
        } else {
            await req('regra_criar', 'POST', dados);
            toast('Regra criada!');
        }
        fecharModal('modal-regra');
        carregarRegras();
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function excluirRegra(id) {
    if (!confirm('Excluir esta regra?')) return;
    try {
        await req('regra_excluir', 'POST', {
            id
        });
        toast('Regra excluída!');
        carregarRegras();
    } catch (e) {
        toast(e.message, 'error');
    }
}

function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
carregarPerfil();
carregarTagsCache();
