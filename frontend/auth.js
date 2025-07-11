// ==========================================================================
// PIZZA MASTER TYCOON - AUTHENTICATION MODULE
// ==========================================================================

class PizzaAuth {
    constructor() {
        this.supabase = window.PIZZA_CONFIG.supabase;
        this.currentUser = null;
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Initialize authentication
     */
    async init() {
        try {
            console.log('🔐 Inicializando autenticação...');
            
            // Check current session
            const { data: { session } } = await this.supabase.auth.getSession();
            
            if (session) {
                console.log('✅ Sessão existente encontrada');
                await this.handleAuthSuccess(session);
            } else {
                console.log('📱 Nenhuma sessão ativa, aguardando login');
                this.showLoginScreen();
            }

            // Listen for auth state changes
            this.supabase.auth.onAuthStateChange(async (event, session) => {
                console.log('🔄 Auth state changed:', event);
                
                switch (event) {
                    case 'SIGNED_IN':
                        await this.handleAuthSuccess(session);
                        break;
                    case 'SIGNED_OUT':
                        this.handleSignOut();
                        break;
                    case 'TOKEN_REFRESHED':
                        console.log('🔄 Token refreshed');
                        break;
                }
            });

            this.isInitialized = true;
            console.log('✅ Autenticação inicializada');
        } catch (error) {
            console.error('❌ Erro ao inicializar autenticação:', error);
            this.showLoginScreen();
        }
    }

    /**
     * Login with Google
     */
    async loginWithGoogle() {
        try {
            console.log('🚀 Iniciando login com Google...');
            
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });

            if (error) {
                throw error;
            }

            console.log('🔄 Redirecionando para Google...');
            return data;
        } catch (error) {
            console.error('❌ Erro no login:', error);
            this.showError('Erro ao fazer login. Tente novamente.');
            throw error;
        }
    }

    /**
     * Handle successful authentication
     */
    async handleAuthSuccess(session) {
        try {
            console.log('🎉 Login realizado com sucesso!');
            
            const user = session.user;
            const userData = {
                id: user.id,
                email: user.email,
                username: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
                avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                provider: user.app_metadata?.provider
            };

            console.log('👤 Dados do usuário:', userData);

            // Save user data
            this.currentUser = userData;
            localStorage.setItem(window.PIZZA_CONFIG.UI_CONFIG.storage.userKey, JSON.stringify(userData));

            // Create/get user in backend
            try {
                const response = await window.pizzaAPI.createOrGetUser(userData);
                if (response.success) {
                    userData.gameData = response.data;
                    console.log('🎮 Dados do jogo carregados:', response.data);
                    
                    if (response.data.offline) {
                        this.showOfflineMessage();
                    }
                }
            } catch (error) {
                console.warn('⚠️ Erro ao carregar dados do jogo, usando fallback');
            }

            // Show game screen
            this.showGameScreen(userData);
            
        } catch (error) {
            console.error('❌ Erro ao processar login:', error);
            this.showError('Erro ao carregar dados do usuário.');
        }
    }

    /**
     * Handle sign out
     */
    async handleSignOut() {
        try {
            console.log('👋 Fazendo logout...');
            
            // Clear local data
            this.currentUser = null;
            localStorage.removeItem(window.PIZZA_CONFIG.UI_CONFIG.storage.userKey);
            localStorage.removeItem(window.PIZZA_CONFIG.UI_CONFIG.storage.gameDataKey);
            
            // Show login screen
            this.showLoginScreen();
            
            console.log('✅ Logout realizado');
        } catch (error) {
            console.error('❌ Erro no logout:', error);
        }
    }

    /**
     * Sign out
     */
    async signOut() {
        try {
            await this.supabase.auth.signOut();
        } catch (error) {
            console.error('❌ Erro ao fazer logout:', error);
            // Force logout locally
            this.handleSignOut();
        }
    }

    /**
     * Show login screen
     */
    showLoginScreen() {
        const loginScreen = document.getElementById('login-screen');
        const gameScreen = document.getElementById('game-screen');
        const loadingScreen = document.getElementById('loading-screen');
        
        if (loginScreen) loginScreen.classList.add('active');
        if (gameScreen) gameScreen.classList.remove('active');
        if (loadingScreen) loadingScreen.classList.remove('active');
    }

    /**
     * Show game screen
     */
    showGameScreen(userData) {
        const loginScreen = document.getElementById('login-screen');
        const gameScreen = document.getElementById('game-screen');
        const loadingScreen = document.getElementById('loading-screen');
        
        if (loginScreen) loginScreen.classList.remove('active');
        if (gameScreen) gameScreen.classList.add('active');
        if (loadingScreen) loadingScreen.classList.remove('active');

        // Initialize game with user data
        if (window.pizzaGame) {
            window.pizzaGame.initializeUser(userData);
        }
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.add('active');
    }

    /**
     * Show error message
     */
    showError(message) {
        // You can implement a proper toast/notification system here
        alert(message);
    }

    /**
     * Show offline message
     */
    showOfflineMessage() {
        console.log('📱 Modo offline ativo - dados salvos localmente');
        // You can implement a proper notification here
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Initialize authentication
window.pizzaAuth = new PizzaAuth();