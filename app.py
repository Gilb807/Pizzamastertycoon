app.py - Backend principal do Pizza Master Tycoon

from flask import Flask, request, jsonify from flask_cors import CORS from datetime import datetime

app = Flask(name) CORS(app)

Banco de dados em memória para exemplo (pode trocar por PostgreSQL/Supabase)

users_db = {}

@app.route("/api/user", methods=["POST"]) def create_or_get_user(): data = request.json user_id = data.get("id") username = data.get("username")

if user_id not in users_db:
    users_db[user_id] = {
        "username": username,
        "saldo": 100,
        "xp": 0,
        "nivel": 1,
        "created_at": datetime.utcnow().isoformat()
    }

return jsonify({
    "success": True,
    "data": users_db[user_id]
})

@app.route("/api/game/finish", methods=["POST"]) def finalizar_jogo(): data = request.json user_id = data.get("user_id") moedas = data.get("moedas", 0) xp = data.get("xp", 0)

if user_id in users_db:
    user = users_db[user_id]
    user["saldo"] += moedas
    user["xp"] += xp

    if user["xp"] >= user["nivel"] * 100:
        user["xp"] = 0
        user["nivel"] += 1

    return jsonify({"success": True, "data": user})
else:
    return jsonify({"success": False, "message": "Usuário não encontrado."}), 404

@app.route("/api/user/<user_id>", methods=["GET"]) def get_user(user_id): user = users_db.get(user_id) if user: return jsonify({"success": True, "data": user}) else: return jsonify({"success": False, "message": "Usuário não encontrado."}), 404

if name == 'main': app.run(debug=True)

