<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel da Empresa</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/home_empresa.css">
</head>

<body>

    <aside class="sidebar">
        <div class="sidebar-logo">
            <div class="logo-icon">✦</div>
            <span>Empresa</span>
        </div>

        <div class="nav-label">Configurações</div>

        <div class="nav-item active" data-section="perfil">
            <span class="nav-icon">🏢</span>
            <span>Perfil</span>
        </div>
        <div class="nav-item" data-section="servicos">
            <span class="nav-icon">⚙️</span>
            <span>Serviços</span>
        </div>
        <div class="nav-item" data-section="tags">
            <span class="nav-icon">🏷️</span>
            <span>Tags</span>
        </div>
        <div class="nav-item" data-section="regras">
            <span class="nav-icon">📋</span>
            <span>Regras</span>
        </div>

        <div class="sidebar-bottom">
            <div class="empresa-badge">
                <div class="empresa-avatar" id="sb-avatar">E</div>
                <span id="sb-name">Empresa</span>
            </div>
        </div>
    </aside>
    <div class="main">
        <div class="topbar">
            <span class="topbar-title" id="topbar-title">Perfil da Empresa</span>
            <button class="btn btn-secondary btn-sm" onclick="window.open('/home', '_blank')">
                👁 Ver página pública
            </button>
        </div>

        <div class="content">

            <div class="section active" id="section-perfil">
                <div class="section-header">
                    <div>
                        <div class="section-title">Perfil da Empresa</div>
                        <div class="section-sub">Informações exibidas na página pública para os clientes</div>
                    </div>
                    <button class="btn btn-primary" onclick="salvarPerfil()">
                        💾 Salvar alterações
                    </button>
                </div>

                <div class="preview-bar" id="preview-bar">
                    <div class="preview-logo" id="preview-logo">🏢</div>
                    <div>
                        <div class="preview-name" id="preview-nf">–</div>
                        <div class="preview-city" id="preview-city">–</div>
                    </div>
                    <div class="preview-colors">
                        <div class="preview-color-dot" id="prev-cor1" title="Cor primária"></div>
                        <div class="preview-color-dot" id="prev-cor2" title="Cor secundária"></div>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="card">
                        <div class="card-title" style="margin-bottom:18px">Dados Cadastrais</div>
                        <div class="form-group">
                            <label>Razão Social</label>
                            <input type="text" id="p-razao" placeholder="Nome legal da empresa">
                        </div>
                        <div class="form-group">
                            <label>Nome Fantasia</label>
                            <input type="text" id="p-fantasia" placeholder="Nome que os clientes verão">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>CNPJ</label>
                                <input type="text" id="p-cnpj" placeholder="00.000.000/0000-00">
                            </div>
                            <div class="form-group">
                                <label>Telefone</label>
                                <input type="text" id="p-telefone" placeholder="(00) 00000-0000">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Cidade</label>
                                <input type="text" id="p-cidade" placeholder="Sua cidade">
                            </div>
                            <div class="form-group">
                                <label>CEP</label>
                                <input type="text" id="p-cep" placeholder="00000-000">
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-title" style="margin-bottom:18px">Aparência Pública</div>
                        <div class="form-group">
                            <label>Descrição</label>
                            <textarea id="p-descricao" placeholder="Fale um pouco sobre sua empresa..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>URL do Logo</label>
                            <input type="url" id="p-logo" placeholder="https://...">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Cor Primária</label>
                                <div class="color-field">
                                    <input type="color" id="p-cor1-picker" value="#5b6cff">
                                    <input type="text" id="p-cor1" value="#5b6cff" placeholder="#000000" maxlength="7">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Cor Secundária</label>
                                <div class="color-field">
                                    <input type="color" id="p-cor2-picker" value="#ffffff">
                                    <input type="text" id="p-cor2" value="#ffffff" placeholder="#ffffff" maxlength="7">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section" id="section-servicos">
                <div class="section-header">
                    <div>
                        <div class="section-title">Serviços</div>
                        <div class="section-sub">Gerencie os serviços oferecidos pela empresa</div>
                    </div>
                    <button class="btn btn-primary" onclick="abrirModalServico()">
                        + Novo serviço
                    </button>
                </div>
                <div id="servicos-list">
                    <div class="empty">
                        <div class="empty-icon">⚙️</div>
                        <div class="empty-text">Carregando...</div>
                    </div>
                </div>
            </div>

            <div class="section" id="section-tags">
                <div class="section-header">
                    <div>
                        <div class="section-title">Tags</div>
                        <div class="section-sub">Categorias e etiquetas para organizar disponibilidades</div>
                    </div>
                    <button class="btn btn-primary" onclick="abrirModalTag()">
                        + Nova tag
                    </button>
                </div>
                <div class="tags-grid" id="tags-grid">
                    <div class="empty">
                        <div class="empty-icon">🏷️</div>
                        <div class="empty-text">Carregando...</div>
                    </div>
                </div>
            </div>

            <div class="section" id="section-regras">
                <div class="section-header">
                    <div>
                        <div class="section-title">Regras de Disponibilidade</div>
                        <div class="section-sub">Defina quando e como os agendamentos estão disponíveis</div>
                    </div>
                    <button class="btn btn-primary" onclick="abrirModalRegra()">
                        + Nova regra
                    </button>
                </div>
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Tag</th>
                                <th>Tipo</th>
                                <th>Configuração</th>
                                <th>Prioridade</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="regras-tbody">
                            <tr>
                                <td colspan="6" style="text-align:center;padding:40px;color:var(--muted)">Carregando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>

    <div class="modal-overlay" id="modal-servico">
        <div class="modal">
            <div class="modal-header">
                <div class="modal-title" id="modal-servico-title">Novo Serviço</div>
                <button class="modal-close" onclick="fecharModal('modal-servico')">×</button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="s-id">
                <div class="form-group">
                    <label>Nome do Serviço *</label>
                    <input type="text" id="s-nome" placeholder="Ex: Corte de cabelo">
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea id="s-descricao" placeholder="Descreva o serviço..."></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Duração (minutos) *</label>
                        <input type="number" id="s-duracao" min="5" step="5" placeholder="60">
                    </div>
                    <div class="form-group">
                        <label>Preço Base (R$) *</label>
                        <input type="number" id="s-preco" min="0" step="0.01" placeholder="0.00">
                    </div>
                </div>
                <div class="form-group">
                    <label>Tags</label>
                    <div class="tags-checkbox-grid" id="s-tags-check"></div>
                </div>
                <div class="form-group">
                    <div class="toggle-group">
                        <span class="toggle-label">Serviço ativo</span>
                        <label class="toggle">
                            <input type="checkbox" id="s-ativo" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div class="btn-actions">
                    <button class="btn btn-secondary" onclick="fecharModal('modal-servico')">Cancelar</button>
                    <button class="btn btn-primary" style="flex:1" onclick="salvarServico()">Salvar serviço</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="modal-tag">
        <div class="modal">
            <div class="modal-header">
                <div class="modal-title" id="modal-tag-title">Nova Tag</div>
                <button class="modal-close" onclick="fecharModal('modal-tag')">×</button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="t-id">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nome (slug interno) *</label>
                        <input type="text" id="t-nome" placeholder="segunda_manha">
                    </div>
                    <div class="form-group">
                        <label>Label (exibido) *</label>
                        <input type="text" id="t-label" placeholder="Segunda de manhã">
                    </div>
                </div>
                <div class="form-group">
                    <label>Cor</label>
                    <div class="color-field">
                        <input type="color" id="t-cor-picker" value="#888888">
                        <input type="text" id="t-cor" value="#888888" placeholder="#888888" maxlength="7">
                    </div>
                </div>
                <div class="form-group">
                    <label>Informação adicional</label>
                    <textarea id="t-info" placeholder="Descrição opcional desta tag..."></textarea>
                </div>
                <div class="form-group">
                    <div class="toggle-group">
                        <span class="toggle-label">Aceita agendamento</span>
                        <label class="toggle">
                            <input type="checkbox" id="t-aceita">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div class="btn-actions">
                    <button class="btn btn-secondary" onclick="fecharModal('modal-tag')">Cancelar</button>
                    <button class="btn btn-primary" style="flex:1" onclick="salvarTag()">Salvar tag</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="modal-regra">
        <div class="modal" style="width:560px">
            <div class="modal-header">
                <div class="modal-title" id="modal-regra-title">Nova Regra</div>
                <button class="modal-close" onclick="fecharModal('modal-regra')">×</button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="r-id">
                <div class="form-row">
                    <div class="form-group">
                        <label>Tag *</label>
                        <select id="r-tag"></select>
                    </div>
                    <div class="form-group">
                        <label>Tipo *</label>
                        <select id="r-tipo" onchange="atualizarCamposRegra()">
                            <option value="">— selecionar —</option>
                            <option value="padrao">Padrão (semanal)</option>
                            <option value="excecao">Exceção (mensal)</option>
                            <option value="unico">Único (data específica)</option>
                        </select>
                    </div>
                </div>

                <!-- Campos padrão -->
                <div id="r-campos-padrao" style="display:none">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Dia da semana</label>
                            <select id="r-diasemana">
                                <option value="">— qualquer —</option>
                                <option value="0">Domingo</option>
                                <option value="1">Segunda-feira</option>
                                <option value="2">Terça-feira</option>
                                <option value="3">Quarta-feira</option>
                                <option value="4">Quinta-feira</option>
                                <option value="5">Sexta-feira</option>
                                <option value="6">Sábado</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Quando ocorre (semana do mês)</label>
                            <select id="r-qndocorre">
                                <option value="">— qualquer —</option>
                                <option value="1">1ª semana</option>
                                <option value="2">2ª semana</option>
                                <option value="3">3ª semana</option>
                                <option value="4">4ª semana</option>
                                <option value="5">5ª semana</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Mês (opcional, deixe vazio = todo mês)</label>
                        <select id="r-mes">
                            <option value="">— todos os meses —</option>
                            <option value="1">Janeiro</option>
                            <option value="2">Fevereiro</option>
                            <option value="3">Março</option>
                            <option value="4">Abril</option>
                            <option value="5">Maio</option>
                            <option value="6">Junho</option>
                            <option value="7">Julho</option>
                            <option value="8">Agosto</option>
                            <option value="9">Setembro</option>
                            <option value="10">Outubro</option>
                            <option value="11">Novembro</option>
                            <option value="12">Dezembro</option>
                        </select>
                    </div>
                </div>

                <!-- Campos exceção (igual padrão, alias) -->
                <div id="r-campos-excecao" style="display:none">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Dia da semana</label>
                            <select id="r-exc-diasemana">
                                <option value="">— qualquer —</option>
                                <option value="0">Domingo</option>
                                <option value="1">Segunda-feira</option>
                                <option value="2">Terça-feira</option>
                                <option value="3">Quarta-feira</option>
                                <option value="4">Quinta-feira</option>
                                <option value="5">Sexta-feira</option>
                                <option value="6">Sábado</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Quando ocorre</label>
                            <select id="r-exc-qndocorre">
                                <option value="">— qualquer —</option>
                                <option value="1">1ª semana</option>
                                <option value="2">2ª semana</option>
                                <option value="3">3ª semana</option>
                                <option value="4">4ª semana</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Mês</label>
                        <select id="r-exc-mes">
                            <option value="">— todos os meses —</option>
                            <option value="1">Janeiro</option>
                            <option value="2">Fevereiro</option>
                            <option value="3">Março</option>
                            <option value="4">Abril</option>
                            <option value="5">Maio</option>
                            <option value="6">Junho</option>
                            <option value="7">Julho</option>
                            <option value="8">Agosto</option>
                            <option value="9">Setembro</option>
                            <option value="10">Outubro</option>
                            <option value="11">Novembro</option>
                            <option value="12">Dezembro</option>
                        </select>
                    </div>
                </div>

                <!-- Campos único -->
                <div id="r-campos-unico" style="display:none">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Dia</label>
                            <input type="number" id="r-unico-dia" min="1" max="31" placeholder="1–31">
                        </div>
                        <div class="form-group">
                            <label>Mês</label>
                            <select id="r-unico-mes">
                                <option value="">— selecionar —</option>
                                <option value="1">Janeiro</option>
                                <option value="2">Fevereiro</option>
                                <option value="3">Março</option>
                                <option value="4">Abril</option>
                                <option value="5">Maio</option>
                                <option value="6">Junho</option>
                                <option value="7">Julho</option>
                                <option value="8">Agosto</option>
                                <option value="9">Setembro</option>
                                <option value="10">Outubro</option>
                                <option value="11">Novembro</option>
                                <option value="12">Dezembro</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Ano (deixe vazio se repete)</label>
                            <input type="number" id="r-unico-ano" min="2020" max="2099" placeholder="2025">
                        </div>
                        <div class="form-group" style="padding-top:26px">
                            <div class="toggle-group">
                                <span class="toggle-label">Repete anualmente</span>
                                <label class="toggle">
                                    <input type="checkbox" id="r-repete">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-row" style="margin-top:6px">
                    <div class="form-group">
                        <label>Prioridade</label>
                        <input type="number" id="r-prioridade" min="1" max="100" value="10" placeholder="10">
                    </div>
                    <div class="form-group" style="padding-top:26px">
                        <div class="toggle-group">
                            <span class="toggle-label">Regra ativa</span>
                            <label class="toggle">
                                <input type="checkbox" id="r-ativo" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="btn-actions">
                    <button class="btn btn-secondary" onclick="fecharModal('modal-regra')">Cancelar</button>
                    <button class="btn btn-primary" style="flex:1" onclick="salvarRegra()">Salvar regra</button>
                </div>
            </div>
        </div>
    </div>

    <div id="toast">
        <div class="toast-dot"></div>
        <span id="toast-msg"></span>
    </div>

    <script src="./../assets/js/home_empresa.js"></script>
    
</body>

</html>