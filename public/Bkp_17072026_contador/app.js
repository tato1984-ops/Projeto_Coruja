
const BUILD='004.1';
const ENGINE='coruja-engine-004.1';
const TEAM_META=[['Azul','🟦'],['Vermelho','🟥'],['Preto','⬛'],['Branco','⬜'],['Verde','🟩']];
const $=id=>document.getElementById(id);
let players=[],teams=[],goals={},history=[],expenses=[],sorteioFeito=false,sorteioAt=null,firestoreOk=false,db=null,unsubscribe=null;

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDocs, query, orderBy, serverTimestamp, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig={apiKey:"AIzaSyAq2Tw_iq2fYklyQwV8IIrQZGeDDBWonko",authDomain:"futsubobitoanhanguera.firebaseapp.com",projectId:"futsubobitoanhanguera",storageBucket:"futsubobitoanhanguera.firebasestorage.app",messagingSenderId:"974705991649",appId:"1:974705991649:web:8701922970ad8757697ca0",measurementId:"G-EET5XM2LG9"};

function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
function safeText(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function roundDate(){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+((3-d.getDay()+7)%7));return d}
function roundKey(){const d=roundDate();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function roundLabel(){return new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}).format(roundDate())}
function active(){return players.filter(p=>(p.status||'ativo')==='ativo')}
function present(){return active().filter(p=>p.presente)}
function getTeamSizes(n){const sizes=[];while(n>0){sizes.push(Math.min(6,n));n-=6}return sizes}
function sum(t){return t.reduce((a,p)=>a+Number(p.nivel||5),0)}
function balancePct(ts){if(!ts.length)return 0;const av=ts.map(t=>sum(t)/Math.max(1,t.length));const max=Math.max(...av),min=Math.min(...av);return Math.max(0,Math.round(100-(max-min)*12))}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function persistLocal(){localStorage.setItem('coruja_players',JSON.stringify(players));localStorage.setItem('coruja_history',JSON.stringify(history));localStorage.setItem('coruja_expenses',JSON.stringify(expenses));localStorage.setItem('coruja_round',JSON.stringify({teams,goals,sorteioFeito,sorteioAt,roundKey:roundKey(),engine:ENGINE}))}
function loadLocal(){try{history=JSON.parse(localStorage.getItem('coruja_history')||'[]');expenses=JSON.parse(localStorage.getItem('coruja_expenses')||'[]');const r=JSON.parse(localStorage.getItem('coruja_round')||'{}');if(r.roundKey===roundKey()&&r.engine===ENGINE){teams=r.teams||[];goals=r.goals||{};sorteioFeito=!!r.sorteioFeito;sorteioAt=r.sorteioAt||null}}catch(e){console.error(e)}}

async function init(){
  loadLocal(); setup();
  try{
    const app=initializeApp(firebaseConfig);db=getFirestore(app);listenPlayers();await loadHistoryFirestore();
  }catch(e){console.error(e);await loadPlayersFallback()}
  renderAll();setInterval(renderClock,1000);
}
async function loadPlayersFallback(){const saved=localStorage.getItem('coruja_players');if(saved)players=JSON.parse(saved);else players=await fetch('players.json').then(r=>r.json())}
function listenPlayers(){
  const ref=collection(db,'jogadores');const q=query(ref,orderBy('jogadorId','asc'));
  unsubscribe=onSnapshot(q,async snap=>{firestoreOk=true;players=snap.docs.map((d,i)=>({id:d.id,...d.data(),jogadorId:d.data().jogadorId||i+1}));if(!players.length)await loadPlayersFallback();renderAll()},async err=>{console.error(err);firestoreOk=false;await loadPlayersFallback();renderAll()})
}
async function loadHistoryFirestore(){
  try{
    const snap=await getDocs(collection(db,'historico'));
    if(!snap.empty){history=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>String(b.data||'').localeCompare(String(a.data||'')));localStorage.setItem('coruja_history',JSON.stringify(history))}
  }catch(e){console.warn('Histórico local ativo',e)}
}
function setup(){
  document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
  $('goChegadas').onclick=()=>showTab('chegadas');$('drawFromHome').onclick=()=>{showTab('sorteio');drawTeams()};$('drawBtn').onclick=drawTeams;
  $('copyInvite').onclick=()=>copy($('inviteText').value);$('copyTeams').onclick=()=>copy($('teamsText').value);
  $('search').oninput=renderPlayersList;$('addPlayer').onclick=addPlayer;$('migratePlayers').onclick=migratePlayers;
  $('saveGoalsBtn').onclick=()=>{readGoalsFromInputs();persistLocal();alert('Gols salvos nesta rodada.')};
  $('finishRoundBtn').onclick=openFinish;$('cancelFinish').onclick=()=>$('finishModal').classList.add('hidden');$('confirmFinish').onclick=finishRound;
  $('addExpenseBtn').onclick=addExpense;
  $('resetBtn').onclick=()=>{if(confirm('Apagar apenas os dados locais deste aparelho?')){localStorage.clear();location.reload()}};
}
function showTab(id){document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));$(id).classList.add('active');document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));renderAll()}
function renderAll(){renderDashboard();renderPlayersList();renderPlayersTable();renderTeams();renderGoals();renderHistory();renderStats();renderFinance();renderClock();$('inviteText').value=inviteMessage()}
function renderDashboard(){
 const a=active(),p=present(),sizes=getTeamSizes(p.length),mensal=a.filter(x=>(x.tipo||'').toLowerCase().includes('mensal')).length,av=p.filter(x=>(x.tipo||'').toLowerCase().includes('avul')).length,receita=mensal*65+av*20;
 const vals={dashDate:roundLabel(),dashPresentes:p.length,dashConfirmados:a.filter(x=>x.whatsapp==='confirmou').length,dashTimes:sizes.length,dashEquilibrio:teams.length?balancePct(teams)+'%':'—',dashReceita:money(receita),dashAtrasos:sorteioFeito?p.filter(x=>x.atraso).length:0,dashStatus:firestoreOk?'Firestore online':'Modo local'};
 Object.entries(vals).forEach(([k,v])=>{if($(k))$(k).textContent=v});$('dashConnection').className='connectionBadge '+(firestoreOk?'online':'offline');$('dashProgress').style.width=Math.min(100,p.length/25*100)+'%';$('dashDrawState').textContent=sorteioFeito?'✅ Sorteio realizado':'⏳ Aguardando sorteio';
 $('dashSummary').textContent=p.length?`Hoje temos ${p.length} presentes e ${sizes.length} time(s). ${sizes.some(x=>x<6)?'O último time ficará incompleto.':'Todos os times ficarão completos.'}`:'Aguardando dados da rodada.';$('drawCount').textContent=p.length;
}
function renderClock(){const n=new Date(),t=roundDate();t.setHours(19,30,0,0);const d=t-n;if(d<=0){$('clock').textContent='🔒 Horário do sorteio encerrado — 19h30';return}const h=Math.floor(d/3600000),m=Math.floor(d%3600000/60000),s=Math.floor(d%60000/1000);$('clock').textContent=`⏳ Faltam ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} para o sorteio`}
function inviteMessage(){return `⚽ *Sub Óbito* 🦉\n\n📅 Próxima rodada: *${roundLabel()}*\n⏰ Chegada até *19h30*\n⚽ Primeiro jogo: *19h35*\n\nConfirme sua presença:\n✅ Vou jogar\n❌ Não vou jogar\n\n⚠️ O sorteio considera apenas quem estiver presente no local.`}
function renderPlayersList(){
 const q=($('search').value||'').toLowerCase(),groups=[['🟢 Presentes',x=>x.presente],['🟡 Confirmaram',x=>!x.presente&&x.whatsapp==='confirmou'],['⚪ Sem resposta',x=>!x.presente&&x.whatsapp==='sem_resposta'],['🔴 Não vão',x=>!x.presente&&x.whatsapp==='nao']];
 let html='';groups.forEach(([title,fn])=>{const arr=active().filter(x=>fn(x)&&x.nome.toLowerCase().includes(q));if(arr.length)html+=`<h3>${title} (${arr.length})</h3>${arr.map(playerCard).join('')}`});$('playersList').innerHTML=html||'<p class="muted">Nenhum jogador encontrado.</p>';bindPlayerButtons()
}
function playerCard(p){return `<div class="player"><div><b>${safeText(p.nome)}</b><br><small>Nível ${p.nivel} • ${safeText(p.tipo)}</small><div>${p.presente?'<span class="chip ok">Presente</span>':'<span class="chip">Ausente</span>'}${p.atraso?'<span class="chip warn">Atraso</span>':''}</div></div><div class="playerActions"><button class="btnOk togglePresent" data-id="${p.id}">${p.presente?'Saiu':'Chegou'}</button><button class="btnWhats toggleConfirm" data-id="${p.id}">WhatsApp</button><button class="btnNo setNo" data-id="${p.id}">Não vai</button></div></div>`}
function bindPlayerButtons(){
 document.querySelectorAll('.togglePresent').forEach(b=>b.onclick=async()=>{const p=players.find(x=>String(x.id)===b.dataset.id);p.presente=!p.presente;if(p.presente){p.whatsapp='confirmou';p.atraso=!!sorteioFeito}else p.atraso=false;await savePlayer(p)});
 document.querySelectorAll('.toggleConfirm').forEach(b=>b.onclick=async()=>{const p=players.find(x=>String(x.id)===b.dataset.id);p.whatsapp=p.whatsapp==='confirmou'?'sem_resposta':'confirmou';await savePlayer(p)});
 document.querySelectorAll('.setNo').forEach(b=>b.onclick=async()=>{const p=players.find(x=>String(x.id)===b.dataset.id);p.whatsapp='nao';p.presente=false;p.atraso=false;await savePlayer(p)});
}
async function savePlayer(p){persistLocal();if(firestoreOk&&typeof p.id==='string')await updateDoc(doc(db,'jogadores',p.id),{nome:p.nome,tipo:p.tipo,nivel:Number(p.nivel),status:p.status||'ativo',whatsapp:p.whatsapp||'sem_resposta',presente:!!p.presente,atraso:!!p.atraso,pagamento:p.pagamento||'pendente',jogadorId:Number(p.jogadorId||0),updatedAt:serverTimestamp()});renderAll()}
function renderPlayersTable(){let html='<div class="table"><div class="row header"><span>ID</span><span>Nome</span><span>Tipo</span><span>Nível</span><span>Ações</span></div>';active().forEach(p=>html+=`<div class="row"><span>${p.jogadorId||p.id}</span><span>${safeText(p.nome)}</span><span>${safeText(p.tipo)}</span><span>${p.nivel}</span><span><button class="deleteP danger" data-id="${p.id}">Excluir</button></span></div>`);$('playersTable').innerHTML=html+'</div>';document.querySelectorAll('.deleteP').forEach(b=>b.onclick=()=>removePlayer(b.dataset.id))}
async function addPlayer(){const nome=$('playerName').value.trim();if(!nome)return alert('Informe o nome.');const id=Math.max(0,...players.map(x=>Number(x.jogadorId||x.id||0)))+1,p={id,jogadorId:id,nome,tipo:$('playerType').value,nivel:Math.max(1,Math.min(10,Number($('playerLevel').value||5))),status:'ativo',whatsapp:'sem_resposta',presente:false,atraso:false,pagamento:'pendente'};if(firestoreOk){await addDoc(collection(db,'jogadores'),{...p,id:undefined,createdAt:serverTimestamp(),updatedAt:serverTimestamp()})}else players.push(p);$('playerName').value='';persistLocal();renderAll()}
async function removePlayer(id){if(!confirm('Excluir este jogador?'))return;const p=players.find(x=>String(x.id)===String(id));if(firestoreOk&&typeof p?.id==='string')await deleteDoc(doc(db,'jogadores',p.id));players=players.filter(x=>String(x.id)!==String(id));persistLocal();renderAll()}
async function migratePlayers(){if(!firestoreOk)return alert('Firestore indisponível.');const base=await fetch('players.json').then(r=>r.json()),snap=await getDocs(collection(db,'jogadores')),names=new Set(snap.docs.map(d=>(d.data().nome||'').toLowerCase()));let n=0;for(const p of base){if(names.has(p.nome.toLowerCase()))continue;await addDoc(collection(db,'jogadores'),{...p,id:undefined,jogadorId:p.id,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});n++}alert(`${n} jogador(es) migrado(s).`)}
function drawTeams(){
 const p=present();if(!p.length)return alert('Marque os presentes primeiro.');if(p.length>25)return alert('Limite de 25 jogadores.');
 const sizes=getTeamSizes(p.length),pool=shuffle([...p]).sort((a,b)=>Number(b.nivel)-Number(a.nivel));teams=sizes.map(()=>[]);
 pool.forEach((pl,i)=>{let choices=teams.map((t,idx)=>({idx,size:t.length,sum:sum(t),cap:sizes[idx]})).filter(x=>x.size<x.cap).sort((a,b)=>a.sum-b.sum||a.size-b.size);teams[choices[0].idx].push(pl)});
 sorteioFeito=true;sorteioAt=new Date().toISOString();persistLocal();renderAll()
}
function renderTeams(){if(!teams.length){$('teams').innerHTML='';$('balance').innerHTML='';$('teamsText').value='';return}const pct=balancePct(teams);$('balance').innerHTML=`<div class="balance">Índice de equilíbrio: ${pct}%</div>`;$('teams').innerHTML=teams.map((t,i)=>`<div class="team"><h3>${TEAM_META[i][1]} Time ${TEAM_META[i][0]} ${i<2?'— começa jogando':'— próximo'}</h3><ul>${t.map(p=>`<li>${safeText(p.nome)} <small>(nível ${p.nivel})</small></li>`).join('')}</ul><small>Soma ${sum(t)}</small></div>`).join('');$('teamsText').value=teamsMessage(pct)}
function teamsMessage(pct){let l=[`⚽ *Sub Óbito* 🦉`,`📊 Equilíbrio: ${pct}%`,``];teams.forEach((t,i)=>{l.push(`${TEAM_META[i][1]} *TIME ${TEAM_META[i][0].toUpperCase()}* ${i<2?'— começa jogando':'— próximo'}`);t.forEach(p=>l.push(`- ${p.nome}`));l.push('')});l.push('⚽ Primeiro jogo: 🟦 Azul x 🟥 Vermelho');return l.join('\n')}
function renderGoals(){$('goalsList').innerHTML=present().length?present().map(p=>`<div class="goalRow"><b>${safeText(p.nome)}</b><input class="goalInput" data-id="${p.id}" type="number" min="0" max="30" value="${Number(goals[p.id]||0)}"></div>`).join(''):'<p class="muted">Nenhum jogador presente.</p>'}
function readGoalsFromInputs(){document.querySelectorAll('.goalInput').forEach(i=>goals[i.dataset.id]=Math.max(0,Number(i.value||0)))}
function openFinish(){if(!present().length)return alert('Não há jogadores presentes.');if(!teams.length)return alert('Realize o sorteio antes de encerrar.');readGoalsFromInputs();const total=Object.values(goals).reduce((a,b)=>a+Number(b||0),0);$('finishSummary').innerHTML=`<div><b>${roundLabel()}</b><p>${present().length} presentes • ${teams.length} times • ${total} gols</p></div>`;$('finishModal').classList.remove('hidden')}
async function finishRound(){
 const btn=$('confirmFinish');btn.disabled=true;btn.textContent='Salvando...';
 try{
  readGoalsFromInputs();const p=present(),mensal=active().filter(x=>(x.tipo||'').toLowerCase().includes('mensal')).length,av=p.filter(x=>(x.tipo||'').toLowerCase().includes('avul')).length;
  const item={data:roundKey(),label:roundLabel(),encerradaEm:new Date().toISOString(),presentes:p.map(x=>({id:x.id,nome:x.nome,nivel:x.nivel,tipo:x.tipo,atraso:!!x.atraso,gols:Number(goals[x.id]||0)})),times:teams.map((t,i)=>({nome:TEAM_META[i][0],jogadores:t.map(x=>({id:x.id,nome:x.nome,nivel:x.nivel}))})),totalGols:Object.values(goals).reduce((a,b)=>a+Number(b||0),0),atrasos:p.filter(x=>x.atraso).length,receita:mensal*65+av*20,build:BUILD};
  if(firestoreOk){await setDoc(doc(db,'historico',item.data),{...item,createdAt:serverTimestamp()});const check=await getDoc(doc(db,'historico',item.data));if(!check.exists())throw new Error('Falha na validação do histórico')}
  history=history.filter(x=>x.data!==item.data);history.unshift(item);localStorage.setItem('coruja_history',JSON.stringify(history));
  for(const pl of players){pl.presente=false;pl.atraso=false;pl.whatsapp='sem_resposta';if(firestoreOk&&typeof pl.id==='string')await updateDoc(doc(db,'jogadores',pl.id),{presente:false,atraso:false,whatsapp:'sem_resposta',updatedAt:serverTimestamp()})}
  teams=[];goals={};sorteioFeito=false;sorteioAt=null;persistLocal();$('finishModal').classList.add('hidden');alert('Rodada encerrada e salva com segurança.');renderAll()
 }catch(e){console.error(e);alert('A rodada não foi limpa porque ocorreu um erro ao salvar. Tente novamente.')}finally{btn.disabled=false;btn.textContent='Confirmar encerramento'}
}
function renderHistory(){if(!history.length){$('historyList').innerHTML='<p class="muted">Nenhuma rodada encerrada.</p>';return}$('historyList').innerHTML=history.map(h=>`<details class="historyCard"><summary>${safeText(h.label||h.data)} — ${h.presentes?.length||0} presentes — ${h.totalGols||0} gols</summary><p>Receita: ${money(h.receita)} • Atrasos: ${h.atrasos||0}</p><div>${(h.times||[]).map(t=>`<p><b>${safeText(t.nome)}:</b> ${t.jogadores.map(x=>safeText(x.nome)).join(', ')}</p>`).join('')}</div></details>`).join('')}
function renderStats(){const rounds=history.length,all=history.flatMap(h=>h.presentes||[]),goalsTotal=all.reduce((a,p)=>a+Number(p.gols||0),0);$('statRounds').textContent=rounds;$('statGoals').textContent=goalsTotal;$('statPresences').textContent=all.length;const map={};all.forEach(p=>{map[p.nome]??={gols:0,presencas:0};map[p.nome].gols+=Number(p.gols||0);map[p.nome].presencas++});const arr=Object.entries(map);$('scorers').innerHTML=arr.sort((a,b)=>b[1].gols-a[1].gols).slice(0,15).map(([n,v],i)=>`<div class="rankRow"><span>${i+1}. ${safeText(n)}</span><b>${v.gols} gol(s)</b></div>`).join('')||'<p class="muted">Sem dados.</p>';$('attendanceRank').innerHTML=arr.sort((a,b)=>b[1].presencas-a[1].presencas).slice(0,15).map(([n,v],i)=>`<div class="rankRow"><span>${i+1}. ${safeText(n)}</span><b>${v.presencas}</b></div>`).join('')||'<p class="muted">Sem dados.</p>'}
function renderFinance(){const mensal=active().filter(x=>(x.tipo||'').toLowerCase().includes('mensal')).length,av=present().filter(x=>(x.tipo||'').toLowerCase().includes('avul')).length;$('financeMonthly').textContent=money(mensal*65);$('financeCasual').textContent=money(av*20);$('financeRevenue').textContent=money(mensal*65+av*20);$('financeEntries').innerHTML=expenses.map((e,i)=>`<div class="expenseRow"><span><b>${safeText(e.tipo)}</b><small>${safeText(e.obs||'')}</small></span><b>${money(e.valor)}</b><button class="danger delExpense" data-i="${i}">Excluir</button></div>`).join('')||'<p class="muted">Nenhuma despesa registrada.</p>';document.querySelectorAll('.delExpense').forEach(b=>b.onclick=()=>{expenses.splice(Number(b.dataset.i),1);persistLocal();renderFinance()})}
function addExpense(){const valor=Number($('expenseValue').value||0);if(valor<=0)return alert('Informe um valor válido.');expenses.push({tipo:$('expenseType').value,valor,obs:$('expenseNote').value.trim(),data:new Date().toISOString()});$('expenseValue').value='';$('expenseNote').value='';persistLocal();renderFinance()}
async function copy(txt){try{await navigator.clipboard.writeText(txt);alert('Copiado!')}catch{alert('Não foi possível copiar automaticamente.')}}
init();
