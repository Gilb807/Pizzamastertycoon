# 🍕 Pizza Master Tycoon

Um jogo web gamificado onde você gerencia sua própria pizzaria, vende pizzas e acumula CalabrinCoins!

## ✨ Funcionalidades

- 🔐 **Login com Google** via Supabase
- 🍕 **Venda de Pizzas** com sistema de recompensas
- 💰 **Sistema de Moedas** (CalabrinCoins)
- ⭐ **Sistema de XP e Níveis**
- 🎮 **Interface Gamificada** responsiva
- 📱 **Mobile-First** design
- 🌐 **Modo Offline** com sincronização

## 🛠️ Tecnologias

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Supabase (Autenticação)
- Design responsivo (mobile-first)
- Tema roxo/dourado

### Backend
- Python Flask
- Supabase (Database)
- CORS habilitado
- Fallback para localStorage

## � Setup Local

### 1. Clone o repositório
```bash
git clone [seu-repositorio]
cd pizza-master-tycoon
```

### 2. Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

O backend estará disponível em `http://localhost:5000`

### 3. Frontend (Estático)
```bash
cd frontend
# Servir arquivos estáticos (pode usar qualquer servidor)
python -m http.server 8080
# ou
npx serve .
```

O frontend estará disponível em `http://localhost:8080`

## 🌐 Deploy

### Frontend (Vercel)
1. Faça upload da pasta `frontend/` no Vercel
2. Configure o domínio
3. Deploy automático

### Backend (Railway/Vercel)

#### Opção 1: Railway
1. Conecte seu repositório no Railway
2. Configure a pasta `backend/` como root
3. Deploy automático

#### Opção 2: Vercel (Serverless)
1. Configure o `backend/vercel.json`
2. Deploy a pasta `backend/`

## 🎮 Como Jogar

1. **Login**: Entre com sua conta Google
2. **Vender Pizza**: Clique no botão ou na pizza animada
3. **Quick Sell**: Venda 10 pizzas de uma vez
4. **Level Up**: Acumule XP para subir de nível
5. **Explore**: Navegue pelas abas (Cozinha, Loja, Perfil)

### Atalhos de Teclado
- `Espaço`: Vender pizza
- `Q`: Quick sell
- `1`, `2`, `3`: Navegar entre abas

## 🔧 Configuração

### Supabase
1. Crie um projeto no Supabase
2. Configure OAuth com Google
3. Crie a tabela `players`:

```sql
CREATE TABLE players (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  saldo INTEGER DEFAULT 100,
  xp INTEGER DEFAULT 0,
  nivel INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. Atualize as credenciais em `frontend/config.js`

### Configuração de OAuth (Google)
1. No Supabase Dashboard > Authentication > Providers
2. Configure Google OAuth
3. Adicione seus domínios nas URLs autorizadas

## 📁 Estrutura do Projeto

```
pizza-master-tycoon/
├── frontend/
│   ├── index.html          # Interface principal
│   ├── style.css           # Estilos responsivos
│   ├── config.js           # Configurações
│   ├── api.js              # Comunicação com backend
│   ├── auth.js             # Autenticação Supabase
│   ├── game.js             # Lógica do jogo
│   ├── app.js              # App principal
│   └── vercel.json         # Config deploy Vercel
├── backend/
│   ├── app.py              # Flask backend
│   ├── requirements.txt    # Dependências Python
│   └── vercel.json         # Config deploy Vercel
└── README.md
```

## 🎨 Design System

### Cores
- **Primário**: Roxo (`#7b2cbf`)
- **Secundário**: Dourado (`#ffb700`)
- **Fundo**: Gradiente roxo escuro
- **Texto**: Branco/Cinza claro

### Componentes
- Cards glassmorphism
- Botões com gradiente
- Animações CSS
- Ícones Font Awesome

## 🔄 Sistema de Recompensas

- **Pizza vendida**: +10 CLBC, +20 XP
- **Level up**: +100 CLBC bônus
- **Quick sell**: 10x multiplicador

## 🚨 Troubleshooting

### Login não funciona
- Verifique URLs OAuth no Supabase
- Confirme credenciais em `config.js`

### Backend offline
- App funciona em modo offline
- Dados salvos no localStorage

### Mobile não responsivo
- Verifique viewport meta tag
- CSS usa mobile-first approach

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🍕 Sobre

Pizza Master Tycoon é um projeto demonstrativo que combina:
- Frontend moderno e responsivo
- Backend RESTful
- Autenticação OAuth
- Sistema gamificado
- Deploy cloud-ready

Desenvolvido com 💜 para aprender e ensinar desenvolvimento web moderno.
