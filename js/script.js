function switchTab(event, tabId) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));

    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active-content'));

    event.currentTarget.classList.add('active');
    document.getElementById(tabId).classList.add('active-content');
}

function limpiarFormulario(formId, resultId) {
    document.getElementById(formId).reset();
    const resultBox = document.getElementById(resultId);
    resultBox.classList.add('hidden');
    resultBox.className = 'result-box';
    resultBox.innerHTML = '';
}

function calcularCarburante(event) {
    event.preventDefault();

    const reservaInicial = parseFloat(document.getElementById('carb-inicial').value);
    const consumoDiario = parseFloat(document.getElementById('carb-consumo').value);
    const reabastecimientoDiario = parseFloat(document.getElementById('carb-reabastecimiento').value);
    const nivelCritico = parseFloat(document.getElementById('carb-critico').value);

    const resultBox = document.getElementById('res-carburante');
    resultBox.classList.remove('hidden');
    resultBox.className = 'result-box';

    const desbalanceDiario = consumoDiario - reabastecimientoDiario;

    if (desbalanceDiario <= 0) {
        resultBox.classList.add('status-normal');
        resultBox.innerHTML = `
            <h4><span class="badge badge-normal">Estable</span> Simulación de Sostenibilidad</h4>
            <p>El volumen de reabastecimiento diario (<strong>${reabastecimientoDiario} L</strong>) cubre o supera el consumo demandado (<strong>${consumoDiario} L</strong>).</p>
            <p><strong>Resultado:</strong> Las reservas de carburante son estables y se mantendrán de forma indefinida bajo estas condiciones operativas.</p>
        `;
        return;
    }

    let diasCritico = (reservaInicial - nivelCritico) / desbalanceDiario;
    let diasAgotamientoTotal = reservaInicial / desbalanceDiario;

    diasCritico = diasCritico < 0 ? 0 : Math.floor(diasCritico);
    diasAgotamientoTotal = Math.floor(diasAgotamientoTotal);

    if (diasCritico <= 3) {
        resultBox.classList.add('status-critico');
    } else if (diasCritico <= 10) {
        resultBox.classList.add('status-alerta');
    } else {
        resultBox.classList.add('status-normal');
    }

    resultBox.innerHTML = `
        <h4>Análisis de Logística de Abastecimiento</h4>
        <ul>
            <li><strong>Balance Neto Diario:</strong> -${desbalanceDiario.toFixed(2)} litros/día.</li>
            <li><strong>Días para alcanzar nivel crítico (${nivelCritico} L):</strong> ${diasCritico} días.</li>
            <li><strong>Días para el desabastecimiento total:</strong> ${diasAgotamientoTotal} días.</li>
        </ul>
        <div class="expected" style="margin-top:15px;">
            <strong>Mensaje de Control:</strong> ${diasCritico <= 3 ? 
            '<span class="badge badge-critico">Alerta Crítica</span> Acción inmediata requerida. El inventario entra en zona de desabastecimiento severo en menos de 72 horas.' : 
            '<span class="badge badge-alerta">Advertencia</span> El consumo supera los ingresos de almacén de carburante. Programar reabastecimientos preventivos.'}
        </div>
    `;
}

function calcularAlimentos(event) {
    event.preventDefault();

    const producto = document.getElementById('alim-producto').value;
    const precioAnterior = parseFloat(document.getElementById('alim-anterior').value);
    const precioActual = parseFloat(document.getElementById('alim-actual').value);
    const cantidadSemanal = parseFloat(document.getElementById('alim-cantidad').value);
    const semanas = parseInt(document.getElementById('alim-semanas').value);

    const resultBox = document.getElementById('res-alimentos');
    resultBox.classList.remove('hidden');
    resultBox.className = 'result-box';

    const incrementoPrecio = precioActual - precioAnterior;
    const porcentajeAumento = ((precioActual - precioAnterior) / precioAnterior) * 100;
    
    const gastoSemanalAnterior = precioAnterior * cantidadSemanal;
    const gastoSemanalActual = precioActual * cantidadSemanal;
    
    const gastoTotalAnterior = gastoSemanalAnterior * semanas;
    const gastoTotalActual = gastoSemanalActual * semanas;
    const diferenciaGastoTotal = gastoTotalActual - gastoTotalAnterior;

    if (porcentajeAumento > 25) {
        resultBox.classList.add('status-critico');
    } else if (porcentajeAumento > 5) {
        resultBox.classList.add('status-alerta');
    } else {
        resultBox.classList.add('status-normal');
    }

    resultBox.innerHTML = `
        <h4>Impacto Presupuestario para el Producto: ${producto}</h4>
        <table class="data-table">
            <thead>
                <tr><th>Métrica Calculada</th><th>Antes</th><th>Ahora</th><th>Impacto / Variación</th></tr>
            </thead>
            <tbody>
                <tr><td>Precio Unitario</td><td>${precioAnterior.toFixed(2)} Bs</td><td>${precioActual.toFixed(2)} Bs</td><td>+${incrementoPrecio.toFixed(2)} Bs</td></tr>
                <tr><td>Gasto Semanal</td><td>${gastoSemanalAnterior.toFixed(2)} Bs</td><td>${gastoSemanalActual.toFixed(2)} Bs</td><td>+ ${(gastoSemanalActual - gastoSemanalAnterior).toFixed(2)} Bs</td></tr>
                <tr><td>Gasto en Periodo (${semanas} sem)</td><td><strong>${gastoTotalAnterior.toFixed(2)} Bs</strong></td><td><strong>${gastoTotalActual.toFixed(2)} Bs</strong></td><td><strong>+${diferenciaGastoTotal.toFixed(2)} Bs</strong></td></tr>
            </tbody>
        </table>
        <p class="expected"><strong>Tasa Inflacionaria Registrada:</strong> El insumo básico sufrió un incremento nominal del <strong>${porcentajeAumento.toFixed(2)}%</strong> sobre su costo base.</p>
    `;
}

function calcularTransporte(event) {
    event.preventDefault();

    const distNormal = parseFloat(document.getElementById('trans-dist-normal').value);
    const distDesvio = parseFloat(document.getElementById('trans-dist-desvio').value);
    const costoKm = parseFloat(document.getElementById('trans-costo-km').value);
    const viajesSemana = parseInt(document.getElementById('trans-viajes').value);

    const resultBox = document.getElementById('res-transporte');
    resultBox.classList.remove('hidden');
    resultBox.className = 'result-box';

    if (distDesvio < distNormal) {
        resultBox.classList.add('status-critico');
        resultBox.innerHTML = `<h4>Error de Consistencia</h4><p>La distancia con desvío o ruta alternativa no puede ser menor a la distancia lineal de transporte habitual.</p>`;
        return;
    }

    const costoViajeNormal = distNormal * costoKm;
    const costoViajeDesvio = distDesvio * costoKm;
    
    const gastoSemanalNormal = costoViajeNormal * viajesSemana;
    const gastoSemanalDesvio = costoViajeDesvio * viajesSemana;
    
    const sobrecostoSemanal = gastoSemanalDesvio - gastoSemanalNormal;
    const sobrecostoMensualEstimado = sobrecostoSemanal * 4.33;

    if (sobrecostoSemanal > 50) {
        resultBox.classList.add('status-critico');
    } else {
        resultBox.classList.add('status-alerta');
    }

    resultBox.innerHTML = `
        <h4>Proyección de Costos Operativos por Desvíos de Ruta</h4>
        <ul>
            <li><strong>Costo Base por Viaje Normal:</strong> ${costoViajeNormal.toFixed(2)} Bs</li>
            <li><strong>Costo Incrementado por Viaje con Desvío:</strong> ${costoViajeDesvio.toFixed(2)} Bs</li>
            <li><strong>Gasto Adicional Semanal:</strong> <span style="color:var(--color-critico); font-weight:bold;">+${sobrecostoSemanal.toFixed(2)} Bs</span></li>
            <li><strong>Gasto Adicional Mensual Estimado:</strong> +${sobrecostoMensualEstimado.toFixed(2)} Bs</li>
        </ul>
        <div class="expected">
            <strong>Impacto Logístico:</strong> La presencia de bloqueos o desvíos obliga a una ampliación de ruta de <strong>${(distDesvio - distNormal).toFixed(2)} km</strong> por trayecto, incrementando el presupuesto asignado a transporte en un <strong>${((costoViajeDesvio - costoViajeNormal)/costoViajeNormal * 100).toFixed(1)}%</strong>.
        </div>
    `;
}

function calcularAdquisitivo(event) {
    event.preventDefault();

    const ingreso = parseFloat(document.getElementById('adq-ingreso').value);
    const gastoAnterior = parseFloat(document.getElementById('adq-gasto-anterior').value);
    const gastoActual = parseFloat(document.getElementById('adq-gasto-actual').value);

    const resultBox = document.getElementById('res-adquisitivo');
    resultBox.classList.remove('hidden');
    resultBox.className = 'result-box';

    const aumentoGasto = gastoActual - gastoAnterior;
    const saldoAnterior = ingreso - gastoAnterior;
    const saldoActual = ingreso - gastoActual;
    
    const perdidaPoderAdquisitivo = ((gastoActual - gastoAnterior) / gastoAnterior) * 100;

    let nivelAfectacion = "";
    if (saldoActual < 0) {
        nivelAfectacion = "CRÍTICO (Déficit Presupuestario / Endeudamiento)";
        resultBox.classList.add('status-critico');
    } else if (saldoActual < (ingreso * 0.1)) {
        nivelAfectacion = "ALTO (Capacidad de ahorro casi nula)";
        resultBox.classList.add('status-alerta');
    } else {
        nivelAfectacion = "MODERADO (Contracción del excedente de capital)";
        resultBox.classList.add('status-normal');
    }

    resultBox.innerHTML = `
        <h4>Estudio Macroeconómico del Presupuesto Familiar</h4>
        <ul>
            <li><strong>Incremento Neto del Costo de Vida:</strong> +${aumentoGasto.toFixed(2)} Bs</li>
            <li><strong>Tasa de Inflación Presupuestaria Interna:</strong> ${perdidaPoderAdquisitivo.toFixed(2)}%</li>
            <li><strong>Excedente / Ahorro de Capital Anterior:</strong> ${saldoAnterior.toFixed(2)} Bs</li>
            <li><strong>Excedente / Ahorro de Capital Remanente Actual:</strong> ${saldoActual.toFixed(2)} Bs</li>
            <li><strong>Nivel de Afectación Determinado:</strong> <strong>${nivelAfectacion}</strong></li>
        </ul>
        <p class="expected" style="margin-top:10px;">
            <strong>Conclusión del Modelo:</strong> Con el mismo nivel de ingresos nominales, la familia debe destinar un <strong>${((gastoActual - gastoAnterior) / ingreso * 100).toFixed(1)}%</strong> adicional de todo su sueldo para adquirir exactamente el mismo volumen de bienes básicos que antes del periodo de crisis.
        </p>
    `;
}