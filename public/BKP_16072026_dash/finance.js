import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAq2Tw_iq2fYklyQwV8IIrQZGeDDBWonko",
  authDomain: "futsubobitoanhanguera.firebaseapp.com",
  projectId: "futsubobitoanhanguera",
  storageBucket: "futsubobitoanhanguera.firebasestorage.app",
  messagingSenderId: "974705991649",
  appId: "1:974705991649:web:8701922970ad8757697ca0",
  measurementId: "G-EET5XM2LG9"
};

const FINANCE_KEY = "coruja_finance_v1";
const QUADRA_MENSAL = 1000;
const MENSALIDADE = 65;
const VALOR_AVULSO = 20;

const $ = id => document.getElementById(id);

let players = [];
let financeEntries = loadEntries();

function getFirebaseApp(){
  return getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
}

function monthKey(date = new Date()){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
}

function loadEntries(){
  try{
    const parsed = JSON.parse(localStorage.getItem(FINANCE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  }catch(error){
    console.error("Financeiro: erro ao carregar histórico.", error);
    return [];
  }
}

function saveEntries(){
  try{
    localStorage.setItem(FINANCE_KEY, JSON.stringify(financeEntries));
    renderFinance();
  }catch(error){
    console.error("Financeiro: erro ao salvar histórico.", error);
    alert("Não foi possível salvar a despesa neste aparelho.");
  }
}

function money(value){
  return `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`;
}

function activePlayers(){
  return players.filter(player => (player.status || "ativo") === "ativo");
}

function currentEntries(){
  const current = monthKey();
  return financeEntries.filter(entry => entry.month === current);
}

function totals(){
  const active = activePlayers();
  const mensalistas = active.filter(player =>
    String(player.tipo || "").toLowerCase().includes("mensal")
  );
  const avulsos = active.filter(player =>
    String(player.tipo || "").toLowerCase().includes("avul")
  );
  const isentos = active.filter(player =>
    String(player.tipo || "").toLowerCase().includes("isento")
  );
  const avulsosPresentes = avulsos.filter(player => player.presente);

  const receitaMensalistas = mensalistas.length * MENSALIDADE;
  const receitaAvulsos = avulsosPresentes.length * VALOR_AVULSO;
  const totalReceitas = receitaMensalistas + receitaAvulsos;

  const despesasVariaveis = currentEntries().reduce(
    (total, entry) => total + Number(entry.value || 0),
    0
  );
  const totalDespesas = QUADRA_MENSAL + despesasVariaveis;

  return {
    mensalistas,
    avulsos,
    isentos,
    avulsosPresentes,
    receitaMensalistas,
    receitaAvulsos,
    totalReceitas,
    despesasVariaveis,
    totalDespesas,
    saldo: totalReceitas - totalDespesas
  };
}

function addExpense(){
  const type = $("expenseType")?.value || "Outros";
  const value = Number(String($("expenseValue")?.value || "").replace(",", "."));
  const note = $("expenseNote")?.value.trim() || "";

  if(!Number.isFinite(value) || value <= 0){
    alert("Informe um valor válido para a despesa.");
    return;
  }

  financeEntries.push({
    id: `exp_${Date.now()}`,
    month: monthKey(),
    type,
    value,
    note,
    date: new Date().toISOString()
  });

  saveEntries();

  if($("expenseValue")) $("expenseValue").value = "";
  if($("expenseNote")) $("expenseNote").value = "";

  alert("Despesa registrada com sucesso.");
}

function removeExpense(id){
  const entry = financeEntries.find(item => item.id === id);
  if(!entry) return;

  if(!confirm(`Excluir “${entry.type}” no valor de ${money(entry.value)}?`)) return;

  financeEntries = financeEntries.filter(item => item.id !== id);
  saveEntries();
}

function clearCurrentMonth(){
  const entries = currentEntries();

  if(!entries.length){
    alert("Não existem despesas variáveis neste mês.");
    return;
  }

  if(!confirm("Apagar todas as despesas variáveis deste mês? Os demais meses serão preservados.")) return;

  const current = monthKey();
  financeEntries = financeEntries.filter(entry => entry.month !== current);
  saveEntries();
}

function reportText(){
  const data = totals();
  const month = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric"
  }).format(new Date());

  const lines = [
    `💰 *Prestação de Contas - ${month}*`,
    "",
    "📥 *Receitas previstas*",
    `Mensalistas pagantes (${data.mensalistas.length}): ${money(data.receitaMensalistas)}`,
    `Isentos (${data.isentos.length}): ${money(0)}`,
    `Avulsos presentes (${data.avulsosPresentes.length}): ${money(data.receitaAvulsos)}`,
    `Total de receitas: *${money(data.totalReceitas)}*`,
    "",
    "📤 *Despesas*",
    `🏟️ Locação do espaço: ${money(QUADRA_MENSAL)}`
  ];

  currentEntries().forEach(entry => {
    const icon =
      entry.type === "Goleiro de aplicativo" ? "🧤" :
      entry.type === "Rateio de bola" ? "⚽" : "🧾";

    lines.push(
      `${icon} ${entry.type}: ${money(entry.value)}${entry.note ? ` - ${entry.note}` : ""}`
    );
  });

  lines.push(`Total de despesas: *${money(data.totalDespesas)}*`);
  lines.push("");
  lines.push(`${data.saldo >= 0 ? "🟢" : "🔴"} Saldo previsto: *${money(data.saldo)}*`);

  return lines.join("\n");
}

async function copyReport(){
  const text = reportText();

  try{
    if(navigator.clipboard && window.isSecureContext){
      await navigator.clipboard.writeText(text);
    }else{
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    alert("Prestação de contas copiada!");
  }catch(error){
    console.error("Financeiro: erro ao copiar relatório.", error);
    alert("Não foi possível copiar automaticamente.");
  }
}

function escapeHtml(value){
  return String(value).replace(/[&<>"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[character]));
}

function renderFinance(){
  const data = totals();

  const setText = (id, value) => {
    const element = $(id);
    if(element) element.textContent = value;
  };

  setText(
    "financeMonth",
    new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric"
    }).format(new Date())
  );
  setText("financeRevenue", money(data.totalReceitas));
  setText("financeExpenses", money(data.totalDespesas));
  setText("financeRent", money(QUADRA_MENSAL));
  setText("financeMensalistas", money(data.receitaMensalistas));
  setText("financeAvulsos", money(data.receitaAvulsos));
  setText("financeTotal", money(data.totalReceitas));

  const balance = $("financeBalance");
  if(balance){
    balance.textContent = money(data.saldo);
    balance.classList.toggle("negativeValue", data.saldo < 0);
    balance.classList.toggle("positiveValue", data.saldo >= 0);
  }

  const entriesBox = $("financeEntries");
  if(entriesBox){
    const isentosHtml = data.isentos.length
      ? `<div class="financeIsentosList">
          <h4>Isentos (${data.isentos.length})</h4>
          ${data.isentos.map(player => `
            <div class="financeLine">
              <span>${escapeHtml(player.nome || "")}</span>
              <b>Isento • R$ 0,00</b>
            </div>
          `).join("")}
        </div>`
      : '<p class="muted">Nenhum jogador isento cadastrado.</p>';

    const avulsosHtml = data.avulsos.length
      ? `<div class="financeAvulsosList">
          <h4>Avulsos cadastrados (${data.avulsos.length})</h4>
          ${data.avulsos.map(player => `
            <div class="financeLine">
              <span>${escapeHtml(player.nome || "")}</span>
              <b>${player.presente ? "Presente • R$ 20,00" : "Não presente"}</b>
            </div>
          `).join("")}
        </div>`
      : '<p class="muted">Nenhum jogador avulso cadastrado.</p>';

    const expenses = currentEntries();
    const expensesHtml = expenses.length
      ? expenses.map(entry => `
          <div class="expenseRow">
            <div>
              <b>${escapeHtml(entry.type)}</b>
              <small>${new Date(entry.date).toLocaleDateString("pt-BR")}${entry.note ? ` • ${escapeHtml(entry.note)}` : ""}</small>
            </div>
            <div class="expenseValue">${money(entry.value)}</div>
            <button class="deleteExpense" data-id="${entry.id}">Excluir</button>
          </div>
        `).join("")
      : '<p class="muted">Nenhuma despesa variável registrada neste mês.</p>';

    entriesBox.innerHTML = `${isentosHtml}<hr class="financeDivider">${avulsosHtml}<hr class="financeDivider">${expensesHtml}`;

    document.querySelectorAll(".deleteExpense").forEach(button => {
      button.onclick = () => removeExpense(button.dataset.id);
    });
  }

  const report = $("financeReport");
  if(report) report.value = reportText();
}

function bindFinanceButtons(){
  const addButton = $("addExpenseBtn");
  if(addButton) addButton.onclick = addExpense;

  const copyButton = $("copyFinanceBtn");
  if(copyButton) copyButton.onclick = copyReport;

  const clearButton = $("clearFinanceBtn");
  if(clearButton) clearButton.onclick = clearCurrentMonth;
}

function listenPlayers(){
  try{
    const app = getFirebaseApp();
    const db = getFirestore(app);
    const playersQuery = query(collection(db, "jogadores"), orderBy("jogadorId", "asc"));

    onSnapshot(playersQuery, snapshot => {
      players = snapshot.docs.map((document, index) => ({
        id: document.id,
        ...document.data(),
        jogadorId: document.data().jogadorId || index + 1
      }));

      renderFinance();
    }, error => {
      console.error("Financeiro: erro ao sincronizar jogadores.", error);
      renderFinance();
    });
  }catch(error){
    console.error("Financeiro: falha ao iniciar módulo.", error);
    renderFinance();
  }
}

function ensureIsentoOptions(){
  const addOption = select => {
    if(!select) return;
    const exists = Array.from(select.options).some(option => option.value === "Isento");
    if(!exists){
      const option = document.createElement("option");
      option.value = "Isento";
      option.textContent = "Isento";
      select.appendChild(option);
    }
  };

  addOption($("playerType"));
  document.querySelectorAll("select.editType").forEach(addOption);
}

function watchPlayerEditors(){
  const target = $("playersTable");
  if(!target) return;

  const observer = new MutationObserver(() => ensureIsentoOptions());
  observer.observe(target, {childList:true, subtree:true});
}

function initFinance(){
  bindFinanceButtons();
  ensureIsentoOptions();
  watchPlayerEditors();
  renderFinance();
  listenPlayers();
}

initFinance();
