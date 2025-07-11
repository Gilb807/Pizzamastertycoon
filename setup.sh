#!/bin/bash

# ==========================================================================
# PIZZA MASTER TYCOON - SETUP SCRIPT
# ==========================================================================

echo "🍕 Setting up Pizza Master Tycoon..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.8+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python 3 found${NC}"

# Setup backend
echo -e "${BLUE}🔧 Setting up backend...${NC}"
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${YELLOW}🔄 Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies
echo -e "${YELLOW}📥 Installing dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt

echo -e "${GREEN}✅ Backend setup complete!${NC}"

# Go back to root
cd ..

# Setup frontend (just verify files exist)
echo -e "${BLUE}🔧 Verifying frontend files...${NC}"
if [ -f "frontend/index.html" ]; then
    echo -e "${GREEN}✅ Frontend HTML found${NC}"
else
    echo -e "${RED}❌ Frontend HTML missing${NC}"
    exit 1
fi

if [ -f "frontend/style.css" ]; then
    echo -e "${GREEN}✅ Frontend CSS found${NC}"
else
    echo -e "${RED}❌ Frontend CSS missing${NC}"
    exit 1
fi

# Check JavaScript files
js_files=("config.js" "api.js" "auth.js" "game.js" "app.js")
for file in "${js_files[@]}"; do
    if [ -f "frontend/$file" ]; then
        echo -e "${GREEN}✅ $file found${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ All frontend files verified!${NC}"

# Print instructions
echo ""
echo -e "${PURPLE}🎉 Setup complete! Next steps:${NC}"
echo ""
echo -e "${YELLOW}1. Configure Supabase:${NC}"
echo "   - Run the SQL script in setup_supabase.sql"
echo "   - Configure Google OAuth in Supabase Dashboard"
echo "   - Update credentials in frontend/config.js"
echo ""
echo -e "${YELLOW}2. Start the backend:${NC}"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo -e "${YELLOW}3. Serve the frontend:${NC}"
echo "   cd frontend"
echo "   python3 -m http.server 8080"
echo "   # OR use any static file server"
echo ""
echo -e "${YELLOW}4. Deploy (optional):${NC}"
echo "   - Frontend: Upload frontend/ to Vercel"
echo "   - Backend: Upload backend/ to Railway or Vercel"
echo ""
echo -e "${GREEN}🍕 Happy coding!${NC}"