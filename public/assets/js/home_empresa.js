// Configuração Global
const API = 'sua_url_da_api_aqui'; // Certifique-se de que esta constante existe
let tagsCache = [];
let toastTimer;

// --- Utilitários ---

async function req(action, method = 'GET', data = null) {
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (data) opts.body = JSON.stringify(data);
    
    try {
        const r = await fetch(`${API}?action=${action}`, opts);
        const json = await r.json();
        if (json.erro) throw new Error(json.erro);
        return json;
    } catch (e) {
        throw new Error(e.message || 'Erro na requisição');
    }
}

function toast(msg, type = 'success') {
    const el = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    if (!el || !msgEl) return;

    el.className = `show ${type}`;
    msgEl.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.className = '', 3200);
}

function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
}

function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- Navegação ---

const TITLES = {
    perfil: 'Perfil da Empresa',
    servicos: 'Serviços',
    tags: 'Tags',
    regras: 'Regras de Disponibilidade'
};

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const sec = item.dataset.section;
        
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        
        item.classList.add('active');
        const sectionEl = document.getElementById(`section-${sec}`);
        if (sectionEl) sectionEl.classList.add('active');
        
        document.getElementById('topbar-title').textContent = TITLES[sec] || 'Dashboard';

        // Carregamento sob demanda
        if (sec === 'servicos') carregarServicos();
        if (sec === 'tags') carregarTags();
        if (sec === 'regras') carregarRegras();
    });
});

// --- Perfil ---

async function carregarPerfil() {
    try {
        const d = await req('perfil_buscar');
        if (!d) return;

        const campos = {
            'p-razao': d.razao_social,
            'p-fantasia': d.nome_fantasia,
            'p-cnpj': d.cnpj,
            'p-telefone': d.telefone,
            'p-cidade': d.cidade,
            'p-cep': d.cep,
            'p-descricao': d.descricao,
            'p-logo': d.logo_url,
            'p-cor1': d.cor_primaria || '#5b6cff',
            'p-cor2': d.cor_secundaria || '#ffffff',
            'p-cor1-picker': d.cor_primaria || '#5b6cff',
            'p-cor2-picker': d.cor_secundaria || '#ffffff'
        };

        for (const [id, valor] of Object.entries(campos)) {
            const el = document.getElementById(id);
            if (el) el.value = valor || '';
        }

        atualizarPreview();
        document.getElementById('sb-name').textContent = d.nome_fantasia || d.razao_social || 'Empresa';
        document.getElementById('sb-avatar').textContent = (d.nome_fantasia || d.razao_social || 'E')[0].toUpperCase();
    } catch (e) {
        console.warn('Perfil não carregado:', e.message);
    }
}

function atualizarPreview() {
    const nf = document.getElementById('p-fantasia')?.value || '–';
    const city = document.getElementById('p-cidade')?.value || '–';
    const cor1 = document.getElementById('p-cor1')?.value || '#5b6cff';
    const cor2 = document.getElementById('p-cor2')?.value || '#ffffff';
    const logo = document.getElementById('p-logo')?.value;

    if(document.getElementById('preview-nf')) document.getElementById('preview-nf').textContent = nf;
    if(document.getElementById('preview-city')) document.getElementById('preview-city').textContent = city;
    if(document.getElementById('prev-cor1')) document.getElementById('prev-cor1').style.background = cor1;
    if(document.getElementById('prev-cor2')) document.getElementById('prev-cor2').style.background = cor2;
    
    const pl = document.getElementById('preview-logo');
    if (pl) pl.innerHTML = logo ? `<img src="${logo}" alt="logo" style="max-height:40px">` : '🏢';
}

function syncColor(pickerId, textId) {
    const picker = document.getElementById(pickerId);
    const text = document.getElementById(textId);
    if (!picker || !text) return;

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

// --- Tags ---

async function carregarTags() {
    const grid = document.getElementById('tags-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="empty">Carregando...</div>';
    try {
        tagsCache = await req('tags_listar');
        if (!tagsCache.length) {
            grid.innerHTML = '<div class="empty">Nenhuma tag criada</div>';
            return;
        }
        grid.innerHTML = tagsCache.map(t => `
            <div class="tag-card" style="border-left: 4px solid ${t.cor}">
                <div class="tag-card-head">
                    <span class="tag-card-name"><strong>${esc(t.nome)}</strong></span>
                    <div style="display:flex;gap:6px">
                        <button class="btn btn-secondary btn-sm" onclick="editarTag(${t.id})">✏️</button>
                        <button class="btn btn-danger btn-sm" onclick="excluirTag(${t.id},'${esc(t.nome)}')">🗑️</button>
                    </div>
                </div>
                <div class="tag-card-label">${esc(t.label)}</div>
                <div class="stat-pill ${t.aceita_agendamento ? 'stat-active' : 'stat-inactive'}">
                    ${t.aceita_agendamento ? '✓ Agendável' : '✗ Bloqueado'}
                </div>
            </div>
        `).join('');
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
        const acao = id ? 'tag_atualizar' : 'tag_criar';
        await req(acao, 'POST', dados);
        toast(id ? 'Tag atualizada!' : 'Tag criada!');
        fecharModal('modal-tag');
        carregarTags();
    } catch (e) {
        toast(e.message, 'error');
    }
}

// --- Serviços ---

async function carregarServicos() {
    const el = document.getElementById('servicos-list');
    if (!el) return;
    el.innerHTML = '<div class="empty">Carregando...</div>';
    try {
        const servicos = await req('servicos_listar');
        if (!servicos.length) {
            el.innerHTML = '<div class="empty">Nenhum serviço cadastrado</div>';
            return;
        }
        el.innerHTML = `<div class="grid-2">${servicos.map(s => `
            <div class="card">
                <div class="card-head">
                    <div>
                        <div class="card-title">${esc(s.nome)}</div>
                        <div class="muted">${s.duracao_minutos} min · R$ ${parseFloat(s.preco_base).toFixed(2)}</div>
                    </div>
                    <span class="stat-pill ${s.ativo ? 'stat-active' : 'stat-inactive'}">${s.ativo ? 'Ativo' : 'Pausado'}</span>
                </div>
                <div style="margin: 10px 0; font-size: 0.85rem">${esc(s.descricao || '')}</div>
                <div style="display:flex;gap:8px">
                    <button class="btn btn-secondary btn-sm" onclick="editarServico(${s.id})">✏️ Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirServico(${s.id},'${esc(s.nome)}')">🗑️</button>
                </div>
            </div>
        `).join('')}</div>`;
    } catch (e) {
        toast(e.message, 'error');
    }
}

async function editarServico(id) {
    try {
        if (!tagsCache.length) tagsCache = await req('tags_listar');
        const servicos = await req('servicos_listar');
        const s = servicos.find(x => x.id == id);
        if (!s) return;

        document.getElementById('s-id').value = s.id;
        document.getElementById('s-nome').value = s.nome;
        document.getElementById('s-descricao').value = s.descricao || '';
        document.getElementById('s-duracao').value = s.duracao_minutos;
        document.getElementById('s-preco').value = s.preco_base;
        document.getElementById('s-ativo').checked = !!s.ativo;
        
        const tagIds = s.tag_ids ? String(s.tag_ids).split(',').map(Number) : [];
        preencherTagsCheckbox(tagIds);
        
        document.getElementById('modal-servico-title').textContent = 'Editar Serviço';
        abrirModal('modal-servico');
    } catch (e) {
        toast(e.message, 'error');
    }
}

// --- Regras ---

function atualizarCamposRegra() {
    const tipo = document.getElementById('r-tipo').value;
    const pnlPadrao = document.getElementById('r-campos-padrao');
    const pnlExcecao = document.getElementById('r-campos-excecao');
    const pnlUnico = document.getElementById('r-campos-unico');

    if(pnlPadrao) pnlPadrao.style.display = tipo === 'padrao' ? '' : 'none';
    if(pnlExcecao) pnlExcecao.style.display = tipo === 'excecao' ? '' : 'none';
    if(pnlUnico) pnlUnico.style.display = tipo === 'unico' ? '' : 'none';
}

async function salvarRegra() {
    const id = document.getElementById('r-id').value;
    const tipo = document.getElementById('r-tipo').value;
    
    if (!tipo) return toast('Selecione o tipo de regra', 'error');

    const dados = {
        id: id ? parseInt(id) : null,
        tag_id: parseInt(document.getElementById('r-tag').value),
        tipo,
        prioridade: parseInt(document.getElementById('r-prioridade').value) || 10,
        ativo: document.getElementById('r-ativo').checked ? 1 : 0,
    };

    if (tipo === 'padrao' || tipo === 'excecao') {
        const prefix = tipo === 'padrao' ? 'r-' : 'r-exc-';
        dados.dia_semana = document.getElementById(`${prefix}diasemana`).value || null;
        dados.qnd_ocorre = document.getElementById(`${prefix}qndocorre`).value || null;
        dados.mes = document.getElementById(`${prefix}mes`).value || null;
    } else if (tipo === 'unico') {
        dados.unico_dia = document.getElementById('r-unico-dia').value || null;
        dados.unico_mes = document.getElementById('r-unico-mes').value || null;
        dados.unico_ano = document.getElementById('r-unico-ano').value || null;
        dados.unico_repete_anual = document.getElementById('r-repete').checked ? 1 : 0;
    }

    try {
        await req(id ? 'regra_atualizar' : 'regra_criar', 'POST', dados);
        toast('Regra salva!');
        fecharModal('modal-regra');
        carregarRegras();
    } catch (e) {
        toast(e.message, 'error');
    }
}

// --- Inicialização ---

document.addEventListener('DOMContentLoaded', () => {
    carregarPerfil();
    
    // Listeners de cores
    syncColor('p-cor1-picker', 'p-cor1');
    syncColor('p-cor2-picker', 'p-cor2');
    syncColor('t-cor-picker', 't-cor');

    // Inputs de preview do perfil
    ['p-fantasia', 'p-cidade', 'p-cor1', 'p-cor2', 'p-logo'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', atualizarPreview);
    });

    // Fechar modal ao clicar na overlay
    document.querySelectorAll('.modal-overlay').forEach(o => {
        o.addEventListener('click', e => {
            if (e.target === o) o.classList.remove('open');
        });
    });
});