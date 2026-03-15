// Configuración inicial
document.addEventListener('DOMContentLoaded', () => {
    console.log('Claveles del Sur - App iniciada');
    
    // Configurar select de mes con el mes actual
    const mesSelect = document.getElementById('mesSelect');
    if (mesSelect) {
        const fecha = new Date();
        const mesActualNum = fecha.getMonth() + 1;
        const añoActual = fecha.getFullYear();
        const mesFormato = `${añoActual}-${mesActualNum.toString().padStart(2, '0')}`;
        
        // Verificar si existe el mes actual en el select
        let existe = false;
        for (let i = 0; i < mesSelect.options.length; i++) {
            if (mesSelect.options[i].value === mesFormato) {
                mesSelect.selectedIndex = i;
                existe = true;
                break;
            }
        }
        
        // Si no existe, agregarlo
        if (!existe) {
            const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const option = document.createElement('option');
            option.value = mesFormato;
            option.textContent = `${nombresMeses[mesActualNum-1]} ${añoActual}`;
            mesSelect.appendChild(option);
            mesSelect.selectedIndex = mesSelect.length - 1;
        }
    }
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación si no existe
    let notificacion = document.querySelector('.notificacion');
    if (!notificacion) {
        notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        document.body.appendChild(notificacion);
        
        // Estilos para la notificación
        const style = document.createElement('style');
        style.textContent = `
            .notificacion {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            .notificacion.info { background: #3498db; }
            .notificacion.success { background: #27ae60; }
            .notificacion.warning { background: #f39c12; }
            .notificacion.error { background: #e74c3c; }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    notificacion.textContent = mensaje;
    notificacion.className = `notificacion ${tipo}`;
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}

// Función para formatear moneda
function formatearMoneda(monto, moneda = 'BOB') {
    const simbolo = moneda === 'BOB' ? 'Bs.' : '$';
    return `${simbolo} ${monto.toLocaleString()}`;
}

// Función para validar formulario de trabajo
function validarTrabajo(datos) {
    const errores = [];
    
    if (!datos.titulo || datos.titulo.trim() === '') {
        errores.push('El título es requerido');
    }
    
    if (!datos.montoTotal || datos.montoTotal <= 0) {
        errores.push('El monto total debe ser mayor a 0');
    }
    
    if (!datos.trabajadorNombre || datos.trabajadorNombre.trim() === '') {
        errores.push('El nombre del trabajador/empresa es requerido');
    }
    
    return errores;
}