// ==========================================================================
// PIZZA MASTER TYCOON - CONFIGURATION
// ==========================================================================

// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'https://otujulkbkccsxuknkung.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dWp1bGtia2Njc3h1a25rdW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTI3MzIsImV4cCI6MjA2Nzc2ODczMn0.MSHdM3AWZ0SMyJwjeMBAMLeUJYSy4I_nqpSy02vDhm4'
};

// API Configuration
const API_CONFIG = {
    baseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : '', // Produção usa mesmo domínio
    endpoints: {
        createUser: '/api/user',
        finishGame: '/api/game/finish',
        getUser: '/api/user',
        health: '/api/health'
    }
};

// Game Configuration
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

// UI Configuration
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

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Make configurations available globally
window.PIZZA_CONFIG = {
    SUPABASE_CONFIG,
    API_CONFIG,
    GAME_CONFIG,
    UI_CONFIG,
    supabase
};