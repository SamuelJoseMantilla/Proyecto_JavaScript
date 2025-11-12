// nombres de clave con prefijo "abc."
const PREFIJO = 'abc.';

export function guardar(clave, valor ){
    try{
        localStorage.setItem(clave, JSON.stringify(valor));
    } catch (error){
        console.error('Error al guardar en localstorage:', error);
    }
x}

export function obtener(clave, valor =null) {
  // JSON.stringify a localStorage
}

export function eliminar(clave) {
  // removeItem
}
