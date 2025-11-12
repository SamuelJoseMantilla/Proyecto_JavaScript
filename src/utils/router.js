/**
 * Sistema de Enrutamiento Basado en Hash
 * Maneja la navegación y protección de rutas
 */

class Router {
    constructor() {
        this.routes = {};
    }

    handleRoute() {
        let hash = window.location.hash.slice(1);
        
        // Si no hay hash, establecer hash por defecto
        if (!hash || hash === '') {
            window.location.hash = '#/public';
            hash = 'public';
        }
        
        // Limpiar barras iniciales
        if (hash.startsWith('/')) {
            hash = hash.slice(1);
        }
        
        // Rutas protegidas
        const protectedRoutes = ['dashboard', 'admin'];
        const isProtected = protectedRoutes.some(route => hash === route || hash.startsWith(route + '/'));
        
        if (isProtected) {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.hash = '#/login';
                return 'login';
            }
        }
        
        // Rutas estáticas
        if (hash === 'login') return 'login';
        if (hash === 'dashboard') return 'dashboard';
        if (hash === 'admin') return 'admin';
        if (hash === 'public') return 'public';
        
        // Rutas dinámicas
        const cursoMatch = hash.match(/^curso\/(.+)$/);
        if (cursoMatch) {
            return { name: 'curso', id: cursoMatch[1] };
        }
        
        // Ruta por defecto
        return 'public';
    }
}

export const router = new Router();

export function renderRouter() {
    try {
        const route = router.handleRoute();
        const root = document.getElementById('root');
        
        if (!root) {
            console.error('No se encontró el elemento root');
            return;
        }
        
        root.innerHTML = '';
        
        let component;
        
        if (typeof route === 'object' && route.name === 'curso') {
            component = document.createElement('curso-view');
            component.setAttribute('curso-id', route.id);
        } else {
            switch (route) {
                case 'login':
                    component = document.createElement('login-view');
                    break;
                case 'dashboard':
                    component = document.createElement('dashboard-view');
                    break;
                case 'admin':
                    component = document.createElement('admin-view');
                    break;
                case 'public':
                default:
                    component = document.createElement('public-view');
                    break;
            }
        }
        
        if (component) {
            root.appendChild(component);
        } else {
            console.error('No se pudo crear el componente para la ruta:', route);
            root.innerHTML = '<div style="padding: 20px;"><h1>Error</h1><p>No se pudo cargar la vista.</p></div>';
        }
    } catch (error) {
        console.error('Error en renderRouter:', error);
        const root = document.getElementById('root');
        if (root) {
            root.innerHTML = '<div style="padding: 20px;"><h1>Error</h1><p>' + error.message + '</p></div>';
        }
    }
}

