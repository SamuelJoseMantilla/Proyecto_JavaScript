/**
 * Vista de Panel de Administración
 * Custom Element: admin-view
 */

import { getData, saveData } from '../utils/dataStorage.js';
import '../components/Modal.js';

class AdminView extends HTMLElement {
    constructor() {
        super();
        this.activeTab = 'docentes';
    }

    connectedCallback() {
        // Validar token
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.hash = '#/login';
            return;
        }

        this.render();
        this.loadTab(this.activeTab);
        this.setupEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="admin-container">
                <header class="admin-header">
                    <h1>ABC Educate - Panel de Administración</h1>
                    <div class="header-actions">
                        <button class="btn btn-secondary" id="dashboard-btn">Dashboard</button>
                        <button class="btn btn-danger" id="logout-btn">Cerrar Sesión</button>
                    </div>
                </header>
                <nav class="admin-tabs">
                    <button class="tab-btn active" data-tab="docentes">Docentes</button>
                    <button class="tab-btn" data-tab="cursos">Cursos</button>
                    <button class="tab-btn" data-tab="administrativos">Administrativos</button>
                    <button class="tab-btn" data-tab="credenciales">Credenciales</button>
                </nav>
                <main class="admin-content" id="admin-content">
                    <!-- Contenido dinámico según tab -->
                </main>
            </div>
            <modal-component id="admin-modal"></modal-component>
        `;
    }

    setupEventListeners() {
        const tabs = this.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        const dashboardBtn = this.querySelector('#dashboard-btn');
        const logoutBtn = this.querySelector('#logout-btn');

        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', () => {
                window.location.hash = '#/dashboard';
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

    switchTab(tabName) {
        this.activeTab = tabName;
        
        const tabs = this.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });

        this.loadTab(tabName);
    }

    loadTab(tabName) {
        const content = this.querySelector('#admin-content');
        
        switch (tabName) {
            case 'docentes':
                this.loadDocentesTab(content);
                break;
            case 'cursos':
                this.loadCursosTab(content);
                break;
            case 'administrativos':
                this.loadAdministrativosTab(content);
                break;
            case 'credenciales':
                this.loadCredencialesTab(content);
                break;
        }
    }

    loadDocentesTab(container) {
        const appData = getData('app-data') || { docentes: [] };
        const docentes = appData.docentes || [];

        container.innerHTML = `
            <div class="tab-header">
                <h2>Gestión de Docentes</h2>
                <button class="btn btn-primary" id="crear-docente-btn">CREAR_DOCENTE</button>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Identificación</th>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Email</th>
                            <th>Área Académica</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="docentes-tbody">
                        ${docentes.map(docente => `
                            <tr>
                                <td>${docente.codigo}</td>
                                <td>${docente.identificacion}</td>
                                <td>${docente.nombres}</td>
                                <td>${docente.apellidos}</td>
                                <td>${docente.email}</td>
                                <td>${docente.areaAcademica}</td>
                                <td>
                                    <button class="btn-icon" data-action="edit" data-id="${docente.id}" data-type="docente">✏️</button>
                                    <button class="btn-icon" data-action="delete" data-id="${docente.id}" data-type="docente">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.setupDocentesListeners();
    }

    loadCursosTab(container) {
        const appData = getData('app-data') || { cursos: [], docentes: [] };
        const cursos = appData.cursos || [];

        container.innerHTML = `
            <div class="tab-header">
                <h2>Gestión de Cursos</h2>
                <button class="btn btn-primary" id="crear-curso-btn">CREAR_CURSO</button>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Docente</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="cursos-tbody">
                        ${cursos.map(curso => {
                            const docente = appData.docentes.find(d => d.id === curso.docenteId);
                            return `
                                <tr>
                                    <td>${curso.codigo}</td>
                                    <td>${curso.nombre}</td>
                                    <td>${curso.descripcion || ''}</td>
                                    <td>${docente ? `${docente.nombres} ${docente.apellidos}` : 'Sin docente'}</td>
                                    <td>
                                        <button class="btn-icon" data-action="edit" data-id="${curso.id}" data-type="curso">✏️</button>
                                        <button class="btn-icon" data-action="delete" data-id="${curso.id}" data-type="curso">🗑️</button>
                                        <button class="btn btn-sm" data-action="modulos" data-id="${curso.id}">MODULOS</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.setupCursosListeners();
    }

    loadAdministrativosTab(container) {
        const appData = getData('app-data') || { administrativos: [] };
        const administrativos = appData.administrativos || [];

        container.innerHTML = `
            <div class="tab-header">
                <h2>Gestión de Administrativos</h2>
                <button class="btn btn-primary" id="crear-administrativo-btn">CREAR_ADMINISTRATIVO</button>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Identificación</th>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Cargo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="administrativos-tbody">
                        ${administrativos.map(admin => `
                            <tr>
                                <td>${admin.identificacion}</td>
                                <td>${admin.nombres}</td>
                                <td>${admin.apellidos}</td>
                                <td>${admin.email}</td>
                                <td>${admin.telefono}</td>
                                <td>${admin.cargo}</td>
                                <td>
                                    <button class="btn-icon" data-action="edit" data-id="${admin.id}" data-type="administrativo">✏️</button>
                                    <button class="btn-icon" data-action="delete" data-id="${admin.id}" data-type="administrativo">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.setupAdministrativosListeners();
    }

    loadCredencialesTab(container) {
        const appData = getData('app-data') || { credenciales: [] };
        const credenciales = appData.credenciales || [];

        container.innerHTML = `
            <div class="tab-header">
                <h2>Gestión de Credenciales</h2>
                <button class="btn btn-primary" id="agregar-credencial-btn">AGREGAR_CREDENCIAL</button>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="credenciales-tbody">
                        ${credenciales.map(cred => `
                            <tr>
                                <td>${cred.email}</td>
                                <td>${cred.rol}</td>
                                <td>
                                    <button class="btn-icon" data-action="edit-password" data-id="${cred.id}">✏️</button>
                                    <button class="btn-icon" data-action="delete" data-id="${cred.id}" data-type="credencial">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.setupCredencialesListeners();
    }

    setupDocentesListeners() {
        const crearBtn = this.querySelector('#crear-docente-btn');
        if (crearBtn) {
            crearBtn.addEventListener('click', () => {
                this.showDocenteModal();
            });
        }

        const tbody = this.querySelector('#docentes-tbody');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const action = btn.getAttribute('data-action');
                const id = btn.getAttribute('data-id');

                if (action === 'edit') {
                    this.showDocenteModal(id);
                } else if (action === 'delete') {
                    this.deleteDocente(id);
                }
            });
        }
    }

    setupCursosListeners() {
        const crearBtn = this.querySelector('#crear-curso-btn');
        if (crearBtn) {
            crearBtn.addEventListener('click', () => {
                this.showCursoModal();
            });
        }

        const tbody = this.querySelector('#cursos-tbody');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const action = btn.getAttribute('data-action');
                const id = btn.getAttribute('data-id');

                if (action === 'edit') {
                    this.showCursoModal(id);
                } else if (action === 'delete') {
                    this.deleteCurso(id);
                } else if (action === 'modulos') {
                    this.showModulosView(id);
                }
            });
        }
    }

    setupAdministrativosListeners() {
        const crearBtn = this.querySelector('#crear-administrativo-btn');
        if (crearBtn) {
            crearBtn.addEventListener('click', () => {
                this.showAdministrativoModal();
            });
        }

        const tbody = this.querySelector('#administrativos-tbody');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const action = btn.getAttribute('data-action');
                const id = btn.getAttribute('data-id');

                if (action === 'edit') {
                    this.showAdministrativoModal(id);
                } else if (action === 'delete') {
                    this.deleteAdministrativo(id);
                }
            });
        }
    }

    setupCredencialesListeners() {
        const agregarBtn = this.querySelector('#agregar-credencial-btn');
        if (agregarBtn) {
            agregarBtn.addEventListener('click', () => {
                this.showCredencialModal();
            });
        }

        const tbody = this.querySelector('#credenciales-tbody');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const action = btn.getAttribute('data-action');
                const id = btn.getAttribute('data-id');

                if (action === 'edit-password') {
                    this.showCredencialModal(id);
                } else if (action === 'delete') {
                    this.deleteCredencial(id);
                }
            });
        }
    }

    // Métodos para mostrar modales y CRUD
    showDocenteModal(id = null) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { docentes: [] };
        const docente = id ? appData.docentes.find(d => d.id === id) : null;

        const formHtml = `
            <h2>${id ? 'Editar' : 'Crear'} Docente</h2>
            <form id="docente-form">
                <input type="hidden" id="docente-id" value="${id || ''}">
                <div class="form-group">
                    <label for="docente-codigo">Código</label>
                    <input type="text" id="docente-codigo" value="${docente?.codigo || ''}" required>
                </div>
                <div class="form-group">
                    <label for="docente-identificacion">Identificación</label>
                    <input type="text" id="docente-identificacion" value="${docente?.identificacion || ''}" required>
                </div>
                <div class="form-group">
                    <label for="docente-nombres">Nombres</label>
                    <input type="text" id="docente-nombres" value="${docente?.nombres || ''}" required>
                </div>
                <div class="form-group">
                    <label for="docente-apellidos">Apellidos</label>
                    <input type="text" id="docente-apellidos" value="${docente?.apellidos || ''}" required>
                </div>
                <div class="form-group">
                    <label for="docente-email">Email</label>
                    <input type="email" id="docente-email" value="${docente?.email || ''}" required>
                </div>
                <div class="form-group">
                    <label for="docente-fotoUrl">Foto URL</label>
                    <input type="url" id="docente-fotoUrl" value="${docente?.fotoUrl || ''}">
                </div>
                <div class="form-group">
                    <label for="docente-areaAcademica">Área Académica</label>
                    <input type="text" id="docente-areaAcademica" value="${docente?.areaAcademica || ''}" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancel-docente">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        `;

        modal.setContent(formHtml);
        modal.open();

        const form = modal.querySelector('#docente-form');
        const cancelBtn = modal.querySelector('#cancel-docente');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDocente(id);
        });

        cancelBtn.addEventListener('click', () => {
            modal.close();
        });
    }

    saveDocente(id) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { docentes: [] };

        const docenteData = {
            codigo: modal.querySelector('#docente-codigo').value,
            identificacion: modal.querySelector('#docente-identificacion').value,
            nombres: modal.querySelector('#docente-nombres').value,
            apellidos: modal.querySelector('#docente-apellidos').value,
            email: modal.querySelector('#docente-email').value,
            fotoUrl: modal.querySelector('#docente-fotoUrl').value,
            areaAcademica: modal.querySelector('#docente-areaAcademica').value
        };

        if (id) {
            const index = appData.docentes.findIndex(d => d.id === id);
            if (index !== -1) {
                appData.docentes[index] = { ...appData.docentes[index], ...docenteData };
            }
        } else {
            docenteData.id = 'docente-' + Date.now();
            appData.docentes.push(docenteData);
        }

        saveData('app-data', appData);
        modal.close();
        this.loadTab(this.activeTab);
    }

    deleteDocente(id) {
        const appData = getData('app-data') || { cursos: [], docentes: [] };
        const cursoAsignado = appData.cursos.find(c => c.docenteId === id);
        
        if (cursoAsignado) {
            alert('No se puede eliminar un docente asignado a un curso');
            return;
        }

        if (confirm('¿Está seguro de eliminar este docente?')) {
            appData.docentes = appData.docentes.filter(d => d.id !== id);
            saveData('app-data', appData);
            this.loadTab(this.activeTab);
        }
    }

    showCursoModal(id = null) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { cursos: [], docentes: [] };
        const curso = id ? appData.cursos.find(c => c.id === id) : null;
        const docentes = appData.docentes || [];

        const formHtml = `
            <h2>${id ? 'Editar' : 'Crear'} Curso</h2>
            <form id="curso-form">
                <input type="hidden" id="curso-id" value="${id || ''}">
                <div class="form-group">
                    <label for="curso-codigo">Código</label>
                    <input type="text" id="curso-codigo" value="${curso?.codigo || ''}" required>
                </div>
                <div class="form-group">
                    <label for="curso-nombre">Nombre</label>
                    <input type="text" id="curso-nombre" value="${curso?.nombre || ''}" required>
                </div>
                <div class="form-group">
                    <label for="curso-descripcion">Descripción</label>
                    <textarea id="curso-descripcion" rows="4" required>${curso?.descripcion || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="curso-docenteId">Docente</label>
                    <select id="curso-docenteId" required>
                        <option value="">Seleccionar docente</option>
                        ${docentes.map(d => `
                            <option value="${d.id}" ${curso?.docenteId === d.id ? 'selected' : ''}>
                                ${d.nombres} ${d.apellidos}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancel-curso">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        `;

        modal.setContent(formHtml);
        modal.open();

        const form = modal.querySelector('#curso-form');
        const cancelBtn = modal.querySelector('#cancel-curso');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCurso(id);
        });

        cancelBtn.addEventListener('click', () => {
            modal.close();
        });
    }

    saveCurso(id) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { cursos: [] };

        const cursoData = {
            codigo: modal.querySelector('#curso-codigo').value,
            nombre: modal.querySelector('#curso-nombre').value,
            descripcion: modal.querySelector('#curso-descripcion').value,
            docenteId: modal.querySelector('#curso-docenteId').value
        };

        if (id) {
            const index = appData.cursos.findIndex(c => c.id === id);
            if (index !== -1) {
                appData.cursos[index] = { ...appData.cursos[index], ...cursoData };
            }
        } else {
            cursoData.id = 'curso-' + Date.now();
            cursoData.modulos = [];
            appData.cursos.push(cursoData);
        }

        saveData('app-data', appData);
        modal.close();
        this.loadTab(this.activeTab);
    }

    deleteCurso(id) {
        if (confirm('¿Está seguro de eliminar este curso?')) {
            const appData = getData('app-data') || { cursos: [] };
            appData.cursos = appData.cursos.filter(c => c.id !== id);
            saveData('app-data', appData);
            this.loadTab(this.activeTab);
        }
    }

    showModulosView(cursoId) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { cursos: [], docentes: [] };
        const curso = appData.cursos.find(c => c.id === cursoId);
        
        if (!curso) return;

        const modulosHtml = `
            <h2>Módulos del Curso: ${curso.nombre}</h2>
            <button class="btn btn-primary" id="agregar-modulo-btn">AGREGAR MÓDULO</button>
            <div id="modulos-list">
                ${this.renderModulosList(curso.modulos || [], cursoId)}
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" id="close-modulos">Cerrar</button>
            </div>
        `;

        modal.setContent(modulosHtml);
        modal.open();

        const agregarBtn = modal.querySelector('#agregar-modulo-btn');
        const closeBtn = modal.querySelector('#close-modulos');

        agregarBtn.addEventListener('click', () => {
            this.showModuloModal(cursoId);
        });

        closeBtn.addEventListener('click', () => {
            modal.close();
        });

        // Delegación de eventos para módulos
        const modulosList = modal.querySelector('#modulos-list');
        if (modulosList) {
            modulosList.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const action = btn.getAttribute('data-action');
                const moduloId = btn.getAttribute('data-modulo-id');

                if (action === 'ver-lecciones') {
                    this.showLeccionesView(cursoId, moduloId);
                } else if (action === 'agregar-leccion') {
                    this.showLeccionModal(cursoId, moduloId);
                } else if (action === 'edit-modulo') {
                    this.showModuloModal(cursoId, moduloId);
                } else if (action === 'delete-modulo') {
                    this.deleteModulo(cursoId, moduloId);
                }
            });
        }
    }

    renderModulosList(modulos, cursoId) {
        if (modulos.length === 0) {
            return '<p>No hay módulos en este curso</p>';
        }

        return modulos.map(modulo => `
            <div class="modulo-item">
                <div class="modulo-header">
                    <h3>${modulo.nombre} (${modulo.codigo})</h3>
                    <div class="modulo-actions">
                        <button class="btn btn-sm" data-action="ver-lecciones" data-modulo-id="${modulo.id}">Ver Lecciones</button>
                        <button class="btn btn-sm" data-action="agregar-leccion" data-modulo-id="${modulo.id}">AGREGAR LECCIÓN</button>
                        <button class="btn-icon" data-action="edit-modulo" data-modulo-id="${modulo.id}">✏️</button>
                        <button class="btn-icon" data-action="delete-modulo" data-modulo-id="${modulo.id}">🗑️</button>
                    </div>
                </div>
                <p>${modulo.descripcion || 'Sin descripción'}</p>
            </div>
        `).join('');
    }

    showModuloModal(cursoId, moduloId = null) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { cursos: [] };
        const curso = appData.cursos.find(c => c.id === cursoId);
        const modulo = moduloId ? curso.modulos.find(m => m.id === moduloId) : null;

        const formHtml = `
            <h2>${moduloId ? 'Editar' : 'Crear'} Módulo</h2>
            <form id="modulo-form">
                <input type="hidden" id="modulo-id" value="${moduloId || ''}">
                <div class="form-group">
                    <label for="modulo-codigo">Código</label>
                    <input type="text" id="modulo-codigo" value="${modulo?.codigo || ''}" required>
                </div>
                <div class="form-group">
                    <label for="modulo-nombre">Nombre</label>
                    <input type="text" id="modulo-nombre" value="${modulo?.nombre || ''}" required>
                </div>
                <div class="form-group">
                    <label for="modulo-descripcion">Descripción</label>
                    <textarea id="modulo-descripcion" rows="4" required>${modulo?.descripcion || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancel-modulo">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        `;

        modal.setContent(formHtml);
        modal.open();

        const form = modal.querySelector('#modulo-form');
        const cancelBtn = modal.querySelector('#cancel-modulo');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveModulo(cursoId, moduloId);
        });

        cancelBtn.addEventListener('click', () => {
            this.showModulosView(cursoId);
        });
    }

    saveModulo(cursoId, moduloId) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { cursos: [] };
        const curso = appData.cursos.find(c => c.id === cursoId);

        const moduloData = {
            codigo: modal.querySelector('#modulo-codigo').value,
            nombre: modal.querySelector('#modulo-nombre').value,
            descripcion: modal.querySelector('#modulo-descripcion').value
        };

        if (moduloId) {
            const index = curso.modulos.findIndex(m => m.id === moduloId);
            if (index !== -1) {
                curso.modulos[index] = { ...curso.modulos[index], ...moduloData };
            }
        } else {
            moduloData.id = 'modulo-' + Date.now();
            moduloData.lecciones = [];
            curso.modulos.push(moduloData);
        }

        saveData('app-data', appData);
        this.showModulosView(cursoId);
    }

    deleteModulo(cursoId, moduloId) {
        if (confirm('¿Está seguro de eliminar este módulo? Se eliminarán todas las lecciones asociadas.')) {
            const appData = getData('app-data') || { cursos: [] };
            const curso = appData.cursos.find(c => c.id === cursoId);
            curso.modulos = curso.modulos.filter(m => m.id !== moduloId);
            saveData('app-data', appData);
            this.showModulosView(cursoId);
        }
    }

    showLeccionesView(cursoId, moduloId) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { cursos: [] };
        const curso = appData.cursos.find(c => c.id === cursoId);
        const modulo = curso.modulos.find(m => m.id === moduloId);

        const leccionesHtml = `
            <h2>Lecciones del Módulo: ${modulo.nombre}</h2>
            <button class="btn btn-primary" id="agregar-leccion-btn">AGREGAR LECCIÓN</button>
            <div id="lecciones-list" class="lecciones-grid">
                ${this.renderLeccionesList(modulo.lecciones || [], cursoId, moduloId)}
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" id="close-lecciones">Volver a Módulos</button>
            </div>
        `;

        modal.setContent(leccionesHtml);
        modal.open();

        const agregarBtn = modal.querySelector('#agregar-leccion-btn');
        const closeBtn = modal.querySelector('#close-lecciones');

        agregarBtn.addEventListener('click', () => {
            this.showLeccionModal(cursoId, moduloId);
        });

        closeBtn.addEventListener('click', () => {
            this.showModulosView(cursoId);
        });

        // Delegación de eventos para lecciones
        const leccionesList = modal.querySelector('#lecciones-list');
        if (leccionesList) {
            leccionesList.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const action = btn.getAttribute('data-action');
                const leccionId = btn.getAttribute('data-leccion-id');

                if (action === 'edit-leccion') {
                    this.showLeccionModal(cursoId, moduloId, leccionId);
                } else if (action === 'delete-leccion') {
                    this.deleteLeccion(cursoId, moduloId, leccionId);
                }
            });
        }
    }

    renderLeccionesList(lecciones, cursoId, moduloId) {
        if (lecciones.length === 0) {
            return '<p>No hay lecciones en este módulo</p>';
        }

        return lecciones.map(leccion => `
            <div class="leccion-item">
                <h4>${leccion.titulo}</h4>
                <p><strong>Tipo:</strong> ${leccion.tipo}</p>
                <p><strong>Intensidad Horaria:</strong> ${leccion.intensidadHoraria} horas</p>
                <p>${leccion.contenido}</p>
                ${leccion.videoUrl ? `<p><a href="${leccion.videoUrl}" target="_blank">Ver Video</a></p>` : ''}
                <div class="leccion-actions">
                    <button class="btn-icon" data-action="edit-leccion" data-leccion-id="${leccion.id}">✏️</button>
                    <button class="btn-icon" data-action="delete-leccion" data-leccion-id="${leccion.id}">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    showLeccionModal(cursoId, moduloId, leccionId = null) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { cursos: [] };
        const curso = appData.cursos.find(c => c.id === cursoId);
        const modulo = curso.modulos.find(m => m.id === moduloId);
        const leccion = leccionId ? modulo.lecciones.find(l => l.id === leccionId) : null;

        const formHtml = `
            <h2>${leccionId ? 'Editar' : 'Crear'} Lección</h2>
            <form id="leccion-form">
                <input type="hidden" id="leccion-id" value="${leccionId || ''}">
                <div class="form-group">
                    <label for="leccion-titulo">Título</label>
                    <input type="text" id="leccion-titulo" value="${leccion?.titulo || ''}" required>
                </div>
                <div class="form-group">
                    <label for="leccion-tipo">Tipo</label>
                    <select id="leccion-tipo" required>
                        <option value="lectura" ${leccion?.tipo === 'lectura' ? 'selected' : ''}>Lectura</option>
                        <option value="video" ${leccion?.tipo === 'video' ? 'selected' : ''}>Video</option>
                        <option value="quiz" ${leccion?.tipo === 'quiz' ? 'selected' : ''}>Quiz</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="leccion-intensidadHoraria">Intensidad Horaria</label>
                    <input type="number" id="leccion-intensidadHoraria" value="${leccion?.intensidadHoraria || 0}" min="0" required>
                </div>
                <div class="form-group">
                    <label for="leccion-contenido">Contenido</label>
                    <textarea id="leccion-contenido" rows="4" required>${leccion?.contenido || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="leccion-videoUrl">Video URL (opcional)</label>
                    <input type="url" id="leccion-videoUrl" value="${leccion?.videoUrl || ''}">
                </div>
                <div class="form-group">
                    <label for="leccion-recursosAdicionales">Recursos Adicionales (separados por comas)</label>
                    <input type="text" id="leccion-recursosAdicionales" value="${leccion?.recursosAdicionales ? leccion.recursosAdicionales.join(', ') : ''}">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancel-leccion">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        `;

        modal.setContent(formHtml);
        modal.open();

        const form = modal.querySelector('#leccion-form');
        const cancelBtn = modal.querySelector('#cancel-leccion');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveLeccion(cursoId, moduloId, leccionId);
        });

        cancelBtn.addEventListener('click', () => {
            this.showLeccionesView(cursoId, moduloId);
        });
    }

    saveLeccion(cursoId, moduloId, leccionId) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { cursos: [] };
        const curso = appData.cursos.find(c => c.id === cursoId);
        const modulo = curso.modulos.find(m => m.id === moduloId);

        const recursosText = modal.querySelector('#leccion-recursosAdicionales').value;
        const recursosAdicionales = recursosText 
            ? recursosText.split(',').map(r => r.trim()).filter(r => r)
            : [];

        const leccionData = {
            titulo: modal.querySelector('#leccion-titulo').value,
            tipo: modal.querySelector('#leccion-tipo').value,
            intensidadHoraria: parseInt(modal.querySelector('#leccion-intensidadHoraria').value),
            contenido: modal.querySelector('#leccion-contenido').value,
            videoUrl: modal.querySelector('#leccion-videoUrl').value || undefined,
            recursosAdicionales: recursosAdicionales.length > 0 ? recursosAdicionales : undefined
        };

        if (leccionId) {
            const index = modulo.lecciones.findIndex(l => l.id === leccionId);
            if (index !== -1) {
                modulo.lecciones[index] = { ...modulo.lecciones[index], ...leccionData };
            }
        } else {
            leccionData.id = 'leccion-' + Date.now();
            modulo.lecciones.push(leccionData);
        }

        saveData('app-data', appData);
        this.showLeccionesView(cursoId, moduloId);
    }

    deleteLeccion(cursoId, moduloId, leccionId) {
        if (confirm('¿Está seguro de eliminar esta lección?')) {
            const appData = getData('app-data') || { cursos: [] };
            const curso = appData.cursos.find(c => c.id === cursoId);
            const modulo = curso.modulos.find(m => m.id === moduloId);
            modulo.lecciones = modulo.lecciones.filter(l => l.id !== leccionId);
            saveData('app-data', appData);
            this.showLeccionesView(cursoId, moduloId);
        }
    }

    showAdministrativoModal(id = null) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { administrativos: [] };
        const admin = id ? appData.administrativos.find(a => a.id === id) : null;

        const formHtml = `
            <h2>${id ? 'Editar' : 'Crear'} Administrativo</h2>
            <form id="administrativo-form">
                <input type="hidden" id="administrativo-id" value="${id || ''}">
                <div class="form-group">
                    <label for="admin-identificacion">Identificación</label>
                    <input type="text" id="admin-identificacion" value="${admin?.identificacion || ''}" required>
                </div>
                <div class="form-group">
                    <label for="admin-nombres">Nombres</label>
                    <input type="text" id="admin-nombres" value="${admin?.nombres || ''}" required>
                </div>
                <div class="form-group">
                    <label for="admin-apellidos">Apellidos</label>
                    <input type="text" id="admin-apellidos" value="${admin?.apellidos || ''}" required>
                </div>
                <div class="form-group">
                    <label for="admin-email">Email</label>
                    <input type="email" id="admin-email" value="${admin?.email || ''}" required>
                </div>
                <div class="form-group">
                    <label for="admin-telefono">Teléfono</label>
                    <input type="text" id="admin-telefono" value="${admin?.telefono || ''}" required>
                </div>
                <div class="form-group">
                    <label for="admin-cargo">Cargo</label>
                    <input type="text" id="admin-cargo" value="${admin?.cargo || ''}" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancel-admin">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        `;

        modal.setContent(formHtml);
        modal.open();

        const form = modal.querySelector('#administrativo-form');
        const cancelBtn = modal.querySelector('#cancel-admin');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAdministrativo(id);
        });

        cancelBtn.addEventListener('click', () => {
            modal.close();
        });
    }

    saveAdministrativo(id) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { administrativos: [] };

        const adminData = {
            identificacion: modal.querySelector('#admin-identificacion').value,
            nombres: modal.querySelector('#admin-nombres').value,
            apellidos: modal.querySelector('#admin-apellidos').value,
            email: modal.querySelector('#admin-email').value,
            telefono: modal.querySelector('#admin-telefono').value,
            cargo: modal.querySelector('#admin-cargo').value
        };

        if (id) {
            const index = appData.administrativos.findIndex(a => a.id === id);
            if (index !== -1) {
                appData.administrativos[index] = { ...appData.administrativos[index], ...adminData };
            }
        } else {
            adminData.id = 'admin-' + Date.now();
            appData.administrativos.push(adminData);
        }

        saveData('app-data', appData);
        modal.close();
        this.loadTab(this.activeTab);
    }

    deleteAdministrativo(id) {
        if (confirm('¿Está seguro de eliminar este administrativo?')) {
            const appData = getData('app-data') || { administrativos: [] };
            appData.administrativos = appData.administrativos.filter(a => a.id !== id);
            saveData('app-data', appData);
            this.loadTab(this.activeTab);
        }
    }

    showCredencialModal(id = null) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { credenciales: [] };
        const credencial = id ? appData.credenciales.find(c => c.id === id) : null;

        const formHtml = `
            <h2>${id ? 'Editar Contraseña' : 'Agregar'} Credencial</h2>
            <form id="credencial-form">
                <input type="hidden" id="credencial-id" value="${id || ''}">
                <div class="form-group">
                    <label for="cred-email">Email</label>
                    <input type="email" id="cred-email" value="${credencial?.email || ''}" ${id ? 'disabled' : 'required'}>
                </div>
                <div class="form-group">
                    <label for="cred-password">Contraseña</label>
                    <input type="password" id="cred-password" value="" required>
                </div>
                ${!id ? `
                <div class="form-group">
                    <label for="cred-rol">Rol</label>
                    <select id="cred-rol" required>
                        <option value="admin">Admin</option>
                        <option value="administrativo">Administrativo</option>
                        <option value="docente">Docente</option>
                    </select>
                </div>
                ` : ''}
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancel-cred">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        `;

        modal.setContent(formHtml);
        modal.open();

        const form = modal.querySelector('#credencial-form');
        const cancelBtn = modal.querySelector('#cancel-cred');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCredencial(id);
        });

        cancelBtn.addEventListener('click', () => {
            modal.close();
        });
    }

    saveCredencial(id) {
        const modal = this.querySelector('#admin-modal');
        const appData = getData('app-data') || { credenciales: [] };

        if (id) {
            const index = appData.credenciales.findIndex(c => c.id === id);
            if (index !== -1) {
                appData.credenciales[index].password = modal.querySelector('#cred-password').value;
            }
        } else {
            const credencialData = {
                id: 'cred-' + Date.now(),
                email: modal.querySelector('#cred-email').value,
                password: modal.querySelector('#cred-password').value,
                rol: modal.querySelector('#cred-rol').value
            };
            appData.credenciales.push(credencialData);
        }

        saveData('app-data', appData);
        modal.close();
        this.loadTab(this.activeTab);
    }

    deleteCredencial(id) {
        if (confirm('¿Está seguro de eliminar esta credencial?')) {
            const appData = getData('app-data') || { credenciales: [] };
            appData.credenciales = appData.credenciales.filter(c => c.id !== id);
            saveData('app-data', appData);
            this.loadTab(this.activeTab);
        }
    }
}

customElements.define('admin-view', AdminView);
export default AdminView;

