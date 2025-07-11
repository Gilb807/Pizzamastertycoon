// main.js
import { supabase } from './supabase.js';

const loginBtn = document.getElementById("login-btn");
const gameSection = document.getElementById("game");
const loginSection = document.getElementById("login");
const usernameSpan = document.getElementById("username");
const saldoSpan = document.getElementById("saldo");
const xpSpan = document.getElementById("xp");

let userData = {
  username: '',
  saldo: 0,
  xp: 0,
};

loginBtn.addEventListener("click", async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    alert("Erro ao fazer login: " + error.message);
  }
});

supabase.auth.onAuthStateChange(async (event, session) => {
  if (session) {
    const user = session.user;
    userData.username = user.email.split('@')[0];
    userData.saldo = 100; // valor inicial
    userData.xp = 0;

    usernameSpan.textContent = userData.username;
    saldoSpan.textContent = userData.saldo;
    xpSpan.textContent = userData.xp;

    loginSection.style.display = "none";
    gameSection.style.display = "block";
  }
});

window.venderPizza = () => {
  userData.saldo += 10;
  userData.xp += 20;

  saldoSpan.textContent = userData.saldo;
  xpSpan.textContent = userData.xp;
};
