# Public onde deve ficar todo o front 
   
   ## Pages
    ✔ Pode:

        mostrar formulário
        mostrar erro
        mostrar dados já prontos

    ❌ NÃO pode:

        SQL
        validação pesada
        lógica de negócio
   ## Api
    ✔ Pode:

        receber POST/GET
        chamar Service
        devolver JSON ou redirect

    ❌ NÃO pode:

        HTML
        CSS
        echo de layout

# Src onde Fica nosso recusso backend Serfiços de apis e nosso modais de PDO
   
   ## Services
    ✔ Onde fica:

        regra de negócio
        validação
        chamadas de Model

   ## Models
    ✔ Onde fica:

        SQL
        PDO
        acesso a dados puro