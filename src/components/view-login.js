class VistaLogin extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="text-align:center; padding:40px;">
        <h2>Ingresar como Administrador</h2>
        <form>
          <input type="email" placeholder="Correo" required><br><br>
          <input type="password" placeholder="Contraseña" required><br><br>
          <button type="submit">Entrar</button>
        </form>
      </div>
    `;
  }
}

customElements.define('view-login', VistaLogin);
