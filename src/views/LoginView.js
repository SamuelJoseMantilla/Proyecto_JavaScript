/**
 * Vista de Inicio de Sesión
 * Custom Element: login-view
 */

import { getData, saveData } from '../utils/dataStorage.js';
import generateToken from '../auth/tokenGenerator.js';

class LoginView extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        // Asegurar que los datos estén inicializados
        try {
            const { initializeData } = await import('../utils/dataStorage.js');
            await initializeData();
            console.log('Datos inicializados correctamente');
        } catch (error) {
            console.error('Error al inicializar datos:', error);
        }
        
        this.render();
        
        // Esperar un momento para que el DOM se renderice
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
    }

    render() {
        this.innerHTML = `
            <div class="login-container">
                <div class="login-card">
                    <h1>Sistema de Gestión de Aprendizaje</h1>
                    <h2>Iniciar Sesión</h2>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-email">Email</label>
                            <input type="email" id="login-email" required autocomplete="email">
                        </div>
                        <div class="form-group">
                            <label for="login-password">Contraseña</label>
                            <input type="password" id="login-password" required autocomplete="current-password">
                        </div>
                        <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                        <p class="error-message" id="login-error"></p>
                    </form>
                    <div class="back-link">
                        <a href="#/public" id="back-to-public">← Volver a la vista pública</a>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const form = this.querySelector('#login-form');
        if (!form) {
            console.error('Formulario no encontrado');
            return;
        }
        
        console.log('Configurando event listeners del login');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Formulario enviado');
            this.validate();
        });
        
        // También permitir login con Enter en los campos
        const emailInput = this.querySelector('#login-email');
        const passwordInput = this.querySelector('#login-password');
        
        if (emailInput && passwordInput) {
            [emailInput, passwordInput].forEach(input => {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        form.dispatchEvent(new Event('submit'));
                    }
                });
            });
        }
    }

    async validate() {
        const emailInput = this.querySelector('#login-email');
        const passwordInput = this.querySelector('#login-password');
        const errorElement = this.querySelector('#login-error');

        if (!emailInput || !passwordInput || !errorElement) {
            console.error('Elementos del formulario no encontrados');
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validar que los campos no estén vacíos
        if (!email || !password) {
            errorElement.textContent = 'Por favor, completa todos los campos';
            errorElement.style.display = 'block';
            return;
        }

        // Limpiar error previo
        errorElement.textContent = '';
        errorElement.style.display = 'none';

        // Asegurar que los datos estén inicializados
        const { initializeData } = await import('../utils/dataStorage.js');
        await initializeData();

        const appData = getData('app-data');
        if (!appData || !appData.credenciales || appData.credenciales.length === 0) {
            errorElement.textContent = 'Error: No se encontraron datos del sistema. Por favor, recarga la página.';
            errorElement.style.display = 'block';
            console.error('No se encontraron datos en localStorage:', appData);
            return;
        }

        console.log('Email ingresado:', email);
        console.log('Tipo de credenciales:', typeof appData.credenciales, Array.isArray(appData.credenciales));
        console.log('Longitud del array:', appData.credenciales ? appData.credenciales.length : 'null');
        console.log('Credenciales disponibles (completo):', JSON.stringify(appData.credenciales, null, 2));
        
        // Verificar que credenciales sea un array
        if (!Array.isArray(appData.credenciales)) {
            errorElement.textContent = 'Error: Estructura de datos inválida';
            errorElement.style.display = 'block';
            console.error('credenciales no es un array:', appData.credenciales);
            return;
        }

        // Verificar cada credencial en detalle
        appData.credenciales.forEach((c, index) => {
            if (!c) {
                console.warn(`Credencial ${index} es null o undefined`);
                return;
            }
            const credEmail = c.email ? String(c.email).toLowerCase().trim() : '';
            const inputEmail = String(email).toLowerCase().trim();
            const match = credEmail === inputEmail;
            console.log(`Credencial ${index}:`, {
                objeto: c,
                email_original: c.email,
                email_normalizado: credEmail,
                input_normalizado: inputEmail,
                coincide: match,
                tipo_email: typeof c.email
            });
        });

        // Buscar credencial con comparación más robusta
        const emailNormalizado = String(email).toLowerCase().trim();
        const credencial = appData.credenciales.find(c => {
            if (!c || !c.email) {
                return false;
            }
            const credEmailNormalizado = String(c.email).toLowerCase().trim();
            return credEmailNormalizado === emailNormalizado;
        });
        
        if (!credencial) {
            errorElement.textContent = 'Email o contraseña incorrectos';
            errorElement.style.display = 'block';
            console.error('Credencial no encontrada. Email buscado:', email);
            console.error('Emails disponibles:', appData.credenciales.map(c => c.email));
            console.error('Estructura completa de credenciales:', appData.credenciales);
            return;
        }

        console.log('Credencial encontrada:', credencial.email);
        console.log('Comparando contraseñas. Esperada:', credencial.password, 'Ingresada:', password);

        if (credencial.password !== password) {
            errorElement.textContent = 'Email o contraseña incorrectos';
            errorElement.style.display = 'block';
            console.error('Contraseña incorrecta');
            return;
        }

        console.log('Credenciales válidas, generando token...');

        // Generar token
        const token = generateToken();
        localStorage.setItem('token', token);
        console.log('Token guardado:', token);

        // Guardar usuario actual
        let currentUser = null;
        if (credencial.rol === 'admin') {
            const admin = appData.administrativos.find(a => {
                const adminEmail = a.email.toLowerCase().trim();
                const inputEmail = email.toLowerCase().trim();
                return adminEmail === inputEmail;
            });
            if (admin) {
                currentUser = { ...admin, rol: credencial.rol };
                console.log('Usuario admin encontrado:', currentUser);
            } else {
                console.warn('No se encontró admin con email:', email);
                // Crear usuario admin básico si no se encuentra
                currentUser = {
                    email: email,
                    rol: 'admin',
                    nombres: 'Administrador',
                    apellidos: 'Principal'
                };
            }
        } else if (credencial.rol === 'docente') {
            const docente = appData.docentes.find(d => {
                const docenteEmail = d.email.toLowerCase().trim();
                const inputEmail = email.toLowerCase().trim();
                return docenteEmail === inputEmail;
            });
            if (docente) {
                currentUser = { ...docente, rol: credencial.rol };
            }
        }

        if (currentUser) {
            saveData('current-user', currentUser);
            console.log('Usuario guardado:', currentUser);
        } else {
            console.warn('No se pudo crear currentUser');
        }

        // Redirigir al dashboard
        console.log('Redirigiendo al dashboard...');
        window.location.hash = '#/dashboard';
    }
}

customElements.define('login-view', LoginView);
export default LoginView;

