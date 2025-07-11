// ==========================================================================
// PIZZA MASTER TYCOON - GAME MODULE
// ==========================================================================

class PizzaGame {
    constructor() {
        this.userData = null;
        this.gameData = {
            saldo: 100,
            xp: 0,
            nivel: 1,
            pizzasVendidas: 0,
            diasJogando: 1
        };
        this.currentTab = 'kitchen';
        this.isProcessing = false;
        
        this.init();
    }

    /**
     * Initialize game
     */
    init() {
        console.log('🎮 Inicializando Pizza Master Tycoon...');
        this.setupEventListeners();
        this.setupTabNavigation();
    }

    /**
     * Initialize user data
     */
    initializeUser(userData) {
        console.log('👤 Inicializando dados do usuário:', userData);
        
        this.userData = userData;
        
        // Load game data from backend or localStorage
        if (userData.gameData) {
            this.gameData = {
                saldo: userData.gameData.saldo || 100,
                xp: userData.gameData.xp || 0,
                nivel: userData.gameData.nivel || 1,
                pizzasVendidas: parseInt(localStorage.getItem('pizza_pizzas_vendidas') || '0'),
                diasJogando: parseInt(localStorage.getItem('pizza_dias_jogando') || '1')
            };
        }

        this.updateUI();
        this.updateXPBar();
        
        console.log('✅ Usuário inicializado:', this.gameData);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Login button
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                window.pizzaAuth.loginWithGoogle();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.pizzaAuth.signOut();
            });
        }

        // Sell pizza button
        const sellPizzaBtn = document.getElementById('sell-pizza-btn');
        if (sellPizzaBtn) {
            sellPizzaBtn.addEventListener('click', () => {
                this.sellPizza();
            });
        }

        // Quick sell button
        const quickSellBtn = document.getElementById('quick-sell-btn');
        if (quickSellBtn) {
            quickSellBtn.addEventListener('click', () => {
                this.quickSell();
            });
        }

        // Pizza animation click
        const pizzaAnimation = document.querySelector('.pizza-animation');
        if (pizzaAnimation) {
            pizzaAnimation.addEventListener('click', () => {
                this.sellPizza();
            });
        }

        // Modal close buttons
        const modalClose = document.getElementById('modal-close');
        const levelupClose = document.getElementById('levelup-close');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.hideModal('success-modal');
            });
        }
        
        if (levelupClose) {
            levelupClose.addEventListener('click', () => {
                this.hideModal('levelup-modal');
            });
        }
    }

    /**
     * Setup tab navigation
     */
    setupTabNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    /**
     * Switch between tabs
     */
    switchTab(tabName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;
    }

    /**
     * Sell a pizza
     */
    async sellPizza() {
        if (this.isProcessing) return;
        
        try {
            this.isProcessing = true;
            
            const rewards = window.PIZZA_CONFIG.GAME_CONFIG.rewards.sellPizza;
            
            console.log('🍕 Vendendo pizza...', rewards);
            
            // Animate pizza
            this.animatePizzaSale();
            
            // Send to backend
            const response = await window.pizzaAPI.finishGame(
                this.userData.id,
                rewards.coins,
                rewards.xp
            );

            if (response.success) {
                // Update local data
                this.gameData.saldo = response.data.saldo;
                this.gameData.xp = response.data.xp;
                this.gameData.nivel = response.data.nivel;
                this.gameData.pizzasVendidas++;
                
                // Save additional stats
                localStorage.setItem('pizza_pizzas_vendidas', this.gameData.pizzasVendidas.toString());
                
                // Update UI
                this.updateUI();
                this.updateXPBar();
                
                // Show success modal
                this.showSuccessModal(`Você vendeu uma pizza!`, `+${rewards.coins} CLBC • +${rewards.xp} XP`);
                
                // Check for level up
                if (response.level_up) {
                    setTimeout(() => {
                        this.showLevelUpModal(this.gameData.nivel);
                    }, 1000);
                }
                
                console.log('✅ Pizza vendida com sucesso!');
            }
        } catch (error) {
            console.error('❌ Erro ao vender pizza:', error);
            this.showError('Erro ao vender pizza. Tente novamente.');
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Quick sell multiple pizzas
     */
    async quickSell() {
        if (this.isProcessing) return;
        
        const multiplier = window.PIZZA_CONFIG.GAME_CONFIG.quickSellMultiplier;
        const rewards = window.PIZZA_CONFIG.GAME_CONFIG.rewards.sellPizza;
        
        try {
            this.isProcessing = true;
            
            console.log(`🚀 Quick sell: ${multiplier} pizzas`);
            
            // Send to backend
            const response = await window.pizzaAPI.finishGame(
                this.userData.id,
                rewards.coins * multiplier,
                rewards.xp * multiplier
            );

            if (response.success) {
                // Update local data
                this.gameData.saldo = response.data.saldo;
                this.gameData.xp = response.data.xp;
                this.gameData.nivel = response.data.nivel;
                this.gameData.pizzasVendidas += multiplier;
                
                // Save additional stats
                localStorage.setItem('pizza_pizzas_vendidas', this.gameData.pizzasVendidas.toString());
                
                // Update UI
                this.updateUI();
                this.updateXPBar();
                
                // Show success modal
                this.showSuccessModal(
                    `Você vendeu ${multiplier} pizzas!`,
                    `+${rewards.coins * multiplier} CLBC • +${rewards.xp * multiplier} XP`
                );
                
                // Check for level up
                if (response.level_up) {
                    setTimeout(() => {
                        this.showLevelUpModal(this.gameData.nivel);
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('❌ Erro no quick sell:', error);
            this.showError('Erro ao vender pizzas. Tente novamente.');
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Update UI elements
     */
    updateUI() {
        // Header stats
        this.updateElement('username', this.userData?.username || 'Chef');
        this.updateElement('user-level', this.gameData.nivel);
        this.updateElement('user-balance', this.gameData.saldo);
        this.updateElement('user-xp', this.gameData.xp);

        // Profile tab
        this.updateElement('profile-username', this.userData?.username || 'Chef');
        this.updateElement('profile-email', this.userData?.email || 'chef@pizza.com');
        this.updateElement('profile-level', this.gameData.nivel);
        this.updateElement('profile-balance', this.gameData.saldo);
        this.updateElement('pizzas-sold', this.gameData.pizzasVendidas);
        this.updateElement('days-played', this.gameData.diasJogando);

        // Avatar images
        if (this.userData?.avatar) {
            const avatars = document.querySelectorAll('#user-avatar, #profile-avatar');
            avatars.forEach(avatar => {
                avatar.src = this.userData.avatar;
            });
        }
    }

    /**
     * Update XP bar
     */
    updateXPBar() {
        const xpPerLevel = window.PIZZA_CONFIG.GAME_CONFIG.xpPerLevel;
        const maxXp = this.gameData.nivel * xpPerLevel;
        const progress = (this.gameData.xp / maxXp) * 100;

        const xpFill = document.getElementById('xp-progress');
        const currentXpSpan = document.getElementById('current-xp');
        const maxXpSpan = document.getElementById('max-xp');

        if (xpFill) xpFill.style.width = `${progress}%`;
        if (currentXpSpan) currentXpSpan.textContent = this.gameData.xp;
        if (maxXpSpan) maxXpSpan.textContent = maxXp;
    }

    /**
     * Helper to update element text
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Animate pizza sale
     */
    animatePizzaSale() {
        const pizzaElement = document.querySelector('.pizza-animation');
        if (pizzaElement) {
            pizzaElement.classList.add('success-animation');
            setTimeout(() => {
                pizzaElement.classList.remove('success-animation');
            }, 600);
        }
    }

    /**
     * Show success modal
     */
    showSuccessModal(title, message) {
        const modal = document.getElementById('success-modal');
        const titleElement = document.getElementById('modal-title');
        const messageElement = document.getElementById('modal-message');

        if (titleElement) titleElement.textContent = title;
        if (messageElement) messageElement.textContent = message;

        this.showModal('success-modal');
    }

    /**
     * Show level up modal
     */
    showLevelUpModal(newLevel) {
        const modal = document.getElementById('levelup-modal');
        const levelElement = document.getElementById('new-level');

        if (levelElement) levelElement.textContent = newLevel;

        this.showModal('levelup-modal');
        
        // Add bonus coins for level up
        const bonus = window.PIZZA_CONFIG.GAME_CONFIG.rewards.levelBonus;
        this.gameData.saldo += bonus;
        this.updateUI();
    }

    /**
     * Show modal
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    /**
     * Hide modal
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        // Simple alert for now - you can implement a proper toast system
        alert(message);
    }

    /**
     * Get current game data
     */
    getGameData() {
        return { ...this.gameData };
    }

    /**
     * Get current user data
     */
    getUserData() {
        return { ...this.userData };
    }
}

// Initialize game
window.pizzaGame = new PizzaGame();