import { obtener, guardar, eliminar } from './storage.service.js';

const CLAVE_USUARIOS = 'abc.usuarios';
const CLAVE_SESION  = 'abc.sesion';

export function sembrarAdministrador() {
  // si no hay usuarios, insertar uno:
  // { id:1, nombres:'Admin', apellidos:'ABC', correo:'admin@abc.edu', contrasena:'Admin123*', rol:'admin' }
  // guardar en CLAVE_USUARIOS
}

export function iniciarSesion(correo, contrasena) {
  // buscar en usuarios: coincide correo y contrasena y rol === 'admin'
  // si no existe → throw new Error('Credenciales inválidas o no es administrador.');
  // si existe → guardar(CLAVE_SESION, {correo, rol, nombres, apellidos})
}

export function cerrarSesion() {
  // eliminar(CLAVE_SESION)
}

export function haySesionActiva() {
  // retorna boolean leyendo CLAVE_SESION
}

export function usuarioActual() {
  // retorna objeto sesión o null
}
