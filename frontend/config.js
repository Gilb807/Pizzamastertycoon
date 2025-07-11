// ==========================================================================
// PIZZA MASTER TYCOON - CONFIGURAÇÃO GLOBAL
// ==========================================================================

// 1. Configuração do Supabase
const SUPABASE_CONFIG = {
    url: 'https://otujulkbkccsxuknkung.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dWp1bGtia2Njc3h1a25rdW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTI3MzIsImV4cCI6MjA2Nzc2ODczMn0.MSHdM3AWZ0SMyJwjeMBAMLeUJYSy4I_nqpSy02vDhm4'
};

// 2. Configuração da API (ajustada para produção)
const API_CONFIG = {
    baseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000' // Ambiente de desenvolvimento
        : 'https://pizzamastertycoon-backend.vercel.app', // 🔁 Substitua pelo domínio correto do backend na Vercel

    endpoints: {
        createUser: '/api/user',
        finishGame: '/api/game/finish',
        getUser: '/api/user',
        health: '/api/health'
    }
};

// 3. Configuração do Jogo
const GAME_CONFIG = {
    rewards: {
        sellPizza: {
            coins: 10,
            xp: 20
        },
        levelBonus: 100
    },
    xpPerLevel: 100,
    quickSellMultiplier: 10
};

// 4. Configurações de UI
const UI_CONFIG = {
    animations: {
        fadeInDuration: 300,
        modalDuration: 400,
        successDelay: 1500
    },
    storage: {
        userKey: 'pizza_master_user',
        gameDataKey: 'pizza_master_game_data'
    }
};

// 5. Inicializar o cliente do Supabase
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// 6. Tornar configurações acessíveis globalmente no projeto
window.PIZZA_CONFIG = {
    SUPABASE_CONFIG,
    API_CONFIG,
    GAME_CONFIG,
    UI_CONFIG,
    supabase
};
