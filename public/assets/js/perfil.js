// FOTO PREVIEW
const inputFoto = document.getElementById("inputFoto");
let fotoPerfil = document.getElementById("fotoPerfil");
const textoFoto = document.getElementById("textoFoto");
const wrapper = document.getElementById("fotoPerfilWrapper");

inputFoto.addEventListener("change", function () {
  if (this.files && this.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {

      if (!fotoPerfil) {
        fotoPerfil = document.createElement("img");
        fotoPerfil.id = "fotoPerfil";
        wrapper.appendChild(fotoPerfil);
      }

      fotoPerfil.src = e.target.result;
      fotoPerfil.style.display = "block";

      if (textoFoto) textoFoto.style.display = "none";
    };

    reader.readAsDataURL(this.files[0]);
  }
});

// FOTO JÁ SALVA
if (fotoPerfil && fotoPerfil.src) {
  fotoPerfil.style.display = "block";
  if (textoFoto) textoFoto.style.display = "none";
}

// NOME DO ARQUIVO
const inputArquivo = document.getElementById("arquivo");
const nomeArquivo = document.getElementById("nomeArquivo");

if (inputArquivo) {
  inputArquivo.addEventListener("change", function () {
    if (this.files.length > 0) {
      nomeArquivo.textContent = this.files[0].name;
    }
  });
}

// MENSAGEM
const form = document.querySelector("form");
const msg = document.getElementById("msgSucesso");

form.addEventListener("submit", () => {
  msg.style.display = "block";
});

// MODAL
const modal = document.getElementById("modalFoto");
const fotoModal = document.getElementById("fotoModal");
const fecharModal = document.getElementById("fecharModal");

wrapper.addEventListener("click", () => {
  if (fotoPerfil && fotoPerfil.src) {
    fotoModal.src = fotoPerfil.src;
    modal.style.display = "flex";
  }
});

fecharModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});