/**
 * Vista Pública de Cursos
 * Custom Element: public-view
 */

import { getData, initializeData } from '../utils/dataStorage.js';

class PublicView extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        // Inicializar datos si no existen
        await initializeData();
        
        this.render();
        this.loadCourses();
        this.setupEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="public-container">
                <header class="public-header">
                    <h1>ABC Educate</h1>
                    <button class="btn btn-secondary" id="admin-login-btn">Iniciar Sesión Administrador</button>
                </header>
                <div class="hero-section">
                    <h2>Bienvenido a Nuestra Plataforma Educativa</h2>
                    <p>Explora nuestros cursos disponibles y comienza tu viaje de aprendizaje hoy mismo</p>
                </div>
                <main class="public-main">
                    <h2>Cursos Disponibles</h2>
                    <cursos-component id="cursos-component"></cursos-component>
                </main>
            </div>
        `;
    }

    loadCourses() {
        // Los cursos se cargarán automáticamente por el componente cursos-component
    }

    setupEventListeners() {
        const adminBtn = this.querySelector('#admin-login-btn');
        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                window.location.hash = '#/login';
            });
        }
    }
}

customElements.define('public-view', PublicView);
export default PublicView;
