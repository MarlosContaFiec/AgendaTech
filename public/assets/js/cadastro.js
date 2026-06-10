// ==========================
// MOSTRAR / ESCONDER SENHA
// ==========================
function toggleSenha(id) {
    let campo = document.getElementById(id);
    campo.type = campo.type === "password" ? "text" : "password";
}


// ==========================
// VERIFICADOR DE SENHA
// ==========================
const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmar_senha");

if (senha) {
    senha.addEventListener("keyup", function () {

        let valor = senha.value;

        document.getElementById("char").style.color =
            valor.length >= 8 ? "#22c55e" : "#f87171";

        document.getElementById("upper").style.color =
            /[A-Z]/.test(valor) ? "#22c55e" : "#f87171";

        document.getElementById("lower").style.color =
            /[a-z]/.test(valor) ? "#22c55e" : "#f87171";

        document.getElementById("number").style.color =
            /[0-9]/.test(valor) ? "#22c55e" : "#f87171";

        document.getElementById("special").style.color =
            /[!@#$%&*]/.test(valor) ? "#22c55e" : "#f87171";
    });
}


// ==========================
// CONFIRMAR SENHA
// ==========================
if (confirmarSenha) {
    confirmarSenha.addEventListener("keyup", function () {

        if (confirmarSenha.value === senha.value) {
            confirmarSenha.style.border = "2px solid #22c55e";
        } else {
            confirmarSenha.style.border = "2px solid #f87171";
        }

    });
}


// ==========================
// MÁSCARA DE CNPJ
// ==========================
const cnpj = document.getElementById("cnpj");

if (cnpj) {
    cnpj.addEventListener("input", function () {

        let valor = cnpj.value.replace(/\D/g, "");

        if (valor.length > 14) {
            valor = valor.slice(0, 14);
        }

        valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
        valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");

        cnpj.value = valor;
    });
}


// ==========================
// LIMPAR CAMPOS COM ERRO
// ==========================
window.onload = function () {

    if (typeof erros !== "undefined") {

        if (erros.email) {
            document.getElementById("email").value = "";
        }

        if (erros.cnpj) {
            document.getElementById("cnpj").value = "";
        }

        if (erros.senha) {
            document.getElementById("senha").value = "";
            document.getElementById("confirmar_senha").value = "";
        }

    }

};