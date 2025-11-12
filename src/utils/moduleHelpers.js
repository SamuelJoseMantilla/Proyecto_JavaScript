/**
 * Funciones Auxiliares para Módulos
 */

export function getModules(cursos) {
    const modules = [];
    cursos.forEach(curso => {
        if (curso.modulos && Array.isArray(curso.modulos)) {
            modules.push(...curso.modulos);
        }
    });
    return modules;
}

