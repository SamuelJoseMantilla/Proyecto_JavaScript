import { iniciarEnrutador } from './router.js';
import { sembrarAdministrador } from './services/auth.service.js';

sembrarAdministrador();
iniciarEnrutador();
if (!location.hash) location.hash = '#/login';
