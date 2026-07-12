const TEAM_META=[['Azul','🟦','#2f80ed'],['Vermelho','🟥','#eb5757'],['Preto','⬛','#111827'],['Branco','⬜','#e9eef7'],['Verde','🟩','#27ae60']];
const CORUJA_ENGINE_VERSION='1.1.0-build002';
const DEFAULT_PLAYERS=[{"id": 1, "nome": "Anderson Sem noção", "telefone": "", "tipo": "Mensalista", "nivel": 5, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 2, "nome": "Beto", "telefone": "", "tipo": "Mensalista", "nivel": 5, "status": "ativo", "whatsapp": "sem_resposta", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 3, "nome": "Carlos Neka", "telefone": "", "tipo": "Mensalista", "nivel": 7, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 4, "nome": "Claudio", "telefone": "", "tipo": "Mensalista", "nivel": 3, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 5, "nome": "Danilo", "telefone": "", "tipo": "Mensalista", "nivel": 5, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 6, "nome": "Filipe", "telefone": "", "tipo": "Mensalista", "nivel": 6, "status": "ativo", "whatsapp": "sem_resposta", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 7, "nome": "Felipe BL", "telefone": "", "tipo": "Mensalista", "nivel": 4, "status": "ativo", "whatsapp": "sem_resposta", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 8, "nome": "Henrique", "telefone": "", "tipo": "Mensalista", "nivel": 8, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 9, "nome": "João", "telefone": "", "tipo": "Mensalista", "nivel": 3, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 10, "nome": "Lucelio", "telefone": "", "tipo": "Mensalista", "nivel": 6, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 11, "nome": "Marquinhos C.Rato", "telefone": "", "tipo": "Mensalista", "nivel": 3, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 12, "nome": "Marcio Salah", "telefone": "", "tipo": "Mensalista", "nivel": 3, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 13, "nome": "Pedro", "telefone": "", "tipo": "Mensalista", "nivel": 7, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 14, "nome": "Rafael Carretilha", "telefone": "", "tipo": "Mensalista", "nivel": 8, "status": "ativo", "whatsapp": "sem_resposta", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 15, "nome": "Renato", "telefone": "", "tipo": "Mensalista", "nivel": 5, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 16, "nome": "Ronaldo", "telefone": "", "tipo": "Mensalista", "nivel": 7, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 17, "nome": "Roque", "telefone": "", "tipo": "Mensalista", "nivel": 4, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 18, "nome": "Sergio Felipe", "telefone": "", "tipo": "Mensalista", "nivel": 6, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 19, "nome": "Sergio Garro", "telefone": "", "tipo": "Mensalista", "nivel": 8, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 20, "nome": "Sonata", "telefone": "", "tipo": "Mensalista", "nivel": 6, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 21, "nome": "Thiego", "telefone": "", "tipo": "Mensalista", "nivel": 4, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 22, "nome": "Vini", "telefone": "", "tipo": "Mensalista", "nivel": 8, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 23, "nome": "Willi", "telefone": "", "tipo": "Mensalista", "nivel": 4, "status": "ativo", "whatsapp": "confirmou", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 24, "nome": "Guilherme", "telefone": "", "tipo": "Avulso", "nivel": 8, "status": "ativo", "whatsapp": "sem_resposta", "presente": false, "atraso": false, "pagamento": "pendente"}, {"id": 25, "nome": "Wilker", "telefone": "", "tipo": "Avulso", "nivel": 7, "status": "ativo", "whatsapp": "sem_resposta", "presente": false, "atraso": false, "pagamento": "pendente"}];

let players=[], teams=[], sorteioFeito=false, unsubscribePlayers=null, firestoreOk=false;
const $=id=>document.getElementById(id);

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAq2Tw_iq2fYklyQwV8IIrQZGeDDBWonko",
  authDomain: "futsubobitoanhanguera.firebaseapp.com",
  projectId: "futsubobitoanhanguera",
  storageBucket: "futsubobitoanhanguera.firebasestorage.app",
  messagingSenderId: "974705991649",
  appId: "1:974705991649:web:8701922970ad8757697ca0",
  measurementId: "G-EET5XM2LG9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const jogadoresRef = collection(db, 'jogadores');

function setStatus(txt){ const el=$('syncStatus'); if(el) el.textContent=txt; }
function normalizePlayer(p){
 return {
  nome: p.nome || '', telefone: p.telefone || '', tipo: p.tipo || 'Mensalista', nivel: Number(p.nivel || p.nivelTecnico || 5),
  status: p.status || 'ativo', whatsapp: p.whatsapp || 'sem_resposta', presente: !!p.presente, atraso: !!p.atraso,
  pagamento: p.pagamento || 'pendente', jogadorId: Number(p.jogadorId || p.id || 0), updatedAt: serverTimestamp()
 };
}
async function init(){
 try{
  setup();
  const s=localStorage.getItem('coruja_sorteio');
  if(s){let o=JSON.parse(s); if(o.engineVersion===CORUJA_ENGINE_VERSION){teams=o.teams||[]; sorteioFeito=!!o.sorteioFeito}else{localStorage.removeItem('coruja_sorteio')}}
  listenPlayers();
  setInterval(renderClock,1000);
 }catch(e){ console.error(e); alert('Erro ao iniciar o Projeto Coruja.'); }
}
function listenPlayers(){
 try{
  const q=query(jogadoresRef, orderBy('jogadorId','asc'));
  unsubscribePlayers=onSnapshot(q, snap=>{
   firestoreOk=true;
   players=snap.docs.map((d,i)=>({id:d.id, ...d.data(), jogadorId:d.data().jogadorId || i+1}));
   if(players.length===0){ setStatus('Firestore conectado. Clique em “Migrar base inicial”.'); }
   else { setStatus(`Firestore conectado: ${players.length} jogadores sincronizados.`); }
   renderAll();
  }, err=>{
   console.error('Firestore erro:',err);
   firestoreOk=false; setStatus('Erro no Firestore. Verifique as regras em modo de teste.');
   fallbackLocal();
  });
 }catch(e){ console.error(e); fallbackLocal(); }
}
async function fallbackLocal(){
 const saved=localStorage.getItem('coruja_players');
 if(saved) players=JSON.parse(saved); else players=JSON.parse(JSON.stringify(DEFAULT_PLAYERS));
 renderAll();
}
async function migrateInitialPlayers(){
 if(!confirm('Migrar jogadores iniciais para o Firestore? Faça apenas uma vez.')) return;
 let base=[];
 try{ const r=await fetch('players.json',{cache:'no-store'}); base=await r.json(); }catch(e){ base=DEFAULT_PLAYERS; }
 const current=await getDocs(jogadoresRef);
 const existingNames=new Set(current.docs.map(d=>(d.data().nome||'').toLowerCase().trim()));
 let count=0;
 for(const p of base){
  const key=(p.nome||'').toLowerCase().trim();
  if(!key || existingNames.has(key)) continue;
  await addDoc(jogadoresRef, normalizePlayer(p)); count++;
 }
 alert(count ? `${count} jogadores migrados para o Firestore.` : 'Nenhum jogador novo para migrar.');
}
async function savePlayer(p){
 if(typeof p.id==='string' && firestoreOk){ await updateDoc(doc(db,'jogadores',p.id), {...normalizePlayer(p), jogadorId:p.jogadorId||0}); }
 else { localStorage.setItem('coruja_players',JSON.stringify(players)); renderAll(); }
}
async function removePlayer(id){
 if(!confirm('Excluir este jogador?')) return;
 if(firestoreOk) await deleteDoc(doc(db,'jogadores',id));
 else { players=players.filter(p=>p.id!==id); localStorage.setItem('coruja_players',JSON.stringify(players)); renderAll(); }
}
function setup(){
 document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
 $('goChegadas').onclick=()=>showTab('chegadas'); $('drawFromHome').onclick=()=>{showTab('sorteio'); drawTeams()}; $('drawBtn').onclick=drawTeams;
 $('copyInvite').onclick=()=>copy($('inviteText').value); $('copyTeams').onclick=()=>copy($('teamsText').value);
 $('resetBtn').onclick=()=>{if(confirm('Resetar apenas dados locais desta máquina?')){localStorage.clear();location.reload()}};
 $('search').oninput=renderPlayersList; $('markLate').onclick=()=>{sorteioFeito=true; saveSorteio(); alert('Modo atraso ativado: novos presentes serão marcados como atraso.')};
 $('migratePlayers').onclick=migrateInitialPlayers; $('addPlayer').onclick=addPlayerFromForm;
}
async function addPlayerFromForm(){
 const nome=$('playerName').value.trim(); if(!nome){alert('Informe o nome do jogador.'); return;}
 const nivel=Math.max(1,Math.min(10,Number($('playerLevel').value||5)));
 const jogadorId=players.reduce((m,p)=>Math.max(m,Number(p.jogadorId||0)),0)+1;
 const p={nome, tipo:$('playerType').value, nivel, telefone:$('playerPhone').value.trim(), status:'ativo', whatsapp:'sem_resposta', presente:false, atraso:false, pagamento:'pendente', jogadorId, createdAt:serverTimestamp(), updatedAt:serverTimestamp()};
 if(firestoreOk) await addDoc(jogadoresRef,p); else {players.push({...p,id:jogadorId}); localStorage.setItem('coruja_players',JSON.stringify(players)); renderAll();}
 $('playerName').value=''; $('playerPhone').value=''; $('playerLevel').value=5;
}
function saveSorteio(){localStorage.setItem('coruja_sorteio',JSON.stringify({teams,sorteioFeito,engineVersion:CORUJA_ENGINE_VERSION})); renderAll()}
function showTab(id){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));$(id).classList.add('active');document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));renderAll()}
function stats(){return{confirmou:players.filter(p=>p.whatsapp==='confirmou').length,presente:players.filter(p=>p.presente).length,sem:players.filter(p=>p.whatsapp==='sem_resposta').length,nao:players.filter(p=>p.whatsapp==='nao').length}}
function renderAll(){let s=stats(); $('cConfirmou').textContent=s.confirmou; $('cPresente').textContent=s.presente; $('cSem').textContent=s.sem; $('cNao').textContent=s.nao; $('drawCount').textContent=s.presente; $('inviteText').value=inviteMessage(); renderClock(); renderPlayersList(); renderPlayersTable(); renderTeams(); renderFinance()}
function renderClock(){let now=new Date(); let target=new Date(); target.setHours(19,30,0,0); let diff=target-now; let txt=''; if(diff>0){let m=Math.floor(diff/60000), sec=Math.floor((diff%60000)/1000); txt=`⏳ Faltam ${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')} para o sorteio`; } else txt='🔒 Horário do sorteio encerrado — 19h30'; if($('clock'))$('clock').textContent=txt}
function inviteMessage(){return `⚽ *Sub Óbito Anhanguera* 🦉\n\nHoje tem jogo no grupo *Inimigos do Gol - Cat. subobito*!\n\n📍 Local: Anhanguera\n⏰ Chegada até *19h30*\n⚽ Primeiro jogo: *19h35*\n\nConfirme sua presença:\n✅ Vou jogar\n❌ Não vou jogar\n\n⚠️ O sorteio será feito somente com os jogadores presentes no local até *19h30*.\n\n*Mais tempo jogando. Menos tempo organizando.*`}
function renderPlayersList(){let q=($('search')?.value||'').toLowerCase(); let groups=[['🟢 Presentes no local',p=>p.presente],['🟡 Confirmaram, mas não chegaram',p=>!p.presente&&p.whatsapp==='confirmou'],['⚪ Sem resposta',p=>!p.presente&&p.whatsapp==='sem_resposta'],['🔴 Não vão / excluídos',p=>!p.presente&&p.whatsapp==='nao']]; let html=''; groups.forEach(([title,fn])=>{let arr=players.filter(p=>(p.status||'ativo')==='ativo'&&fn(p)&&(p.nome||'').toLowerCase().includes(q)); if(!arr.length)return; html+=`<h3>${title} (${arr.length})</h3>`+arr.map(playerCard).join('')}); $('playersList').innerHTML=html||'<p class="muted">Nenhum jogador encontrado.</p>'; bindPlayerButtons()}
function playerCard(p){let atraso=p.atraso?'<span class="chip warn">Atraso</span>':''; return `<div class="player"><div><b>${p.nome}</b><br><small>Nível ${p.nivel} • ${p.tipo}</small><div class="chips"><span class="chip ${p.presente?'ok':''}">${p.presente?'Presente':'Não presente'}</span><span class="chip">${labelWhats(p.whatsapp)}</span>${atraso}</div></div><div class="playerActions"><button data-act="present" data-id="${p.id}">✅ Presente</button><button data-act="confirmou" data-id="${p.id}">👍 Confirmou</button><button data-act="no" data-id="${p.id}">❌ Não vai</button></div></div>`}
function labelWhats(w){return w==='confirmou'?'Confirmou WhatsApp':w==='nao'?'Não vai':'Sem resposta'}
function bindPlayerButtons(){document.querySelectorAll('[data-act]').forEach(b=>b.onclick=async()=>{let p=players.find(x=>String(x.id)===String(b.dataset.id)); if(!p)return; if(b.dataset.act==='present'){p.presente=true;p.whatsapp='confirmou'; if(sorteioFeito)p.atraso=true} if(b.dataset.act==='confirmou'){p.whatsapp='confirmou'; p.presente=false} if(b.dataset.act==='no'){p.whatsapp='nao';p.presente=false} await savePlayer(p)})}
function renderPlayersTable(){let html='<div class="table"><div class="row header"><span>Nº</span><span>Nome</span><span>Tipo</span><span>Nível</span><span>Ações</span></div>'; players.forEach(p=>html+=`<div class="row"><span>${p.jogadorId||''}</span><span><input class="editName" data-id="${p.id}" value="${escapeHtml(p.nome||'')}"></span><span><select class="editType" data-id="${p.id}"><option ${p.tipo==='Mensalista'?'selected':''}>Mensalista</option><option ${p.tipo==='Avulso'?'selected':''}>Avulso</option></select></span><span><input class="editLevel" data-id="${p.id}" type="number" min="1" max="10" value="${p.nivel||5}"></span><span><button class="saveEdit" data-id="${p.id}">Salvar</button><button class="deletePlayer" data-id="${p.id}">Excluir</button></span></div>`); html+='</div>'; $('playersTable').innerHTML=html; bindTableEdit()}
function bindTableEdit(){document.querySelectorAll('.saveEdit').forEach(b=>b.onclick=async()=>{let id=b.dataset.id,p=players.find(x=>String(x.id)===String(id)); if(!p)return; p.nome=document.querySelector(`.editName[data-id="${id}"]`).value.trim(); p.tipo=document.querySelector(`.editType[data-id="${id}"]`).value; p.nivel=Math.max(1,Math.min(10,Number(document.querySelector(`.editLevel[data-id="${id}"]`).value||5))); await savePlayer(p); alert('Jogador salvo.');}); document.querySelectorAll('.deletePlayer').forEach(b=>b.onclick=()=>removePlayer(b.dataset.id));}
function drawTeams(){
 const presentes=players.filter(p=>p.presente && (p.status||'ativo')==='ativo');
 if(!presentes.length){alert('Marque os jogadores presentes antes do sorteio.'); return}
 if(presentes.length>25){alert('Limite oficial do Sub Óbito: até 25 jogadores presentes. Desmarque os excedentes antes do sorteio.'); return}

 const sizes=getTeamSizes(presentes.length);
 const incompleteIndex=sizes.findIndex(size=>size<6);
 const shuffledPresentes=shuffle([...presentes]);
 let incompletePlayers=[];
 let fullPool=shuffledPresentes;

 // A equipe incompleta é definida primeiro e permanece fixa durante o balanceamento.
 // Assim, a Engine nunca transforma 13 jogadores em 5/4/4 ou 19 em 5/5/5/4.
 if(incompleteIndex>=0){
  incompletePlayers=shuffledPresentes.slice(0,sizes[incompleteIndex]);
  fullPool=shuffledPresentes.slice(sizes[incompleteIndex]);
 }

 const fullSizes=sizes.filter(size=>size===6);
 let bestFullTeams=[];
 let bestScore=Infinity;
 const attempts=fullSizes.length>1 ? 600 : 1;

 for(let i=0;i<attempts;i++){
  const candidate=buildFullTeams(fullPool,fullSizes.length);
  const improved=improveBalance(candidate);
  const candidateScore=scoreTeams(improved);
  if(candidateScore<bestScore){
   bestScore=candidateScore;
   bestFullTeams=improved;
  }
 }

 const candidate=[...bestFullTeams];
 if(incompleteIndex>=0) candidate.splice(incompleteIndex,0,incompletePlayers);

 const validation=validateDraw(candidate,presentes,sizes);
 if(!validation.ok){
  console.error('Coruja Engine:',validation.erro,{sizes,candidate});
  alert(`Erro ao validar o sorteio: ${validation.erro}`);
  return;
 }

 teams=candidate;
 sorteioFeito=true;
 saveSorteio();
}

function getTeamSizes(total){
 const sizes=[];
 let remaining=Math.max(0,Number(total||0));
 while(remaining>0 && sizes.length<5){
  const size=Math.min(6,remaining);
  sizes.push(size);
  remaining-=size;
 }
 return sizes;
}

function buildFullTeams(pool,teamCount){
 if(teamCount<=0) return [];
 const ordered=shuffle([...pool]).sort((a,b)=>Number(b.nivel||5)-Number(a.nivel||5));
 const result=Array.from({length:teamCount},()=>[]);

 ordered.forEach((player,index)=>{
  const round=Math.floor(index/teamCount);
  const position=index%teamCount;
  const teamIndex=round%2===0 ? position : teamCount-1-position;
  result[teamIndex].push(player);
 });

 return result;
}

function improveBalance(inputTeams){
 let current=inputTeams.map(team=>[...team]);
 if(current.length<2) return current;
 let currentScore=scoreTeams(current);
 let changed=true;
 let guard=0;

 while(changed && guard<120){
  changed=false;
  guard++;
  let bestSwap=null;
  let bestScore=currentScore;

  for(let a=0;a<current.length;a++){
   for(let b=a+1;b<current.length;b++){
    for(let ia=0;ia<current[a].length;ia++){
     for(let ib=0;ib<current[b].length;ib++){
      const clone=current.map(team=>[...team]);
      [clone[a][ia],clone[b][ib]]=[clone[b][ib],clone[a][ia]];
      const nextScore=scoreTeams(clone);
      if(nextScore+0.0001<bestScore){
       bestScore=nextScore;
       bestSwap=clone;
      }
     }
    }
   }
  }

  if(bestSwap){
   current=bestSwap;
   currentScore=bestScore;
   changed=true;
  }
 }

 return current;
}

function validateDraw(candidate,presentes,sizes){
 if(!Array.isArray(candidate)) return {ok:false,erro:'Resultado do sorteio inválido'};
 if(candidate.length!==sizes.length) return {ok:false,erro:`Esperado ${sizes.length} times, mas foram gerados ${candidate.length}`};

 for(let i=0;i<sizes.length;i++){
  if(!Array.isArray(candidate[i])) return {ok:false,erro:`Time ${i+1} inválido`};
  if(candidate[i].length!==sizes[i]) return {ok:false,erro:`Estrutura incorreta: esperado ${sizes.join('/')} e gerado ${candidate.map(t=>t.length).join('/')}`};
  if(candidate[i].length>6) return {ok:false,erro:'Existe time com mais de 6 jogadores'};
 }

 const playerKey=p=>String(p.id??p.jogadorId??p.nome);
 const expected=new Set(presentes.map(playerKey));
 const distributed=candidate.flat().map(playerKey);
 const unique=new Set(distributed);

 if(distributed.length!==presentes.length) return {ok:false,erro:'Nem todos os presentes foram distribuídos'};
 if(unique.size!==distributed.length) return {ok:false,erro:'Existe jogador repetido no sorteio'};
 if(expected.size!==unique.size || [...expected].some(id=>!unique.has(id))) return {ok:false,erro:'O sorteio contém jogadores incorretos'};
 return {ok:true,erro:''};
}

function shuffle(arr){
 for(let i=arr.length-1;i>0;i--){
  const j=Math.floor(Math.random()*(i+1));
  [arr[i],arr[j]]=[arr[j],arr[i]];
 }
 return arr;
}

function sum(team){return team.reduce((total,p)=>total+Number(p.nivel||0),0)}
function avg(team){return team.length?sum(team)/team.length:0}
function scoreTeams(candidate){
 const fullTeams=candidate.filter(team=>team.length===6);
 const base=fullTeams.length?fullTeams:candidate.filter(team=>team.length);
 if(base.length<=1) return 0;
 const sums=base.map(sum);
 const averages=base.map(avg);
 const sumRange=Math.max(...sums)-Math.min(...sums);
 const avgRange=Math.max(...averages)-Math.min(...averages);
 return sumRange*10+avgRange;
}
function balancePct(candidate){
 if(!candidate.length)return 0;
 const fullTeams=candidate.filter(team=>team.length===6);
 const base=fullTeams.length?fullTeams:candidate.filter(team=>team.length);
 if(base.length<=1)return 100;
 const sums=base.map(sum);
 const range=Math.max(...sums)-Math.min(...sums);
 return Math.max(70,Math.min(100,Math.round((100-range*2.5)*10)/10));
}
function renderTeams(){if(!teams.length){$('teams').innerHTML='<p class="muted">Nenhum sorteio gerado ainda.</p>';$('teamsText').value='';$('balance').innerHTML='';return} let pct=balancePct(teams); $('balance').innerHTML=`<div class="balance">🦉 Índice de equilíbrio: ${pct}% ${pct>=95?'⭐⭐⭐⭐⭐':pct>=90?'⭐⭐⭐⭐':'⭐⭐⭐'}</div>`; let html=''; teams.forEach((t,i)=>{let m=TEAM_META[i]; html+=`<div class="team"><h3>${m[1]} Time ${m[0]} ${i<2?'— começa jogando':'— próximo'}</h3><ul>${t.map(p=>`<li>${p.nome} <small>(nível ${p.nivel})</small></li>`).join('')}</ul><div class="sum">Soma ${sum(t)} • Média ${avg(t).toFixed(1)}</div></div>`}); $('teams').innerHTML=html; $('teamsText').value=teamsMessage(pct)}
function teamsMessage(pct){let lines=[`⚽ *Sub Óbito Anhanguera* 🦉`,`📅 Times da rodada`,`👥 Presentes: ${players.filter(p=>p.presente).length}`,`📊 Equilíbrio: ${pct}%`,``]; teams.forEach((t,i)=>{let m=TEAM_META[i]; lines.push(`${m[1]} *TIME ${m[0].toUpperCase()}* ${i<2?'— começa jogando':'— próximo'}`); t.forEach(p=>lines.push(`- ${p.nome}`)); lines.push('')}); lines.push('⚽ Primeiro jogo: 🟦 Azul x 🟥 Vermelho'); lines.push('Boa resenha e sem choro! 😂'); return lines.join('\n')}
function renderFinance(){let mensal=players.filter(p=>(p.tipo||'').toLowerCase().includes('mensal')).length; let avulsoPresentes=players.filter(p=>(p.tipo||'').toLowerCase().includes('avul')&&p.presente).length; let previsto=mensal*65+avulsoPresentes*20; $('financeTotal').textContent=`R$ ${previsto.toFixed(2).replace('.',',')}`; $('financeSummary').innerHTML=`<div class="finance"><b>Resumo estimado</b><p>Mensalistas cadastrados: ${mensal}</p><p>Avulsos presentes hoje: ${avulsoPresentes}</p><p>Receita referência: R$ ${previsto.toFixed(2).replace('.',',')}</p><p class="muted">Controle detalhado de pago/pendente entra na próxima build.</p></div>`}
async function copy(txt){try{ if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(txt);alert('Copiado!');return} const ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); alert('Copiado!'); }catch(e){alert('Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.')}}
function escapeHtml(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
init();
