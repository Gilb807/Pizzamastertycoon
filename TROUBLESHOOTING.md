# 🍕 Pizza Master Tycoon - Solução de Problemas

## Problema Identificado
O projeto tinha conflitos na configuração do Vercel que estavam causando erros no deploy.

## Correções Aplicadas

### 1. Configuração do Vercel
- ❌ **Problema**: Dois arquivos `vercel.json` conflitantes (frontend e backend)
- ✅ **Solução**: Criado um único `vercel.json` na raiz que gerencia tanto frontend quanto backend

### 2. Estrutura do Backend
- ❌ **Problema**: Backend tentando servir arquivos estáticos
- ✅ **Solução**: Removidas rotas estáticas do Flask, agora gerenciadas pelo Vercel

### 3. Configuração da API
- ❌ **Problema**: URL da API vazia em produção
- ✅ **Solução**: Configurado `window.location.origin` para produção

### 4. Dependências
- ✅ **Adicionado**: `requirements.txt` na raiz para o Vercel

## Como Testar Localmente

### Frontend
```bash
cd frontend
python3 -m http.server 8080
# Acesse: http://localhost:8080
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# API em: http://localhost:5000
```

## Deploy no Vercel

1. Faça commit das mudanças:
```bash
git add .
git commit -m "Fix: Corrigir configuração do Vercel e resolver conflitos"
git push origin main
```

2. O Vercel fará deploy automaticamente com a nova configuração unificada.

## Estrutura Atual
```
projeto/
├── vercel.json              # Configuração unificada
├── requirements.txt         # Dependências Python
├── frontend/               # Arquivos estáticos
│   ├── index.html
│   ├── *.js
│   └── style.css
└── backend/               # API Python/Flask
    └── app.py
```

## URLs Funcionais Esperadas
- **Produção**: `https://pizzamastertycoon.vercel.app`
- **API**: `https://pizzamastertycoon.vercel.app/api/*`
- **Frontend**: Servido na raiz

## Modo Offline
O jogo funciona offline usando localStorage caso a API não esteja disponível.