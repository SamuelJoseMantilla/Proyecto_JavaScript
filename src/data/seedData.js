/**
 * Datos Semilla del Sistema
 * Datos iniciales que se cargan cuando la aplicación se inicia por primera vez
 */

export function getInitialData() {
    return {
        docentes: [
            {
                id: 'docente-1',
                codigo: 'PROF001',
                identificacion: '1098765432',
                nombres: 'María',
                apellidos: 'González Pérez',
                email: 'maria.gonzalez@abc.edu',
                fotoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
                areaAcademica: 'Matemáticas'
            },
            {
                id: 'docente-2',
                codigo: 'PROF002',
                identificacion: '1098765433',
                nombres: 'Carlos',
                apellidos: 'Rodríguez Martínez',
                email: 'carlos.rodriguez@abc.edu',
                fotoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
                areaAcademica: 'Ciencias'
            }
        ],
        cursos: [
            {
                id: 'curso-1',
                codigo: 'MAT101',
                nombre: 'Álgebra Básica',
                descripcion: 'Curso introductorio de álgebra que cubre los conceptos fundamentales de ecuaciones, polinomios y funciones.',
                docenteId: 'docente-1',
                modulos: [
                    {
                        id: 'modulo-1',
                        codigo: 'MOD001',
                        nombre: 'Introducción al Álgebra',
                        descripcion: 'Conceptos básicos y fundamentos del álgebra',
                        lecciones: [
                            {
                                id: 'leccion-1',
                                titulo: 'Variables y Expresiones',
                                tipo: 'lectura',
                                intensidadHoraria: 2,
                                contenido: 'Introducción a las variables y expresiones algebraicas básicas.',
                                recursosAdicionales: []
                            },
                            {
                                id: 'leccion-2',
                                titulo: 'Ecuaciones Lineales',
                                tipo: 'video',
                                intensidadHoraria: 3,
                                contenido: 'Resolución de ecuaciones lineales de primer grado.',
                                videoUrl: 'https://www.youtube.com/watch?v=example1',
                                recursosAdicionales: []
                            }
                        ]
                    }
                ]
            }
        ],
        administrativos: [
            {
                id: 'admin-1',
                identificacion: '1234567890',
                nombres: 'Administrador',
                apellidos: 'Principal',
                email: 'admin@lms.com',
                telefono: '1234567890',
                cargo: 'Administrador'
            }
        ],
        credenciales: [
            {
                id: 'cred-1',
                email: 'admin@lms.com',
                password: 'admin123',
                rol: 'admin'
            }
        ]
    };
}

