<?php
require_once __DIR__ . '/../../src/Controllers/controllerPageCliente.php';
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/page_cliente.css">
    <title>AgendaTech</title>
</head>

<body>

    <header>

        <div class="logo">
            AgendaTech
        </div>

        <div class="search-bar">

            <input type="text" placeholder="Buscar serviços...">

            <div class="filters">
                <button>Categoria</button>
                <button>Cidade</button>
                <button>Extras</button>
            </div>

        </div>

        <div class="profile">

            <img src="https://i.pravatar.cc/40" id="fotoCliente">
            <span><?php echo $usuario['nome'] ?></span>
            <a href="../pages/perfil.php">Configurações</a>

        </div>

    </header>

    <div class="container">

        <main>

            <div class="card">

                <h3>Barbearia do Carlos</h3>

                <p>São Paulo</p>

                <div class="horarios">

                    <button>09:00 - 10:00</button>
                    <button>14:00 - 15:00</button>
                    <button>15:00 - 16:00</button>

                </div>

            </div>

            <div class="card">

                <h3>Salão Beauty Hair</h3>

                <p>Campinas</p>

                <div class="horarios">

                    <button>10:00 - 11:00</button>
                    <button>13:00 - 14:00</button>

                </div>

            </div>

        </main>

        <div class="sidebar">

            <ul>

                <li>Histórico</li>
                <li>Serviços</li>
                <li>Configurações</li>
                <li>Sair</li>

            </ul>

        </div>

    </div>

</body>

</html>