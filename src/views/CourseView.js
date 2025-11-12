/**
 * Vista de Detalle de Curso
 * Custom Element: curso-view
 */

import { getData } from '../utils/dataStorage.js';

class CourseView extends HTMLElement {
    constructor() {
        super();
        this.cursoId = null;
    }

    connectedCallback() {
        // Extraer ID del curso desde el atributo o hash
        this.cursoId = this.getAttribute('curso-id') || this.extractIdFromHash();
        
        if (!this.cursoId) {
            this.renderError('Curso no encontrado');
            return;
        }

        this.render();
        this.loadCurso();
    }

    extractIdFromHash() {
        const hash = window.location.hash;
        const match = hash.match(/\/curso\/(.+)$/);
        return match ? match[1] : null;
    }

    render() {
        this.innerHTML = `
            <div class="curso-container">
                <header class="curso-header">
                    <button class="btn btn-secondary" id="back-btn">← Volver a Cursos</button>
                </header>
                <main class="curso-main">
                    <div id="curso-content">
                        <!-- Contenido del curso se cargará aquí -->
                    </div>
                </main>
            </div>
        `;
    }

    renderError(message) {
        this.innerHTML = `
            <div class="error-container">
                <h2>${message}</h2>
                <a href="#/public" class="btn btn-primary">Volver a Cursos</a>
            </div>
        `;
    }

    loadCurso() {
        const appData = getData('app-data');
        if (!appData) {
            this.renderError('Error al cargar los datos');
            return;
        }

        const curso = appData.cursos.find(c => c.id === this.cursoId);
        if (!curso) {
            this.renderError('Curso no encontrado');
            return;
        }

        const docente = appData.docentes.find(d => d.id === curso.docenteId);
        const docenteNombre = docente 
            ? `${docente.nombres} ${docente.apellidos}` 
            : 'Sin docente asignado';
        const docenteFoto = docente?.fotoUrl || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`;
        const docenteArea = docente?.areaAcademica || '';

        const content = this.querySelector('#curso-content');
        content.innerHTML = `
            <div class="curso-info">
                <span class="curso-badge">${curso.codigo}</span>
                <h1>${curso.nombre}</h1>
                <p class="curso-description">${curso.descripcion || 'Sin descripción'}</p>
                <div class="curso-teacher">
                    <div class="teacher-avatar-wrapper">
                        <img src="${docenteFoto}" 
                             alt="${docenteNombre}" 
                             class="teacher-avatar"
                             onerror="this.src='https://randomuser.me/api/portraits/men/32.jpg'">
                    </div>
                    <div class="teacher-details">
                        <p class="teacher-label">Instructor</p>
                        <h3 class="teacher-name">${docenteNombre}</h3>
                        ${docenteArea ? `<p class="teacher-area">${docenteArea}</p>` : ''}
                        ${docente?.email ? `<p class="teacher-email">${docente.email}</p>` : ''}
                    </div>
                </div>
            </div>
            <div class="modulos-section">
                <h2>Módulos</h2>
                <div id="modulos-list">
                    ${this.renderModulos(curso.modulos || [])}
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.setupModuloToggles();
    }

    renderModulos(modulos) {
        if (modulos.length === 0) {
            return '<p>No hay módulos en este curso</p>';
        }

        return modulos.map((modulo, index) => `
            <div class="modulo-container" data-modulo-id="${modulo.id}">
                <div class="modulo-header" data-modulo-id="${modulo.id}">
                    <button class="modulo-toggle" data-modulo-id="${modulo.id}">▼</button>
                    <div class="modulo-info">
                        <h3>${modulo.nombre}</h3>
                        <p class="modulo-code">${modulo.codigo}</p>
                        <p class="modulo-description">${modulo.descripcion || 'Sin descripción'}</p>
                    </div>
                </div>
                <div class="modulo-lecciones" id="lecciones-${modulo.id}" style="display: ${index === 0 ? 'block' : 'none'};">
                    ${this.renderLecciones(modulo.lecciones || [])}
                </div>
            </div>
        `).join('');
    }

    renderLecciones(lecciones) {
        if (lecciones.length === 0) {
            return '<p>No hay lecciones en este módulo</p>';
        }

        return lecciones.map(leccion => `
            <div class="leccion-item">
                <div class="leccion-header">
                    <h4>${leccion.titulo}</h4>
                    <span class="leccion-type leccion-type-${leccion.tipo}">${leccion.tipo}</span>
                    <span class="leccion-hours">${leccion.intensidadHoraria} horas</span>
                </div>
                <p class="leccion-content">${leccion.contenido}</p>
                ${leccion.videoUrl ? `
                    <div class="leccion-video">
                        <a href="${leccion.videoUrl}" target="_blank">Ver Video</a>
                    </div>
                ` : ''}
                ${leccion.recursosAdicionales && leccion.recursosAdicionales.length > 0 ? `
                    <div class="leccion-recursos">
                        <strong>Recursos adicionales:</strong>
                        <ul>
                            ${leccion.recursosAdicionales.map(recurso => `<li><a href="${recurso}" target="_blank">${recurso}</a></li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    setupEventListeners() {
        const backBtn = this.querySelector('#back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.hash = '#/public';
            });
        }
    }

    setupModuloToggles() {
        const headers = this.querySelectorAll('.modulo-header');
        headers.forEach(header => {
            header.addEventListener('click', (e) => {
                if (e.target.closest('.modulo-toggle')) return;
                
                const moduloId = header.getAttribute('data-modulo-id');
                const leccionesDiv = this.querySelector(`#lecciones-${moduloId}`);
                const toggle = header.querySelector('.modulo-toggle');
                
                if (leccionesDiv) {
                    const isExpanded = leccionesDiv.style.display !== 'none';
                    leccionesDiv.style.display = isExpanded ? 'none' : 'block';
                    toggle.textContent = isExpanded ? '▶' : '▼';
                    
                    if (!isExpanded) {
                        setTimeout(() => {
                            header.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 100);
                    }
                }
            });
        });

        const toggles = this.querySelectorAll('.modulo-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const moduloId = toggle.getAttribute('data-modulo-id');
                const leccionesDiv = this.querySelector(`#lecciones-${moduloId}`);
                
                if (leccionesDiv) {
                    const isExpanded = leccionesDiv.style.display !== 'none';
                    leccionesDiv.style.display = isExpanded ? 'none' : 'block';
                    toggle.textContent = isExpanded ? '▶' : '▼';
                }
            });
        });
    }
}

customElements.define('curso-view', CourseView);
export default CourseView;

