```php
<div
    id="modalReserva"
    class="modal-overlay"
>

    <div class="modal">

        <div class="modal-header">

            <h2>
                Fazer Reserva
            </h2>

        </div>

        <div class="modal-body">

            <label>Data</label>

            <input
                type="date"
                class="input"
                id="reservaData"
            >

            <br><br>

            <label>Horário</label>

            <input
                type="time"
                class="input"
                id="reservaHorario"
            >

        </div>

        <div class="modal-footer">

            <button
                class="btn-ghost"
                onclick="fecharModalReserva()"
            >
                Cancelar
            </button>

            <button
                class="btn-primary"
                id="btnSalvarReserva"
            >
                Reservar
            </button>

        </div>

    </div>

</div>
```
