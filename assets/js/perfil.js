const inputFoto = document.getElementById('inputFoto');
const fotoPerfil = document.getElementById('fotoPerfil');

inputFoto.addEventListener('change', function(){
  if(this.files && this.files[0]){
    const reader = new FileReader();
    reader.onload = function(e){
      fotoPerfil.src = e.target.result;
    }
    reader.readAsDataURL(this.files[0]);
  }
});

const modal = document.getElementById("modalFoto");
const fotoModal = document.getElementById("fotoModal");
const fecharModal = document.getElementById("fecharModal");

// Abrir modal ao clicar na foto
fotoPerfil.addEventListener("click", () => {
    fotoModal.src = fotoPerfil.src; // usa a mesma foto do perfil
    modal.style.display = "block";
});

// Fechar modal
fecharModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Fechar clicando fora da imagem
window.addEventListener("click", (e) => {
    if(e.target === modal){
        modal.style.display = "none";
    }
});