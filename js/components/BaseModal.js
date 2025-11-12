import Styles from '../core/Styles.js';

class BaseModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const styles = Styles.getInlineStyles();
        this.shadowRoot.innerHTML = `
            ${styles}
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                :host([open]) {
                    display: flex;
                }
            </style>
            <div class="modal-wrapper" id="modal-wrapper">
                <div id="modal-content"></div>
            </div>
        `;
    }

    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.setAttribute('open', '');
        document.body.style.overflow = 'hidden';
        
        // Cerrar con Escape
        this.escapeHandler = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);
        
        // Cerrar al hacer click fuera
        this.overlayHandler = (e) => {
            if (e.target === this) {
                this.close();
            }
        };
        this.addEventListener('click', this.overlayHandler);
    }

    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.removeAttribute('open');
        document.body.style.overflow = '';
        
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }
        
        if (this.overlayHandler) {
            this.removeEventListener('click', this.overlayHandler);
            this.overlayHandler = null;
        }
        
        this.dispatchEvent(new CustomEvent('modal-closed', {
            bubbles: true,
            composed: true
        }));
    }

    getModalContent() {
        return this.shadowRoot.getElementById('modal-content');
    }

    getModalWrapper() {
        return this.shadowRoot.getElementById('modal-wrapper');
    }

    setLarge() {
        const wrapper = this.getModalWrapper();
        if (wrapper) {
            wrapper.classList.add('large');
        }
    }
}

customElements.define('base-modal', BaseModal);
export default BaseModal;
