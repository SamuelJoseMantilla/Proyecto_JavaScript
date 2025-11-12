/**
 * Gestión de Almacenamiento Local
 * Utilidades para trabajar con localStorage
 */

export function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error al guardar datos:', error);
        return false;
    }
}

export function getData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error al obtener datos:', error);
        return null;
    }
}

export function deleteData(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error al eliminar datos:', error);
        return false;
    }
}

export async function initializeData() {
    let appData = getData('app-data');
    
    // Si no hay datos, crear nuevos
    if (!appData) {
        try {
            const { getInitialData } = await import('../data/seedData.js');
            const initialData = getInitialData();
            saveData('app-data', initialData);
            return initialData;
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            const initialData = {
                docentes: [],
                cursos: [],
                administrativos: [],
                credenciales: []
            };
            saveData('app-data', initialData);
            return initialData;
        }
    }
    
    // Si hay datos pero tienen el email antiguo, actualizarlos
    const needsUpdate = appData.credenciales && appData.credenciales.some(c => 
        c.email === 'admin@abc.edu'
    );
    
    if (needsUpdate) {
        console.log('Actualizando datos con email antiguo...');
        try {
            const { getInitialData } = await import('../data/seedData.js');
            const newData = getInitialData();
            
            // Preservar datos existentes (cursos, docentes, etc.) pero actualizar credenciales y administrativos
            appData.credenciales = newData.credenciales;
            appData.administrativos = newData.administrativos;
            
            saveData('app-data', appData);
            console.log('Datos actualizados correctamente');
            return appData;
        } catch (error) {
            console.error('Error al actualizar datos:', error);
        }
    }
    
    return appData;
}

export function loadData() {
    return getData('app-data') || { docentes: [], cursos: [], administrativos: [], credenciales: [] };
}
