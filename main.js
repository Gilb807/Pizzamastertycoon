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
    atualizarInterface();
    loginSection.style.display = "none";
    gameSection.style.display = "block";
  }
});

// Função de vender pizza
window.venderPizza = () => {
  userData.saldo += 10;
  userData.xp += 20;

  if (userData.xp >= userData.nivel * 100) {
    userData.xp = 0;
    userData.nivel++;
    alert("Você subiu de nível! Agora está no nível " + userData.nivel);
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
