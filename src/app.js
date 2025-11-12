/**
 * Inicialización de la Aplicación
 * Configura el router y renderiza la vista inicial
 */

import { renderRouter } from './utils/router.js';
import { initializeData } from './utils/dataStorage.js';

// Inicializar datos si no existen
const initApp = async () => {
    try {
        await initializeData();
        
        // Escuchar cambios de hash primero
        window.addEventListener('hashchange', () => {
            renderRouter();
        });
        
        // Asegurar que hay un hash por defecto
        if (!window.location.hash || window.location.hash === '#' || window.location.hash === '') {
            window.location.hash = '#/public';
        } else {
            // Si ya hay hash, renderizar directamente
            setTimeout(() => {
                renderRouter();
            }, 100);
        }
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        const root = document.getElementById('root');
        if (root) {
            root.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Error al cargar la aplicación</h1><p>Por favor, recarga la página.</p><pre>' + error.message + '</pre></div>';
        }
    }
};

// Esperar a que el DOM esté listo y que los módulos se carguen
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Esperar un momento adicional para que los imports se resuelvan
        setTimeout(initApp, 50);
    });
} else {
    setTimeout(initApp, 50);
}

// Exportar función para re-renderizado manual
export { renderRouter };
