// MOSTRAR / ESCONDER SENHA
function toggleSenha(id) {

    let campo = document.getElementById(id);

    if (campo.type === "password") {
        campo.type = "text";
    } else {
        campo.type = "password";
    }

}


// VERIFICADOR DE SENHA
const senha = document.getElementById("senha");

if (senha) {

senha.addEventListener("keyup", function () {

    let valor = senha.value;

    let char = document.getElementById("char");
    let upper = document.getElementById("upper");
    let lower = document.getElementById("lower");
    let number = document.getElementById("number");
    let special = document.getElementById("special");

    // mínimo 8 caracteres
    if (valor.length >= 8) {
        char.style.color = "#22c55e";
    } else {
        char.style.color = "#f87171";
    }

    // letra maiúscula
    if (/[A-Z]/.test(valor)) {
        upper.style.color = "#22c55e";
    } else {
        upper.style.color = "#f87171";
    }

    // letra minúscula
    if (/[a-z]/.test(valor)) {
        lower.style.color = "#22c55e";
    } else {
        lower.style.color = "#f87171";
    }

    // número
    if (/[0-9]/.test(valor)) {
        number.style.color = "#22c55e";
    } else {
        number.style.color = "#f87171";
    }

    // caractere especial
    if (/[!@#$%&*]/.test(valor)) {
        special.style.color = "#22c55e";
    } else {
        special.style.color = "#f87171";
    }

});
}


// MÁSCARA DE CPF
const cpf = document.getElementById("cpf");

if (cpf) {

cpf.addEventListener("input", function () {

    let valor = cpf.value.replace(/\D/g, "");

    if (valor.length > 11) {
        valor = valor.slice(0, 11);
    }

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    cpf.value = valor;

});
}