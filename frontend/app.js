// ==========================================================================
// PIZZA MASTER TYCOON - MAIN APPLICATION
// ==========================================================================

class PizzaMasterTycoonApp {
    constructor() {
        this.isInitialized = false;
        this.version = '1.0.0';
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🍕 Iniciando Pizza Master Tycoon v' + this.version);
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.startApp();
                });
            } else {
                this.startApp();
            }
            
        } catch (error) {
            console.error('❌ Erro ao inicializar aplicação:', error);
            this.handleStartupError(error);
        }
    }

    /**
     * Start the application
     */
    async startApp() {
        try {
            console.log('🚀 Iniciando componentes da aplicação...');
            
            // Check if all required configs are loaded
            await this.waitForDependencies();
            
            // Initialize components in order
            await this.initializeComponents();
            
            // Check backend connectivity
            await this.checkBackendStatus();
            
            // Setup global error handlers
            this.setupErrorHandlers();
            
            // Setup service worker for offline functionality (optional)
            this.setupServiceWorker();
            
            this.isInitialized = true;
            console.log('✅ Pizza Master Tycoon carregado com sucesso!');
            
            // Hide loading screen after a short delay
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1500);
            
        } catch (error) {
            console.error('❌ Erro ao iniciar aplicação:', error);
            this.handleStartupError(error);
        }
    }

    /**
     * Wait for all dependencies to load
     */
    async waitForDependencies() {
        const maxAttempts = 50;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            if (window.PIZZA_CONFIG && 
                window.pizzaAPI && 
                window.pizzaAuth && 
                window.pizzaGame) {
                console.log('✅ Todas as dependências carregadas');
                return;
            }
            
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        throw new Error('Timeout: Dependências não carregaram a tempo');
    }

    /**
     * Initialize all components
     */
    async initializeComponents() {
        console.log('🔧 Inicializando componentes...');
        
        // API is already initialized in api.js
        console.log('✅ API inicializada');
        
        // Auth is already initialized in auth.js
        console.log('✅ Autenticação inicializada');
        
        // Game is already initialized in game.js
        console.log('✅ Jogo inicializado');
        
        // Initialize UI components
        this.initializeUI();
        console.log('✅ Interface inicializada');
    }

    /**
     * Initialize UI components
     */
    initializeUI() {
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Setup responsive handlers
        this.setupResponsiveHandlers();
        
        // Setup theme switching (if needed in future)
        this.setupThemeHandlers();
        
        // Setup analytics (if needed)
        this.setupAnalytics();
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Only handle shortcuts if user is authenticated and not in input field
            if (!window.pizzaAuth?.isAuthenticated() || 
                event.target.tagName === 'INPUT' || 
                event.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (event.code) {
                case 'Space':
                    event.preventDefault();
                    if (window.pizzaGame) {
                        window.pizzaGame.sellPizza();
                    }
                    break;
                    
                case 'KeyQ':
                    event.preventDefault();
                    if (window.pizzaGame) {
                        window.pizzaGame.quickSell();
                    }
                    break;
                    
                case 'Digit1':
                    event.preventDefault();
                    if (window.pizzaGame) {
                        window.pizzaGame.switchTab('kitchen');
                    }
                    break;
                    
                case 'Digit2':
                    event.preventDefault();
                    if (window.pizzaGame) {
                        window.pizzaGame.switchTab('shop');
                    }
                    break;
                    
                case 'Digit3':
                    event.preventDefault();
                    if (window.pizzaGame) {
                        window.pizzaGame.switchTab('profile');
                    }
                    break;
            }
        });
    }

    /**
     * Setup responsive handlers
     */
    setupResponsiveHandlers() {
        // Handle orientation changes on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleWindowResize();
            }, 250);
        });
    }

    /**
     * Handle orientation change
     */
    handleOrientationChange() {
        // Force layout recalculation
        document.body.style.height = '100vh';
        setTimeout(() => {
            document.body.style.height = '';
        }, 500);
    }

    /**
     * Handle window resize
     */
    handleWindowResize() {
        // Update CSS custom properties for viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    /**
     * Setup theme handlers
     */
    setupThemeHandlers() {
        // Handle system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                console.log('🎨 Tema do sistema alterado:', e.matches ? 'dark' : 'light');
                // Future: implement theme switching
            });
        }
    }

    /**
     * Setup analytics
     */
    setupAnalytics() {
        // Track page load
        console.log('📊 App carregado em:', new Date().toISOString());
        
        // Track errors
        window.addEventListener('error', (event) => {
            console.error('📊 Erro trackado:', event.error);
        });
        
        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('📊 Promise rejeitada:', event.reason);
        });
    }

    /**
     * Check backend connectivity
     */
    async checkBackendStatus() {
        try {
            console.log('🌐 Verificando conectividade com backend...');
            
            const health = await window.pizzaAPI.healthCheck();
            
            if (health.success) {
                console.log('✅ Backend conectado');
                this.showBackendStatus(true);
            } else {
                console.log('⚠️ Backend indisponível, modo offline ativo');
                this.showBackendStatus(false);
            }
        } catch (error) {
            console.warn('⚠️ Erro ao verificar backend:', error);
            this.showBackendStatus(false);
        }
    }

    /**
     * Show backend status
     */
    showBackendStatus(isOnline) {
        // Future: implement status indicator in UI
        if (isOnline) {
            document.body.classList.remove('offline-mode');
        } else {
            document.body.classList.add('offline-mode');
        }
    }

    /**
     * Setup service worker
     */
    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                // Future: implement service worker for offline functionality
                console.log('📱 Service Worker não implementado ainda');
            } catch (error) {
                console.warn('⚠️ Erro ao registrar Service Worker:', error);
            }
        }
    }

    /**
     * Setup global error handlers
     */
    setupErrorHandlers() {
        // Handle global errors
        window.addEventListener('error', (event) => {
            console.error('🚨 Erro global:', event.error);
            this.handleGlobalError(event.error);
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Promise rejeitada:', event.reason);
            this.handleGlobalError(event.reason);
            event.preventDefault();
        });
    }

    /**
     * Handle global errors
     */
    handleGlobalError(error) {
        // Don't show errors for network issues or auth timeouts
        if (error?.message?.includes('NetworkError') || 
            error?.message?.includes('fetch')) {
            return;
        }

        // Show user-friendly error message
        console.error('💥 Erro na aplicação:', error);
        
        // Future: implement proper error reporting
    }

    /**
     * Handle startup errors
     */
    handleStartupError(error) {
        console.error('💥 Erro crítico na inicialização:', error);
        
        // Show fallback UI
        this.showErrorScreen(error);
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('active');
        }
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
        }
    }

    /**
     * Show error screen
     */
    showErrorScreen(error) {
        // Hide loading screen
        this.hideLoadingScreen();
        
        // Show error message
        const body = document.body;
        body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                padding: 2rem;
                text-align: center;
                background: linear-gradient(135deg, #1a0b2e, #7b2cbf);
                color: white;
                font-family: 'Roboto', sans-serif;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🍕</div>
                <h1 style="margin-bottom: 1rem;">Ops! Algo deu errado</h1>
                <p style="margin-bottom: 2rem; opacity: 0.8;">
                    Não foi possível carregar o Pizza Master Tycoon.
                </p>
                <button onclick="window.location.reload()" style="
                    background: linear-gradient(135deg, #ffb700, #ff8500);
                    color: #000;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                ">
                    Tentar Novamente
                </button>
                <details style="margin-top: 2rem; opacity: 0.6;">
                    <summary style="cursor: pointer;">Detalhes do erro</summary>
                    <pre style="
                        text-align: left;
                        background: rgba(0,0,0,0.3);
                        padding: 1rem;
                        border-radius: 0.5rem;
                        margin-top: 1rem;
                        overflow: auto;
                        max-width: 90vw;
                        font-size: 0.8rem;
                    ">${error?.stack || error?.message || error}</pre>
                </details>
            </div>
        `;
    }

    /**
     * Get app info
     */
    getInfo() {
        return {
            version: this.version,
            isInitialized: this.isInitialized,
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize the application
const pizzaApp = new PizzaMasterTycoonApp();

// Make app available globally for debugging
window.pizzaApp = pizzaApp;

// Log app info
console.log('🍕 Pizza Master Tycoon', pizzaApp.getInfo());