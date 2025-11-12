/**
 * Vista de Panel de Control
 * Custom Element: dashboard-view
 */

import { getData, initializeData } from '../utils/dataStorage.js';
import { getModules } from '../utils/moduleHelpers.js';

class DashboardView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Validar token
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.hash = '#/login';
            return;
        }

        // Inicializar datos si no existen
        initializeData();

        this.render();
        this.loadStatistics();
        this.loadCourses();
        this.loadTeachers();
        this.setupEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="dashboard-container">
                <header class="dashboard-header">
                    <h1>ABC Educate - Dashboard</h1>
                    <div class="header-actions">
                        <button class="btn btn-secondary" id="admin-btn">Panel Admin</button>
                        <button class="btn btn-danger" id="logout-btn">Cerrar Sesión</button>
                    </div>
                </header>
                <main class="dashboard-main">
                    <section class="stats-section">
                        <h2>Estadísticas</h2>
                        <div class="stats-grid" id="stats-grid">
                            <!-- Stats will be loaded here -->
                        </div>
                    </section>
                    <section class="courses-section">
                        <h2>Cursos Disponibles</h2>
                        <div class="courses-grid" id="courses-grid">
                            <!-- Courses will be loaded here -->
                        </div>
                    </section>
                    <section class="teachers-section">
                        <h2>Docentes Activos</h2>
                        <div class="teachers-grid" id="teachers-grid">
                            <!-- Teachers will be loaded here -->
                        </div>
                    </section>
                </main>
            </div>
        `;
    }

    loadStatistics() {
        const appData = getData('app-data') || { docentes: [], cursos: [] };
        const cursos = appData.cursos || [];
        const docentes = appData.docentes || [];
        const modulos = getModules(cursos);
        const lecciones = modulos.reduce((total, modulo) => {
            return total + (modulo.lecciones ? modulo.lecciones.length : 0);
        }, 0);

        const statsGrid = this.querySelector('#stats-grid');
        statsGrid.innerHTML = `
            <div class="stat-card">
                <h3>Cursos</h3>
                <p class="stat-number">${cursos.length}</p>
            </div>
            <div class="stat-card">
                <h3>Módulos</h3>
                <p class="stat-number">${modulos.length}</p>
            </div>
            <div class="stat-card">
                <h3>Lecciones</h3>
                <p class="stat-number">${lecciones}</p>
            </div>
            <div class="stat-card">
                <h3>Docentes</h3>
                <p class="stat-number">${docentes.length}</p>
            </div>
        `;
    }

    loadCourses() {
        const appData = getData('app-data') || { cursos: [] };
        const cursos = appData.cursos || [];
        const coursesGrid = this.querySelector('#courses-grid');

        if (cursos.length === 0) {
            coursesGrid.innerHTML = '<p>No hay cursos disponibles</p>';
            return;
        }

        coursesGrid.innerHTML = cursos.map(curso => `
            <div class="course-card" data-course-id="${curso.id}">
                <div class="course-code">${curso.codigo}</div>
                <h3>${curso.nombre}</h3>
                <p>${curso.descripcion || 'Sin descripción'}</p>
                <a href="#/curso/${curso.id}" class="btn btn-primary">Ver Curso</a>
            </div>
        `).join('');
    }

    loadTeachers() {
        const appData = getData('app-data') || { docentes: [], cursos: [] };
        const docentes = appData.docentes || [];
        const cursos = appData.cursos || [];
        const teachersGrid = this.querySelector('#teachers-grid');

        if (docentes.length === 0) {
            teachersGrid.innerHTML = '<p>No hay docentes registrados</p>';
            return;
        }

        teachersGrid.innerHTML = docentes.map(docente => {
            const cursosAsignados = cursos.filter(c => c.docenteId === docente.id).length;
            return `
                <div class="teacher-card">
                    <img src="${docente.fotoUrl || 'https://randomuser.me/api/portraits/' + (Math.random() > 0.5 ? 'men' : 'women') + '/' + Math.floor(Math.random() * 99) + '.jpg'}" 
                         alt="${docente.nombres} ${docente.apellidos}" 
                         class="teacher-photo">
                    <div class="teacher-info">
                        <h3>${docente.nombres} ${docente.apellidos}</h3>
                        <p class="teacher-code">${docente.codigo}</p>
                        <p class="teacher-email">${docente.email}</p>
                        <p class="teacher-area">${docente.areaAcademica}</p>
                        <p class="teacher-courses">Cursos: ${cursosAsignados}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    setupEventListeners() {
        const adminBtn = this.querySelector('#admin-btn');
        const logoutBtn = this.querySelector('#logout-btn');

        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                window.location.hash = '#/admin';
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('current-user');
                window.location.hash = '#/public';
            });
        }
    }
}

customElements.define('dashboard-view', DashboardView);
export default DashboardView;

