/**
 * Componente Modal Reutilizable
 * Custom Element: modal-component
 */

class ModalComponent extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    static get observedAttributes() {
        return ['open'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'open') {
            this.isOpen = newValue !== null;
            this.updateDisplay();
        }
    }

    render() {
        this.innerHTML = `
            <div class="modal-overlay" id="modal-overlay">
                <div class="modal-content" id="modal-content">
                    <button class="modal-close" id="modal-close">&times;</button>
                    <div class="modal-body" id="modal-body">
                        <!-- Contenido del modal se insertará aquí -->
                    </div>
                </div>
            </div>
        `;
        this.style.display = 'none';
    }

    setupEventListeners() {
        const overlay = this.querySelector('#modal-overlay');
        const closeBtn = this.querySelector('#modal-close');

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close();
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.close();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        this.setAttribute('open', '');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.removeAttribute('open');
        this.isOpen = false;
        document.body.style.overflow = '';
        this.dispatchEvent(new CustomEvent('modal-closed'));
    }

    updateDisplay() {
        this.style.display = this.isOpen ? 'block' : 'none';
    }

    setContent(html) {
        const body = this.querySelector('#modal-body');
        if (body) {
            body.innerHTML = html;
        }
    }
}

customElements.define('modal-component', ModalComponent);
export default ModalComponent;

