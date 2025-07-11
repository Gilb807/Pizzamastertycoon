from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from supabase import create_client, Client
import json

app = Flask(__name__)
CORS(app)

# Configuração do Supabase
SUPABASE_URL = "https://otujulkbkccsxuknkung.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dWp1bGtia2Njc3h1a25rdW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTI3MzIsImV4cCI6MjA2Nzc2ODczMn0.MSHdM3AWZ0SMyJwjeMBAMLeUJYSy4I_nqpSy02vDhm4"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Dados em memória como fallback
users_db = {}

# Frontend agora é servido pelo Vercel diretamente
# Removidas rotas de arquivos estáticos

@app.route("/api/user", methods=["POST"])
def create_or_get_user():
    try:
        data = request.json
        user_id = data.get("id")
        username = data.get("username")
        email = data.get("email")
        
        if not user_id:
            return jsonify({"success": False, "message": "ID do usuário é obrigatório"}), 400
        
        # Tenta buscar usuário no Supabase
        try:
            result = supabase.table('players').select("*").eq('user_id', user_id).execute()
            
            if result.data:
                # Usuário existe, retorna dados
                user_data = result.data[0]
                return jsonify({"success": True, "data": user_data})
            else:
                # Usuário novo, cria no Supabase
                new_user = {
                    "user_id": user_id,
                    "username": username,
                    "email": email,
                    "saldo": 100,
                    "xp": 0,
                    "nivel": 1,
                    "created_at": datetime.utcnow().isoformat()
                }
                
                result = supabase.table('players').insert(new_user).execute()
                return jsonify({"success": True, "data": result.data[0]})
                
        except Exception as e:
            # Fallback para banco em memória
            print(f"Erro Supabase: {e}, usando fallback")
            if user_id not in users_db:
                users_db[user_id] = {
                    "user_id": user_id,
                    "username": username,
                    "email": email,
                    "saldo": 100,
                    "xp": 0,
                    "nivel": 1,
                    "created_at": datetime.utcnow().isoformat()
                }
            return jsonify({"success": True, "data": users_db[user_id]})
            
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500

@app.route("/api/game/finish", methods=["POST"])
def finalizar_jogo():
    try:
        data = request.json
        user_id = data.get("user_id")
        moedas = data.get("moedas", 0)
        xp = data.get("xp", 0)
        
        if not user_id:
            return jsonify({"success": False, "message": "ID do usuário é obrigatório"}), 400
        
        # Tenta atualizar no Supabase
        try:
            # Busca dados atuais
            result = supabase.table('players').select("*").eq('user_id', user_id).execute()
            
            if not result.data:
                return jsonify({"success": False, "message": "Usuário não encontrado"}), 404
            
            user = result.data[0]
            
            # Atualiza dados
            novo_saldo = user["saldo"] + moedas
            novo_xp = user["xp"] + xp
            novo_nivel = user["nivel"]
            
            # Sistema de level up
            while novo_xp >= novo_nivel * 100:
                novo_xp -= novo_nivel * 100
                novo_nivel += 1
            
            # Atualiza no Supabase
            update_data = {
                "saldo": novo_saldo,
                "xp": novo_xp,
                "nivel": novo_nivel
            }
            
            result = supabase.table('players').update(update_data).eq('user_id', user_id).execute()
            
            return jsonify({
                "success": True, 
                "data": result.data[0],
                "level_up": novo_nivel > user["nivel"]
            })
            
        except Exception as e:
            # Fallback para banco em memória
            print(f"Erro Supabase: {e}, usando fallback")
            if user_id in users_db:
                user = users_db[user_id]
                user["saldo"] += moedas
                user["xp"] += xp
                
                level_up = False
                while user["xp"] >= user["nivel"] * 100:
                    user["xp"] -= user["nivel"] * 100
                    user["nivel"] += 1
                    level_up = True
                
                return jsonify({
                    "success": True, 
                    "data": user,
                    "level_up": level_up
                })
            else:
                return jsonify({"success": False, "message": "Usuário não encontrado"}), 404
                
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500

@app.route("/api/user/<user_id>", methods=["GET"])
def get_user(user_id):
    try:
        # Tenta buscar no Supabase
        try:
            result = supabase.table('players').select("*").eq('user_id', user_id).execute()
            
            if result.data:
                return jsonify({"success": True, "data": result.data[0]})
            else:
                return jsonify({"success": False, "message": "Usuário não encontrado"}), 404
                
        except Exception as e:
            # Fallback para banco em memória
            print(f"Erro Supabase: {e}, usando fallback")
            user = users_db.get(user_id)
            if user:
                return jsonify({"success": True, "data": user})
            else:
                return jsonify({"success": False, "message": "Usuário não encontrado"}), 404
                
    except Exception as e:
        return jsonify({"success": False, "message": f"Erro interno: {str(e)}"}), 500

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"success": True, "message": "Pizza Master Tycoon API funcionando!"})

if __name__ == '__main__':
    print("🍕 Pizza Master Tycoon Backend iniciando...")
    print("📊 Supabase URL:", SUPABASE_URL)
    app.run(debug=True, host='0.0.0.0', port=5000)