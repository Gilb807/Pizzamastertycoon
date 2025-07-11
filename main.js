const loginBtn = document.getElementById("login-btn");
const gameSection = document.getElementById("game");
const loginSection = document.getElementById("login");

const usernameSpan = document.getElementById("username");
const usernamePerfil = document.getElementById("username-perfil");
const saldoSpan = document.getElementById("saldo");
const xpSpan = document.getElementById("xp");

const saldoCarteira = document.getElementById("saldo-carteira");
const xpCarteira = document.getElementById("xp-carteira");

const nivelSpan = document.getElementById("nivel");
const xpTotalSpan = document.getElementById("xp-total");
const xpNextSpan = document.getElementById("xp-next");

// Dados do usuário
let userData = {
  username: '',
  saldo: 100,
  xp: 0,
  nivel: 1
};

// Login com GitHub
loginBtn.addEventListener("click", async () => {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'github'
  });
  if (error) {
    console.error(error);
    alert("Erro ao fazer login.");
  }
});

// Quando o usuário logar
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (session && session.user) {
    const user = session.user;
    userData.username = user.user_metadata.user_name || user.email;
    
    // Create or get user data from backend
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          username: userData.username
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          userData = {
            ...userData,
            ...result.data,
            id: user.id
          };
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    
    atualizarInterface();
    loginSection.style.display = "none";
    gameSection.style.display = "block";
  }
});

// Função de vender pizza
window.venderPizza = async () => {
  const moedas = 10;
  const xp = 20;
  
  // Update local state immediately for responsiveness
  const previousNivel = userData.nivel;
  userData.saldo += moedas;
  userData.xp += xp;
  
  // Persist to backend
  if (userData.id) {
    try {
      const response = await fetch('/api/game/finish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.id,
          moedas: moedas,
          xp: xp
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update with backend data (handles correct leveling logic)
          userData = {
            ...userData,
            ...result.data
          };
          
          // Check if leveled up
          if (userData.nivel > previousNivel) {
            alert("Você subiu de nível! Agora está no nível " + userData.nivel);
          }
        }
      }
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  }

  atualizarInterface();
};

// Atualiza os elementos visuais com os dados do usuário
function atualizarInterface() {
  usernameSpan.textContent = userData.username;
  usernamePerfil.textContent = userData.username;

  saldoSpan.textContent = userData.saldo;
  xpSpan.textContent = userData.xp;

  saldoCarteira.textContent = `${userData.saldo} CLBC`;
  xpCarteira.textContent = userData.xp;

  nivelSpan.textContent = userData.nivel;
  xpTotalSpan.textContent = userData.xp;
  xpNextSpan.textContent = userData.nivel * 100;
}
