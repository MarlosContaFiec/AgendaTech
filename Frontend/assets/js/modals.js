// =========================
// CONTROLE DE MODAIS
// =========================

let servicoSelecionado = null;
let agendamentoSelecionado = null;

// =========================
// ABRIR MODAL
// =========================

function abrirModal(id)
{
    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.style.display = "flex";
}

// =========================
// FECHAR MODAL
// =========================

function fecharModal(id)
{
    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.style.display = "none";
}

// =========================
// DETALHES
// =========================

function abrirModalDetalhes(servico)
{
    document.getElementById(
        "detalhesTitulo"
    ).innerText = servico.titulo || "";

    document.getElementById(
        "detalhesDescricao"
    ).innerText = servico.descricao || "";

    document.getElementById(
        "detalhesLocal"
    ).innerText =
        servico.estabelecimento || "-";

    document.getElementById(
        "detalhesCidade"
    ).innerText =
        servico.cidade || "-";

    abrirModal("modalDetalhes");
}

function fecharModalDetalhes()
{
    fecharModal("modalDetalhes");
}

// =========================
// CONFIRMAÇÃO INSCRIÇÃO
// =========================

function abrirModalConfirmacao(id)
{
    servicoSelecionado = id;

    abrirModal(
        "modalConfirmacao"
    );
}

function fecharModalConfirmacao()
{
    fecharModal(
        "modalConfirmacao"
    );
}

document
.getElementById(
    "btnConfirmarInscricao"
)
?.addEventListener(
    "click",
    async () =>
{
    try {

        const response =
            await fetch(
                "http://localhost:3000/api/agendamentos",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    credentials:
                    "include",

                    body:JSON.stringify({
                        servicoId:
                        servicoSelecionado
                    })
                }
            );

        const data =
            await response.json();

        if(response.ok){

            alert(
                "Inscrição realizada."
            );

            location.reload();

        }else{

            alert(
                data.message ||
                "Erro."
            );

        }

    } catch (err) {

        console.error(err);

        alert(
            "Erro de conexão."
        );

    }
});

// =========================
// CANCELAMENTO
// =========================

function abrirModalCancelamento(id)
{
    agendamentoSelecionado = id;

    abrirModal(
        "modalCancelamento"
    );
}

function fecharModalCancelamento()
{
    fecharModal(
        "modalCancelamento"
    );
}

document
.getElementById(
    "btnConfirmarCancelamento"
)
?.addEventListener(
    "click",
    async () =>
{
    try {

        const response =
            await fetch(
                `http://localhost:3000/api/agendamentos/${agendamentoSelecionado}`,
                {
                    method:"DELETE"
                }
            );

        const data =
            await response.json();

        if(response.ok){

            alert(
                "Inscrição cancelada."
            );

            location.reload();

        }else{

            alert(
                data.message ||
                "Erro."
            );

        }

    } catch (err) {

        console.error(err);

        alert(
            "Erro de conexão."
        );

    }
});

// =========================
// FILA DE ESPERA
// =========================

function abrirModalFila(id)
{
    servicoSelecionado = id;

    abrirModal("modalFila");
}

function fecharModalFila()
{
    fecharModal("modalFila");
}

document
.getElementById(
    "btnEntrarFila"
)
?.addEventListener(
    "click",
    async () =>
{
    try {

        const response =
            await fetch(
                "http://localhost:3000/api/fila",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({
                        servicoId:
                        servicoSelecionado
                    })
                }
            );

        const data =
            await response.json();

        if(response.ok){

            alert(
                "Você entrou na fila."
            );

            location.reload();

        }else{

            alert(
                data.message ||
                "Erro ao entrar."
            );

        }

    } catch (err) {

        console.error(err);

        alert(
            "Erro de conexão."
        );

    }
});

// =========================
// RESERVA
// =========================

function abrirModalReserva(id)
{
    servicoSelecionado = id;

    abrirModal("modalReserva");
}

function fecharModalReserva()
{
    fecharModal("modalReserva");
}

document
.getElementById(
    "btnSalvarReserva"
)
?.addEventListener(
    "click",
    async () =>
{
    const data =
        document.getElementById(
            "reservaData"
        ).value;

    const horario =
        document.getElementById(
            "reservaHorario"
        ).value;

    try {

        const response =
            await fetch(
                "http://localhost:3000/api/reservas",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({
                        servicoId:
                        servicoSelecionado,
                        data,
                        horario
                    })
                }
            );

        const result =
            await response.json();

        if(response.ok){

            alert(
                "Reserva criada."
            );

            location.reload();

        }else{

            alert(
                result.message ||
                "Erro."
            );

        }

    } catch (err) {

        console.error(err);

        alert(
            "Erro de conexão."
        );

    }
});

// =========================
// FECHAR AO CLICAR FORA
// =========================

document
.querySelectorAll(
    ".modal-overlay"
)
.forEach(
    modal =>
{
    modal.addEventListener(
        "click",
        e =>
    {
        if(e.target === modal){

            modal.style.display =
            "none";

        }
    });
});
