// ==========================================================================
// PIZZA MASTER TYCOON - API MODULE
// ==========================================================================

class PizzaAPI {
    constructor() {
        this.baseUrl = window.PIZZA_CONFIG.API_CONFIG.baseUrl;
        this.endpoints = window.PIZZA_CONFIG.API_CONFIG.endpoints;
    }

    /**
     * Generic API request method
     */
    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };

            console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
            
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`✅ API Response:`, data);
            
            return data;
        } catch (error) {
            console.error(`❌ API Error (${endpoint}):`, error);
            throw error;
        }
    }

    /**
     * Health check endpoint
     */
    async healthCheck() {
        try {
            return await this.request(this.endpoints.health);
        } catch (error) {
            console.warn('⚠️ Backend não disponível, usando modo offline');
            return { success: false, offline: true };
        }
    }

    /**
     * Create or get user data
     */
    async createOrGetUser(userData) {
        try {
            return await this.request(this.endpoints.createUser, {
                method: 'POST',
                body: JSON.stringify({
                    id: userData.id,
                    username: userData.username,
                    email: userData.email
                })
            });
        } catch (error) {
            // Fallback para modo offline
            console.warn('🔄 Fallback: Usando dados locais');
            return {
                success: true,
                data: {
                    user_id: userData.id,
                    username: userData.username,
                    email: userData.email,
                    saldo: parseInt(localStorage.getItem('pizza_saldo') || '100'),
                    xp: parseInt(localStorage.getItem('pizza_xp') || '0'),
                    nivel: parseInt(localStorage.getItem('pizza_nivel') || '1'),
                    offline: true
                }
            };
        }
    }

    /**
     * Finish game and update user stats
     */
    async finishGame(userId, coins, xp) {
        try {
            return await this.request(this.endpoints.finishGame, {
                method: 'POST',
                body: JSON.stringify({
                    user_id: userId,
                    moedas: coins,
                    xp: xp
                })
            });
        } catch (error) {
            // Fallback para modo offline
            console.warn('🔄 Fallback: Salvando dados localmente');
            
            const currentBalance = parseInt(localStorage.getItem('pizza_saldo') || '100');
            const currentXp = parseInt(localStorage.getItem('pizza_xp') || '0');
            const currentLevel = parseInt(localStorage.getItem('pizza_nivel') || '1');
            
            const newBalance = currentBalance + coins;
            let newXp = currentXp + xp;
            let newLevel = currentLevel;
            let levelUp = false;

            // Level up logic
            const xpPerLevel = window.PIZZA_CONFIG.GAME_CONFIG.xpPerLevel;
            while (newXp >= newLevel * xpPerLevel) {
                newXp -= newLevel * xpPerLevel;
                newLevel++;
                levelUp = true;
            }

            // Save to localStorage
            localStorage.setItem('pizza_saldo', newBalance.toString());
            localStorage.setItem('pizza_xp', newXp.toString());
            localStorage.setItem('pizza_nivel', newLevel.toString());

            return {
                success: true,
                data: {
                    user_id: userId,
                    saldo: newBalance,
                    xp: newXp,
                    nivel: newLevel
                },
                level_up: levelUp,
                offline: true
            };
        }
    }

    /**
     * Get user data by ID
     */
    async getUser(userId) {
        try {
            return await this.request(`${this.endpoints.getUser}/${userId}`);
        } catch (error) {
            // Fallback para modo offline
            return {
                success: true,
                data: {
                    user_id: userId,
                    saldo: parseInt(localStorage.getItem('pizza_saldo') || '100'),
                    xp: parseInt(localStorage.getItem('pizza_xp') || '0'),
                    nivel: parseInt(localStorage.getItem('pizza_nivel') || '1'),
                    offline: true
                }
            };
        }
    }
}

// Initialize API instance
window.pizzaAPI = new PizzaAPI();