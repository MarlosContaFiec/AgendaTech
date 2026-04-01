<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();
?>
    
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>AgendaTech</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- Fontes do Google  -->
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">

    
        <link rel="stylesheet" href="./assets/css/style.css">
    </head>
    <body>
    <header>
   <div class="logo">
    <div class="logo-circle">
        <img src="assets/img/logo.png" alt="Logo AgendaTech" class="logo-img">
    </div> 
    <h2>AgendaTech</h2>
</div>
        <nav id="nav">
            <a href="#home">Home</a>
            <a href="#sobre">Sobre</a>
            <a href="#recursos">Recursos</a>
            <a href="#contato">Contato</a>
            <a href="./pages/identificador.php" class="btn-login">Cadastre-se</a>
        </nav>

        <!-- Botão Hamburguer -->
        <div class="hamburguer" id="hamburguer">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </header>

    <!-- HERO -->
    <section class="hero" id="home">
        <div class="hero-text">
            <h1>Organize seus agendamentos com mais eficiência</h1>
            <p>
                A AgendaTech é um sistema de agendamento inteligente que permite visualizar horários disponíveis, 
                realizar marcações e enviar confirmações e lembretes automáticos.

            </p>
            <a href="#" class="btn-primary">Começar Agora</a>
        </div>

        <div class="hero-image">
            <div class="image-placeholder">
               <img src="/assets/img/folha-rosto.webp" alt="">
            </div>
        </div>
    </section>

    <!-- SOBRE -->
    <section class="sobre" id="sobre">
        <h2>Sobre a AgendaTech</h2>
        <p>
          A agendaTech é uma plataforma que permite a visualização de horários disponíveis, 
          realização de marcações e envio automático de confirmações e lembretes, buscando tornar o processo de agendamento mais prático, 
          ágil e confiável, proporcionando uma maior comodidade aos clientes, eficiência na gestão de agenda para os prestadores e um aumento da competitividade para os negócios.
        </p>
    </section>

    <!-- RECURSOS -->
    <section class="recursos" id="recursos">
        <h2>Nossos Recursos</h2>
        <div class="cards">
            <div class="card">
                <h3>Gestão de Horários</h3>
                <p>Controle completo de agendamentos e disponibilidade.</p>
            </div>

            <div class="card">
                <h3>Cadastro de Clientes</h3>
                <p>Organize informações e histórico de atendimentos.</p>
            </div>

            <div class="card">
                <h3>Relatórios Inteligentes</h3>
                <p>Visualize dados importantes para tomada de decisões.</p>
            </div>
        </div>
    </section>

    <!-- CONTATO -->
    <section class="contato" id="contato">
        <h2>Contato</h2>
        <p>Email: contato@agendatech.com</p>
        <p>Telefone: (19) 3899-4521</p>
        <p>Endereço: Indaiatuba - Brasil</p>
        <p>Instagram: @agendatech_tech </p>

        <div class="social-icons">
    </section>

    <!-- FOOTER -->
    <footer>
        <p>© 2026 AgendaTech - Todos os direitos reservados</p>
    </footer>

    <!-- SCRIPT MENU -->
    <script src="assets/js/page.js"></script>

    </body>
    </html>