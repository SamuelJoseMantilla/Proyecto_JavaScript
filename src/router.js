import './components/view-login.js';
import './components/view-dashboard.js';
import { haySesionActiva } from './services/auth.service.js';

const rutas = {
  '#/login': () => '<view-login></view-login>',
  '#/dashboard': () => haySesionActiva() ? '<view-dashboard></view-dashboard>' : redirigirLogin(),
};

function redirigirLogin() {
  location.hash = '#/login';
  return '';
}

export function iniciarEnrutador() {
  const raiz = document.getElementById('app');
  function renderizar() {
    const plantilla = rutas[location.hash] || rutas['#/login'];
    raiz.innerHTML = plantilla();
  }
  window.addEventListener('hashchange', renderizar);
  renderizar();
}
