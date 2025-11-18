import { getData } from '../utils/dataStorage.js';

class ReportView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.loadReport();
        this.setupEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="report-container">
                <header class="report-header">
                    <h1>ABC Educate - Reporte de Cursos</h1>
                    <div class="header-actions">
                        <button class="btn btn-secondary" id="dashboard-btn">Dashboard</button>
                        <button class="btn btn-secondary" id="admin-btn">Panel Admin</button>
                        <button class="btn btn-danger" id="logout-btn">Cerrar Sesión</button>
                    </div>
                </header>
                <main class="report-main">
                    <section class="report-section">
                        <h2>Resumen de Contenido de Cursos</h2>
                        <div class="report-table-container">
                            <table class="report-table" id="report-table">
                                <thead>
                                    <tr>
                                        <th>Curso</th>
                                        <th>Módulos</th>
                                        <th>Lecciones</th>
                                        <th>Total Intensidad Horaria</th>
                                    </tr>
                                </thead>
                                <tbody id="report-tbody">
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        `;
    }

    loadReport() {
        const appData = getData('app-data') || { cursos: [] };
        const cursos = appData.cursos || [];
        const tbody = this.querySelector('#report-tbody');

        if (cursos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="no-data">No hay cursos disponibles</td>
                </tr>
            `;
            return;
        }

        const reportData = cursos.map(curso => {
            const modulos = curso.modulos || [];
            const cantidadModulos = modulos.length;
            let cantidadLecciones = 0;
            let totalIntensidadHoraria = 0;

            modulos.forEach(modulo => {
                const lecciones = modulo.lecciones || [];
                cantidadLecciones += lecciones.length;
                
                lecciones.forEach(leccion => {
                    const intensidad = leccion.intensidadHoraria || 0;
                    totalIntensidadHoraria += intensidad;
                });
            });

            return {
                nombre: curso.nombre || 'Sin nombre',
                cantidadModulos,
                cantidadLecciones,
                totalIntensidadHoraria
            };
        });

        tbody.innerHTML = reportData.map(item => `
            <tr>
                <td class="curso-name">${item.nombre}</td>
                <td class="curso-modulos">${item.cantidadModulos}</td>
                <td class="curso-lecciones">${item.cantidadLecciones}</td>
                <td class="curso-horas">${item.totalIntensidadHoraria} horas</td>
            </tr>
        `).join('');
    }

    setupEventListeners() {
        const dashboardBtn = this.querySelector('#dashboard-btn');
        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', () => {
                window.location.hash = '#/dashboard';
            });
        }

        const adminBtn = this.querySelector('#admin-btn');
        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                window.location.hash = '#/admin';
            });
        }

        const logoutBtn = this.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                window.location.hash = '#/login';
            });
        }
    }
}

customElements.define('report-view', ReportView);

