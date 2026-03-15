// Variable global para el mes actual
let mesActual = '2026-03';
let filtroColorActual = 'todos';
let todosLosTrabajos = [];

// Función para formatear fecha
function formatearFecha(timestamp) {
    if (!timestamp) return 'No definida';
    const fecha = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return fecha.toLocaleDateString('es-ES');
}

// Función para obtener emoji según color
function getEmojiPorColor(color) {
    const emojis = {
        'rojo': '🔴',
        'naranja': '🟠',
        'violeta': '🟣',
        'verde': '✅'
    };
    return emojis[color] || '⚪';
}

// Función para renderizar documentos
function renderizarDocumentos(documentos, trabajoId) {
    if (!documentos) return '<p class="no-docs">Sin documentos</p>';
    
    let html = '<div class="documentos-grid">';
    let totalDocs = 0;
    
    // Definir los tipos de documentos y sus íconos
    const tiposDocs = [
        { key: 'cotizaciones', nombre: 'Cotización', icono: 'fa-file-pdf' },
        { key: 'comprobantesAdelanto', nombre: 'Comp. Adelanto', icono: 'fa-file-image' },
        { key: 'recibosAdelanto', nombre: 'Recibo Adelanto', icono: 'fa-file-alt' },
        { key: 'informesTrabajo', nombre: 'Informe', icono: 'fa-file-pdf' },
        { key: 'comprobantesFinales', nombre: 'Comp. Final', icono: 'fa-file-image' },
        { key: 'recibosFinales', nombre: 'Recibo Final', icono: 'fa-file-alt' },
        { key: 'caratulas', nombre: 'Carátula', icono: 'fa-file-pdf' }
    ];
    
    tiposDocs.forEach(tipo => {
        if (documentos[tipo.key] && documentos[tipo.key].length > 0) {
            documentos[tipo.key].forEach((url, index) => {
                totalDocs++;
                html += `
                    <a href="${url}" target="_blank" class="documento-item" title="${tipo.nombre}">
                        <i class="fas ${tipo.icono}"></i>
                        <span>${tipo.nombre} ${documentos[tipo.key].length > 1 ? (index + 1) : ''}</span>
                    </a>
                `;
            });
        }
    });
    
    if (totalDocs === 0) {
        html += '<p class="no-docs">Sin documentos</p>';
    }
    
    html += '</div>';
    return html;
}

// Función para renderizar trabajos
function renderizarTrabajos(trabajos) {
    const contenedor = document.getElementById('trabajosList');
    
    if (!trabajos || trabajos.length === 0) {
        contenedor.innerHTML = '<div class="no-trabajos">No hay trabajos para mostrar</div>';
        return;
    }
    
    let html = '';
    trabajos.forEach(trabajo => {
        // Calcular montos
        const montoAdelantado = trabajo.montoAdelantado || 0;
        const montoPendiente = trabajo.montoPendiente || trabajo.montoTotal;
        
        html += `
            <div class="trabajo-card ${trabajo.color}" data-id="${trabajo.id}">
                <div class="trabajo-header">
                    <span class="trabajo-titulo">${trabajo.titulo}</span>
                    <span class="trabajo-estado">${getEmojiPorColor(trabajo.color)}</span>
                </div>
                
                <div class="trabajo-info">
                    <div class="info-item">
                        <i class="fas fa-building"></i>
                        <span><strong>Empresa:</strong> ${trabajo.trabajadorNombre || 'No asignado'}</span>
                    </div>
                    
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span><strong>Inicio:</strong> ${formatearFecha(trabajo.fechaInicio || trabajo.fechaCreacion)}</span>
                    </div>
                    
                    ${trabajo.fechaLimite ? `
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span><strong>Límite:</strong> ${formatearFecha(trabajo.fechaLimite)}</span>
                        </div>
                    ` : ''}
                    
                    <div class="info-item">
                        <i class="fas fa-money-bill"></i>
                        <span>
                            <strong>Total:</strong> 
                            <span class="monto-total">Bs. ${trabajo.montoTotal.toLocaleString()}</span>
                        </span>
                    </div>
                    
                    ${montoPendiente > 0 ? `
                        <div class="info-item">
                            <i class="fas fa-exclamation-circle"></i>
                            <span>
                                <strong>Pendiente:</strong> 
                                <span class="monto-pendiente">Bs. ${montoPendiente.toLocaleString()}</span>
                            </span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="documentos-section">
                    <h4 onclick="toggleDocumentos('${trabajo.id}')">
                        <i class="fas fa-chevron-right" id="icon-${trabajo.id}"></i>
                        Documentos (${contarDocumentos(trabajo.documentos)})
                    </h4>
                    <div id="docs-${trabajo.id}" class="documentos-grid" style="display: none;">
                        ${renderizarDocumentos(trabajo.documentos, trabajo.id)}
                    </div>
                </div>
                
                <div class="trabajo-acciones">
                    <button class="btn btn-primary" onclick="verTrabajo('${trabajo.id}')">
                        <i class="fas fa-eye"></i> Ver detalles
                    </button>
                    
                    ${trabajo.color !== 'verde' ? `
                        <button class="btn btn-success" onclick="completarTrabajo('${trabajo.id}')">
                            <i class="fas fa-check"></i> Completar
                        </button>
                    ` : ''}
                    
                    <button class="btn btn-historial" onclick="moverAHistorial('${trabajo.id}')">
                        <i class="fas fa-archive"></i> Mover a historial
                    </button>
                    
                    <button class="btn btn-warning" onclick="editarTrabajo('${trabajo.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
}

// Función para contar documentos
function contarDocumentos(documentos) {
    if (!documentos) return 0;
    let total = 0;
    Object.values(documentos).forEach(arr => {
        if (Array.isArray(arr)) total += arr.length;
    });
    return total;
}

// Función para mostrar/ocultar documentos
function toggleDocumentos(trabajoId) {
    const docsDiv = document.getElementById(`docs-${trabajoId}`);
    const icon = document.getElementById(`icon-${trabajoId}`);
    
    if (docsDiv.style.display === 'none') {
        docsDiv.style.display = 'flex';
        icon.classList.add('rotado');
    } else {
        docsDiv.style.display = 'none';
        icon.classList.remove('rotado');
    }
}

// Función para cargar trabajos
async function cargarTrabajos() {
    try {
        document.getElementById('trabajosList').innerHTML = '<div class="loading">Cargando trabajos...</div>';
        
        const trabajosRef = db.collection('trabajos');
        let query = trabajosRef.where('mes', '==', mesActual);
        
        // Si no estamos en historial, solo mostrar no históricos
        if (!window.location.href.includes('historial.html')) {
            query = query.where('historial', '==', false);
        }
        
        const snapshot = await query.get();
        
        todosLosTrabajos = [];
        snapshot.forEach(doc => {
            todosLosTrabajos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Actualizar contadores
        actualizarContadores(todosLosTrabajos);
        
        // Aplicar filtro actual
        aplicarFiltro();
        
    } catch (error) {
        console.error('Error al cargar trabajos:', error);
        document.getElementById('trabajosList').innerHTML = '<div class="no-trabajos">Error al cargar los trabajos</div>';
    }
}

// Función para actualizar contadores
function actualizarContadores(trabajos) {
    const counts = {
        rojo: 0,
        naranja: 0,
        violeta: 0,
        verde: 0
    };
    
    trabajos.forEach(trabajo => {
        if (counts.hasOwnProperty(trabajo.color)) {
            counts[trabajo.color]++;
        }
    });
    
    document.getElementById('countRojo').textContent = counts.rojo;
    document.getElementById('countNaranja').textContent = counts.naranja;
    document.getElementById('countVioleta').textContent = counts.violeta;
    document.getElementById('countVerde').textContent = counts.verde;
}

// Función para aplicar filtro
function aplicarFiltro() {
    let trabajosFiltrados = todosLosTrabajos;
    
    if (filtroColorActual !== 'todos') {
        trabajosFiltrados = todosLosTrabajos.filter(t => t.color === filtroColorActual);
    }
    
    renderizarTrabajos(trabajosFiltrados);
    
    // Actualizar botones de filtro
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.remove('activo');
    });
    
    if (filtroColorActual === 'todos') {
        document.querySelector('.filtro-btn:first-child').classList.add('activo');
    } else {
        const btn = Array.from(document.querySelectorAll('.filtro-btn')).find(
            btn => btn.textContent.includes(filtroColorActual)
        );
        if (btn) btn.classList.add('activo');
    }
}

// Funciones de filtrado (se llaman desde HTML)
function mostrarTodos() {
    filtroColorActual = 'todos';
    aplicarFiltro();
}

function filtrarPorColor(color) {
    filtroColorActual = color;
    aplicarFiltro();
}

// Función para cambiar mes
function cambiarMes() {
    const select = document.getElementById('mesSelect');
    mesActual = select.value;
    
    // Actualizar badge de mes
    const badge = document.getElementById('mesActual');
    if (badge) {
        const mesNombre = select.options[select.selectedIndex].text;
        badge.textContent = mesNombre;
    }
    
    cargarTrabajos();
}

// Funciones de acciones
function verTrabajo(id) {
    window.location.href = `ver-trabajo.html?id=${id}`;
}

function editarTrabajo(id) {
    window.location.href = `nuevo-trabajo.html?id=${id}`;
}

async function completarTrabajo(id) {
    if (!confirm('¿Estás seguro de marcar este trabajo como completado?')) return;
    
    try {
        await db.collection('trabajos').doc(id).update({
            color: 'verde',
            estado: 'completado',
            fechaFinalizacion: new Date()
        });
        
        cargarTrabajos();
    } catch (error) {
        console.error('Error al completar trabajo:', error);
        alert('Error al completar el trabajo');
    }
}

async function moverAHistorial(id) {
    if (!confirm('¿Mover este trabajo al historial?')) return;
    
    try {
        await db.collection('trabajos').doc(id).update({
            historial: true
        });
        
        cargarTrabajos();
    } catch (error) {
        console.error('Error al mover a historial:', error);
        alert('Error al mover a historial');
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    cargarTrabajos();
});