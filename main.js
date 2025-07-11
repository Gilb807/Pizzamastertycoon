let clbc = 0;
let xp = 0;

function venderPizza() {
  clbc += 10;
  xp += 5;
  document.getElementById("saldo").innerText = clbc;
  document.getElementById("xp").innerText = xp;
}
