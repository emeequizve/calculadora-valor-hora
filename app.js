/* ========== UTILIDADES ========== */
function formatMoney(number) {
    return '$' + Math.round(number).toLocaleString('es-CL');
}

/* ========== LÓGICA DE CÁLCULO ==========
   Fórmula legal chilena:
   Horas mensuales = Horas semanales × 30 ÷ 7
   (el mes se considera de 30 días, no el promedio anual 52/12)
*/
function calcularValorHora(salario, horasSemanales) {
    const diasPorMes = 30;
    const diasPorSemana = 7;
    const horasMensuales = horasSemanales * diasPorMes / diasPorSemana;
    const valorHora = salario / horasMensuales;

    return {
        valorHora: valorHora,
        horaExtra50: valorHora * 1.5,
        horaExtra100: valorHora * 2,
        horasMensuales: horasMensuales
    };
}

/* ========== VALIDACIÓN ========== */
function validarInput(inputId, errorId, condicion, mensaje) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (!condicion(input.value)) {
        input.classList.add('error');
        error.textContent = mensaje;
        error.classList.add('visible');
        return false;
    }

    input.classList.remove('error');
    error.classList.remove('visible');
    return true;
}

function limpiarErrores() {
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));
}

/* ========== RENDERIZAR RESULTADOS ========== */
function mostrarResultados(datos, horasExtras) {
    const contenedor = document.getElementById('resultados');

    let htmlExtras = '';
    if (horasExtras > 0) {
        htmlExtras = `
            <div class="divider"></div>
            <div class="section-title">Total por ${horasExtras} horas extras mensuales</div>
            <div class="results-grid">
                <div class="result-card">
                    <div class="result-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                            <polyline points="17 6 23 6 23 12"/>
                        </svg>
                        Total al 50%
                    </div>
                    <div class="result-value small accent">${formatMoney(datos.horaExtra50 * horasExtras)}</div>
                </div>
                <div class="result-card">
                    <div class="result-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                            <polyline points="17 6 23 6 23 12"/>
                        </svg>
                        Total al 100%
                    </div>
                    <div class="result-value small accent">${formatMoney(datos.horaExtra100 * horasExtras)}</div>
                </div>
            </div>
        `;
    }

    contenedor.innerHTML = `
        <div class="section-title">Valores base</div>
        <div class="result-card highlight">
            <div class="result-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                </svg>
                Valor hora normal
            </div>
            <div class="result-value">${formatMoney(datos.valorHora)}</div>
        </div>

        <div class="results-grid">
            <div class="result-card">
                <div class="result-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2v20M2 12h20"/>
                    </svg>
                    Hora extra 50%
                </div>
                <div class="result-value small">${formatMoney(datos.horaExtra50)}</div>
            </div>
            <div class="result-card">
                <div class="result-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2v20M2 12h20"/>
                    </svg>
                    Hora extra 100%
                </div>
                <div class="result-value small">${formatMoney(datos.horaExtra100)}</div>
            </div>
        </div>
        ${htmlExtras}
    `;

    contenedor.classList.add('visible');

    setTimeout(() => {
        contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/* ========== EVENT LISTENERS ========== */
document.getElementById('calcForm').addEventListener('submit', function(e) {
    e.preventDefault();
    limpiarErrores();

    const salario = parseFloat(document.getElementById('salario').value);
    const horasSemanales = parseFloat(document.getElementById('horasSemanales').value);
    const horasExtras = parseFloat(document.getElementById('horasExtras').value) || 0;

    let valido = true;

    valido = validarInput('salario', 'error-salario', 
        v => v && parseFloat(v) > 0, 
        'Ingresa un salario mayor a 0') && valido;

    valido = validarInput('horasSemanales', 'error-horas', 
        v => v && parseFloat(v) > 0 && parseFloat(v) <= 168, 
        'Ingresa entre 1 y 168 horas semanales') && valido;

    if (!valido) return;

    const resultados = calcularValorHora(salario, horasSemanales);
    mostrarResultados(resultados, horasExtras);
});

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('error');
        const errorId = 'error-' + this.id;
        const errorEl = document.getElementById(errorId);
        if (errorEl) errorEl.classList.remove('visible');
    });
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}
