// Estado do menu lateral (pele C, especificação de 2026-10-13, secção 4.4). Corre no <head>,
// antes da primeira pintura, para o menu não piscar. Guarda a escolha entre páginas; em ecrã
// estreito o menu abre sempre recolhido e a escolha não se grava. O espelho estático, que
// remove os scripts da aplicação, repõe este ficheiro pelo shim (tools/espelho/shim.py).
(function () {
  var d = document.documentElement, CHAVE = "vigil.nav";
  function estreito() { return window.innerWidth <= 900; }
  var guardado = null;
  try { guardado = localStorage.getItem(CHAVE); } catch (e) { /* armazenamento bloqueado */ }
  d.classList.add("js");
  if (estreito() || guardado === "fechada") d.classList.add("nav-fechada");
  function acertar() {
    var aberto = !d.classList.contains("nav-fechada");
    document.querySelectorAll("[data-nav]").forEach(function (b) { b.setAttribute("aria-expanded", String(aberto)); });
  }
  document.addEventListener("DOMContentLoaded", acertar);
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest("[data-nav]") : null;
    if (!b) return;
    var fechada = d.classList.toggle("nav-fechada");
    if (!estreito()) { try { localStorage.setItem(CHAVE, fechada ? "fechada" : "aberta"); } catch (e2) { /* idem */ } }
    acertar();
    // O comando que se usou deixou de estar à vista: o foco passa para o que o desfaz.
    var alvo = document.querySelector(fechada ? ".menu-btn" : ".recolher");
    if (alvo) alvo.focus();
  });
})();
