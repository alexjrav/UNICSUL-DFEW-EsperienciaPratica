// Gerenciador de temas e acessibilidade
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.fontSize = parseInt(localStorage.getItem('fontSize')) || 16;
        this.setupTheme();
        this.createAccessibilityBar();
    }

    // Configurar tema inicial
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        document.documentElement.style.fontSize = `${this.fontSize}px`;
    }

    // Trocar tema
    toggleTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Ajustar tamanho da fonte
    adjustFontSize(increase) {
        this.fontSize = this.fontSize + (increase ? 2 : -2);
        this.fontSize = Math.min(Math.max(this.fontSize, 14), 24); // Limitar entre 14px e 24px
        document.documentElement.style.fontSize = `${this.fontSize}px`;
        localStorage.setItem('fontSize', this.fontSize.toString());
    }

    // Criar barra de acessibilidade
    createAccessibilityBar() {
        const bar = document.createElement('div');
        bar.className = 'accessibility-bar';
        bar.setAttribute('role', 'toolbar');
        bar.setAttribute('aria-label', 'Barra de acessibilidade');

        const controls = [
            {
                label: '🌞 Tema Claro',
                action: () => this.toggleTheme('light'),
                ariaLabel: 'Ativar tema claro'
            },
            {
                label: '🌑 Tema Escuro',
                action: () => this.toggleTheme('dark'),
                ariaLabel: 'Ativar tema escuro'
            },
            {
                label: '👁️ Alto Contraste',
                action: () => this.toggleTheme('high-contrast'),
                ariaLabel: 'Ativar modo alto contraste'
            },
            {
                label: 'A+',
                action: () => this.adjustFontSize(true),
                ariaLabel: 'Aumentar tamanho da fonte'
            },
            {
                label: 'A-',
                action: () => this.adjustFontSize(false),
                ariaLabel: 'Diminuir tamanho da fonte'
            }
        ];

        controls.forEach(control => {
            const button = document.createElement('button');
            button.textContent = control.label;
            button.className = 'accessibility-button';
            button.setAttribute('aria-label', control.ariaLabel);
            button.addEventListener('click', control.action);
            bar.appendChild(button);
        });

        // Adicionar barra ao topo da página
        document.body.insertBefore(bar, document.body.firstChild);
    }
}

// Inicializar gerenciador de temas
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();

    // Adicionar roles e aria-labels em elementos importantes
    document.querySelectorAll('nav').forEach(nav => {
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Menu principal');
    });

    document.querySelectorAll('main').forEach(main => {
        main.setAttribute('role', 'main');
    });

    document.querySelectorAll('section').forEach(section => {
        section.setAttribute('role', 'region');
        if (section.querySelector('h2')) {
            section.setAttribute('aria-labelledby', section.querySelector('h2').id);
        }
    });

    document.querySelectorAll('img').forEach(img => {
        if (!img.getAttribute('alt')) {
            img.setAttribute('alt', ''); // Imagens decorativas
            img.setAttribute('role', 'presentation');
        }
    });

    // Adicionar skip link para conteúdo principal
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Pular para o conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
});