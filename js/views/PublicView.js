import Models from '../data/Models.js';
import Router from '../core/Router.js';
import Styles from '../core/Styles.js';
import '../components/CourseDetailsModal.js';

class PublicView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.loadCourses();
        this.setupEventListeners();
    }

    render() {
        const styles = Styles.getInlineStyles();
        this.shadowRoot.innerHTML = `
            ${styles}
            <header class="header" role="banner">
                <div class="container">
                    <div class="header-content">
                        <h1>ABC Educate</h1>
                        <button class="btn btn-secondary" id="admin-login-btn">
                            Iniciar Sesión Administrador
                        </button>
                    </div>
                </div>
            </header>
            <div class="hero-section" role="region" aria-label="Bienvenida">
                <div class="container">
                    <div class="hero-content">
                        <h2>Bienvenido a Nuestra Plataforma Educativa</h2>
                        <p>Explora nuestros cursos disponibles y comienza tu viaje de aprendizaje hoy mismo</p>
                    </div>
                </div>
            </div>
            <main class="container" role="main">
                <div class="courses-header">
                    <h3 id="courses-heading">Cursos Disponibles</h3>
                </div>
                <div id="courses-grid" class="courses-grid" role="list">
                    <!-- Courses will be loaded here -->
                </div>
            </main>
        `;
    }

    loadCourses() {
        const courses = Models.getCourses().filter(course => course.status === 'active');
        const teachers = Models.getTeachers();
        const modules = Models.getModules();
        const lessons = Models.getLessons();
        const grid = this.shadowRoot.getElementById('courses-grid');
        
        if (!grid) return;
        
        if (courses.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h2>No hay cursos disponibles</h2>
                    <p>Los cursos aparecerán aquí cuando estén disponibles.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = courses.map(course => {
            const teacher = teachers.find(t => t.id === course.teacherId);
            const teacherName = teacher 
                ? `${teacher.names} ${teacher.lastnames}` 
                : 'Sin docente asignado';
            const teacherPhoto = teacher && teacher.photo 
                ? teacher.photo 
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&background=98CA3F&color=fff&size=128`;
            
            const courseModules = modules.filter(m => m.courseId === course.id);
            const courseLessons = courseModules.reduce((total, module) => {
                return total + lessons.filter(l => l.moduleId === module.id).length;
            }, 0);
            const totalHours = courseModules.reduce((total, module) => {
                const moduleLessons = lessons.filter(l => l.moduleId === module.id);
                return total + moduleLessons.reduce((sum, lesson) => sum + (parseInt(lesson.intensity) || 0), 0);
            }, 0);
            
            const description = course.description || 'Sin descripción disponible';
            const shortDescription = description.length > 120 
                ? description.substring(0, 120) + '...' 
                : description;
            
            return `
                <article class="course-card" data-course-id="${course.id}">
                    <div class="course-header">
                        <div class="course-code">${course.code}</div>
                        <h3>${course.name}</h3>
                    </div>
                    <div class="course-body">
                        <p class="course-description">${shortDescription}</p>
                        <div class="course-teacher">
                            <img src="${teacherPhoto}" alt="${teacherName}" class="teacher-avatar"
                                 onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&background=98CA3F&color=fff&size=128'">
                            <div class="teacher-info">
                                <p class="teacher-name">${teacherName}</p>
                            </div>
                        </div>
                        <div class="course-stats">
                            <div class="stat-item">
                                <span class="stat-label">Módulos</span>
                                <span class="stat-value">${courseModules.length}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Lecciones</span>
                                <span class="stat-value">${courseLessons}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Horas</span>
                                <span class="stat-value">${totalHours}</span>
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary view-details-btn" data-course-id="${course.id}">
                            Ver Detalles del Curso
                        </button>
                    </div>
                </article>
            `;
        }).join('');
    }

    setupEventListeners() {
        // Botón de login
        const adminLoginBtn = this.shadowRoot.getElementById('admin-login-btn');
        if (adminLoginBtn) {
            adminLoginBtn.addEventListener('click', () => {
                Router.navigate('#login');
            });
        }

        // Delegación de eventos para los botones de detalles
        const grid = this.shadowRoot.getElementById('courses-grid');
        if (grid) {
            grid.addEventListener('click', (e) => {
                const btn = e.target.closest('.view-details-btn');
                if (btn) {
                    e.preventDefault();
                    e.stopPropagation();
                    const courseId = btn.getAttribute('data-course-id');
                    if (courseId) {
                        this.showCourseDetails(courseId);
                    }
                }
            });
        }
    }

    showCourseDetails(courseId) {
        if (!courseId) return;

        const course = Models.getCourseById(courseId);
        if (!course) {
            console.error('Curso no encontrado:', courseId);
            return;
        }

        // Crear el modal
        const modal = document.createElement('course-details-modal');
        modal.setAttribute('course-id', courseId);
        modal.setAttribute('read-only', 'true');
        document.body.appendChild(modal);

        // Abrir el modal cuando esté listo
        setTimeout(() => {
            if (modal.open && typeof modal.open === 'function') {
                modal.open();
            }
        }, 100);

        // Limpiar cuando se cierre
        modal.addEventListener('modal-closed', () => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, { once: true });
    }
}

customElements.define('public-view', PublicView);
export default PublicView;
