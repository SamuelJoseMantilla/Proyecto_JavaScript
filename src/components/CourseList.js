/**
 * Componente de Lista de Cursos
 * Custom Element: cursos-component
 */

import { getData } from '../utils/dataStorage.js';

class CourseListComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.loadCourses();
    }

    loadCourses() {
        const appData = getData('app-data');
        if (!appData) {
            this.innerHTML = '<p>No hay cursos disponibles</p>';
            return;
        }

        const cursos = appData.cursos || [];
        const docentes = appData.docentes || [];
        
        if (cursos.length === 0) {
            this.innerHTML = '<p>No hay cursos disponibles</p>';
            return;
        }

        // Calcular estadísticas de cada curso
        const cursosConStats = cursos.map(curso => {
            const docente = docentes.find(d => d.id === curso.docenteId);
            const totalModulos = curso.modulos?.length || 0;
            const totalLecciones = curso.modulos?.reduce((acc, mod) => acc + (mod.lecciones?.length || 0), 0) || 0;
            const totalHoras = curso.modulos?.reduce((acc, mod) => {
                return acc + (mod.lecciones?.reduce((sum, lec) => sum + (lec.intensidadHoraria || 0), 0) || 0);
            }, 0) || 0;
            
            return {
                ...curso,
                docente,
                totalModulos,
                totalLecciones,
                totalHoras
            };
        });

        this.innerHTML = `
            <div class="cursos-grid">
                ${cursosConStats.map(curso => {
                    const docenteNombre = curso.docente ? `${curso.docente.nombres} ${curso.docente.apellidos}` : 'Sin instructor';
                    const docenteFoto = curso.docente?.fotoUrl || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`;
                    
                    return `
                    <div class="curso-card" data-curso-id="${curso.id}">
                        <div class="curso-card-image">
                            <div class="curso-image-placeholder">
                                <span class="curso-code-badge">${curso.codigo}</span>
                            </div>
                        </div>
                        <div class="curso-card-content">
                            <h3 class="curso-title">${curso.nombre}</h3>
                            <p class="curso-description">${curso.descripcion || 'Sin descripción'}</p>
                            <div class="curso-instructor">
                                <img src="${docenteFoto}" 
                                     alt="${docenteNombre}" 
                                     class="instructor-avatar"
                                     onerror="this.src='https://randomuser.me/api/portraits/men/32.jpg'">
                                <span class="instructor-name">${docenteNombre}</span>
                            </div>
                            <div class="curso-stats">
                                <span class="stat-item">
                                    <span class="stat-value">${curso.totalModulos} módulos</span>
                                </span>
                                <span class="stat-item">
                                    <span class="stat-value">${curso.totalLecciones} lecciones</span>
                                </span>
                                <span class="stat-item">
                                    <span class="stat-value">${curso.totalHoras}h</span>
                                </span>
                            </div>
                            <a href="#/curso/${curso.id}" class="btn btn-primary curso-btn">Ver Curso</a>
                        </div>
                    </div>
                `;
                }).join('')}
            </div>
        `;
    }
}

customElements.define('cursos-component', CourseListComponent);
export default CourseListComponent;

