# 🍕 Pizza Master Tycoon - Project Analysis

## Project Overview

**Pizza Master Tycoon** is a web-based pizza restaurant management game developed in Portuguese Brazilian. It's a simple tycoon-style game where players manage a pizzeria, sell pizzas, and earn virtual currency called "CalabrinCoins" (CLBC).

## Technical Architecture

### Backend (Python Flask)
- **Framework**: Flask with Flask-CORS for cross-origin requests
- **Database**: In-memory storage (dictionary-based) for development/demo
- **Authentication**: Integrated with Supabase for GitHub OAuth
- **API Endpoints**:
  - `POST /api/user` - Create or retrieve user data
  - `POST /api/game/finish` - Process game completion (add coins/XP)
  - `GET /api/user/<user_id>` - Get user information

### Frontend (HTML/CSS/JavaScript)
- **Authentication**: Supabase GitHub OAuth integration
- **UI Framework**: Custom CSS with responsive design
- **State Management**: Client-side JavaScript with local user data
- **Styling**: Modern, pizza-themed design with orange/red color scheme

### Database Schema (In-Memory)
```json
{
  "user_id": {
    "username": "string",
    "saldo": "number (CLBC balance)",
    "xp": "number (experience points)",
    "nivel": "number (player level)",
    "created_at": "ISO timestamp"
  }
}
```

## Game Mechanics

### Core Gameplay Loop
1. **Login**: Players authenticate via GitHub OAuth
2. **Sell Pizzas**: Click button to sell pizza (+10 CLBC, +20 XP)
3. **Level Up**: When XP reaches `level * 100`, player levels up and XP resets
4. **Currency System**: CalabrinCoins (CLBC) as virtual currency

### Progression System
- **Starting Stats**: 100 CLBC, 0 XP, Level 1
- **XP Requirements**: Level * 100 XP needed for next level
- **Rewards**: 10 CLBC + 20 XP per pizza sold

## User Interface Sections

### 1. Authentication
- GitHub OAuth login button
- Powered by Supabase authentication

### 2. Game Area
- Welcome message with username
- Current balance and XP display
- "Sell Pizza" action button

### 3. Navigation Sections
- **Jogo** (Game): Pizza creation/selling interface
- **Loja** (Shop): CLBC purchase interface (placeholder)
- **Carteira** (Wallet): Balance and XP overview
- **Perfil** (Profile): User stats and level progression

## Technical Features

### Authentication Flow
```javascript
// GitHub OAuth via Supabase
supabaseClient.auth.signInWithOAuth({ provider: 'github' })

// Auth state monitoring
supabaseClient.auth.onAuthStateChange((event, session) => {
  // Handle login/logout events
})
```

### Game State Management
- Client-side user data object
- Real-time UI updates
- Session persistence via Supabase auth

### API Integration
- Flask backend serves user management endpoints
- CORS enabled for frontend communication
- JSON-based request/response format

## Current Limitations & Development Notes

### Backend
- **In-Memory Storage**: Data doesn't persist between server restarts
- **No Validation**: Limited input validation on API endpoints
- **Security**: Exposed in development mode, needs production configuration

### Frontend
- **Shop Functionality**: Not fully implemented (placeholder buttons)
- **Game Mechanics**: Very basic - only pizza selling implemented
- **Error Handling**: Minimal error handling for API failures

### Configuration
- **Supabase Keys**: Hardcoded in client-side code (should be environment variables)
- **CORS**: Wide open for development

## Dependencies

### Python (requirements.txt)
```
flask
flask-cors
```

### Frontend
- Supabase JavaScript client (CDN)
- Vanilla HTML/CSS/JavaScript (no additional frameworks)

## Installation & Setup

### Backend
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run Flask development server
python app.py
```

### Frontend
- Serve HTML files via web server
- Configure Supabase project for GitHub OAuth
- Ensure CORS settings allow frontend domain

## Potential Improvements

1. **Database**: Replace in-memory storage with persistent database (PostgreSQL/Supabase)
2. **Game Content**: Add more pizza types, ingredients, upgrades
3. **Shop System**: Implement actual CLBC purchase functionality
4. **Security**: Environment variables for sensitive configuration
5. **Validation**: Add input validation and error handling
6. **Game Balance**: More sophisticated progression and rewards system
7. **Mobile Optimization**: Enhanced mobile responsiveness
8. **Real-time Features**: WebSocket integration for multiplayer elements

## File Structure

```
.
├── app.py              # Flask backend server
├── index.html          # Main frontend page
├── main.js             # Game logic and UI interactions
├── style.css           # Styling and responsive design
├── supabase.js         # Supabase configuration
├── requirements.txt    # Python dependencies
├── README.md          # Project documentation
├── .gitignore         # Git ignore rules
└── LICENSE            # Project license
```

This project serves as a solid foundation for a web-based tycoon game, with room for significant expansion in both gameplay mechanics and technical sophistication.