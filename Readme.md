# ABC Educate - Sistema de Gestión de Aprendizaje

Sistema de gestión de aprendizaje (LMS) desarrollado con JavaScript vanilla, Web Components y localStorage. Permite gestionar cursos, docentes, módulos, lecciones y administrativos.

## 🚀 Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Módulos, clases, async/await
- **Web Components** - Custom Elements y Shadow DOM
- **localStorage** - Persistencia de datos en el navegador

## 📁 Estructura del Proyecto

```
src/
├── app.js                 # Inicialización de la aplicación
├── main.js                # Punto de entrada principal
├── auth/
│   └── tokenGenerator.js  # Generador de tokens
├── components/
│   ├── CourseList.js      # Lista de cursos
│   └── Modal.js          # Componente modal
├── data/
│   └── seedData.js       # Datos iniciales
├── styles/               # Estilos CSS modulares
├── utils/
│   ├── dataStorage.js    # Gestión de localStorage
│   ├── moduleHelpers.js  # Helpers de módulos
│   └── router.js        # Sistema de enrutamiento
└── views/
    ├── LoginView.js      # Vista de login
    ├── DashboardView.js  # Panel de control
    ├── AdminView.js      # Panel de administración
    ├── PublicView.js     # Vista pública
    └── CourseView.js     # Vista de curso
```

## 🛠️ Instalación y Ejecución

### Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor HTTP local (Python, Node.js, PHP, Live Server)

### Pasos

1. **Clonar o descargar el proyecto**

```bash
git clone <url-del-repositorio>
cd proyecto_samuel
```

2. **Ejecutar servidor local**

**Opción 1: Python**
```bash
python -m http.server 8000
```

**Opción 2: Node.js**
```bash
npx http-server -p 8000
```

**Opción 3: PHP**
```bash
php -S localhost:8000
```

**Opción 4: Live Server (VS Code)**
- Instalar extensión "Live Server"
- Clic derecho en `index.html` → "Open with Live Server"

3. **Abrir en el navegador**

```
http://localhost:8000
```

## 🔐 Credenciales de Acceso

**Administrador por defecto:**
- Email: `admin@lms.com`
- Contraseña: `admin123`

## ✨ Características

- ✅ Autenticación de usuarios
- ✅ Gestión de cursos (CRUD)
- ✅ Gestión de módulos (CRUD)
- ✅ Gestión de lecciones (CRUD)
- ✅ Gestión de docentes (CRUD)
- ✅ Gestión de administrativos (CRUD)
- ✅ Dashboard con estadísticas
- ✅ Vista pública de cursos
- ✅ Diseño responsive
- ✅ Persistencia en localStorage

## 📝 Notas

- Los datos se almacenan en `localStorage` del navegador
- Requiere servidor HTTP para ejecutar (no funciona con `file://`)
- Los datos persisten entre sesiones en el mismo navegador
