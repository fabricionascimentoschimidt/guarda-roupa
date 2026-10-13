const estado = { pecas: [], looks: [], cat: 'Todas', cor: 'Todas' };
const CATEGORIAS = ['Camisetas','Regatas','Polos','Camisas','Bermudas','Moletons','Meias','Calçados','Acessórios'];
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

async function carregar(url){ try{ const r = await fetch(url,{cache:'no-store'}); return r.ok ? await r.json() : []; }catch{ return []; } }

function qtd(p){ const m=String(p.quantidade||'').match(/\d+/); return m?+m[0]:1; }

function vazio(icone, titulo, texto){ return `<div class="vazio"><div class="icone">${icone}</div><strong>${titulo}</strong>${texto}</div>`; }

function chips(){
  const cats = ['Todas', ...CATEGORIAS.filter(c => estado.pecas.some(p => p.categoria === c))];
  $('#chips-cat').innerHTML = cats.map(c => `<button class="chip ${c===estado.cat?'ativo':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
  const cores = new Map(); estado.pecas.forEach(p => p.cor && cores.set(p.cor, p.cor_hex));
  $('#chips-cor').innerHTML = cores.size ? [`<button class="chip ${estado.cor==='Todas'?'ativo':''}" data-cor="Todas">Todas as cores</button>`,
    ...[...cores].map(([c,h]) => `<button class="chip ${c===estado.cor?'ativo':''}" data-cor="${esc(c)}"><span class="bolinha" style="background:${esc(h||'#888')}"></span>${esc(c)}</button>`)].join('') : '';
}

function armario(){
  chips();
  const lista = estado.pecas.filter(p => (estado.cat==='Todas'||p.categoria===estado.cat) && (estado.cor==='Todas'||p.cor===estado.cor));
  const n = lista.length;
  $('#contagem').textContent = `${n} ${n===1?'peça':'peças'}`;
  if(!estado.pecas.length){ $('#grade').innerHTML = vazio('🧥','Seu armário ainda está vazio.','Mande a foto da sua primeira peça pro Estilo.'); $('#grade').style.display='block'; return; }
  $('#grade').style.display='';
  $('#grade').innerHTML = n ? lista.map(p => `<button class="card" data-id="${esc(p.id)}"><div class="foto${qtd(p)>1&&p.categoria!=='Meias'?' pilha':''}">${qtd(p)>1&&p.categoria!=='Meias'?`<img class="sombra" src="${esc(p.foto)}?v=${Date.now()}" alt="" aria-hidden="true">`:''}<img src="${esc(p.foto)}?v=${Date.now()}" alt="${esc(p.nome)}" loading="lazy">${p.status&&p.status!=='No guarda-roupa'?`<span class="selo-status">🚚 ${esc(p.status)}</span>`:''}${qtd(p)>1?`<span class="selo-qtd">×${qtd(p)}</span>`:''}</div><div class="nome">${esc(p.nome)}</div></button>`).join('')
    : `<div style="grid-column:1/-1">${vazio('🔍','Nada por aqui.','Nenhuma peça com esses filtros.')}</div>`;
}

function looks(){
  if(!estado.looks.length){ $('#lista-looks').innerHTML = vazio('✨','Nenhum look montado ainda.','Assim que o armário tiver peças, o Estilo monta combinações pra você.'); return; }
  $('#lista-looks').innerHTML = estado.looks.map(l => {
    const ps = (l.pecas||[]).map(id => estado.pecas.find(p => p.id===id)).filter(Boolean);
    return `<article class="look"><h3>${esc(l.nome)}</h3><p class="oc">${esc(l.ocasiao)}</p>
      <div class="composicao">${ps.map(p => `<button data-id="${esc(p.id)}"><img src="${esc(p.foto)}?v=${Date.now()}" alt="${esc(p.nome)}"></button>`).join('')}</div>
      ${l.observacoes?`<p class="obs">${esc(l.observacoes)}</p>`:''}</article>`;
  }).join('');
}

const ROTULOS = [['categoria','Categoria'],['cor','Cor'],['marca','Marca'],['tamanho','Tamanho'],['tecido','Tecido'],['data_compra','Data da compra'],['link','Link'],['observacoes','Observações']];
function abrir(id){
  const p = estado.pecas.find(x => x.id===id); if(!p) return;
  const fmt = (k,v) => k==='link' ? `<a href="${esc(v)}" target="_blank" rel="noopener">Ver produto</a>`
    : k==='cor' ? `<span class="bolinha" style="display:inline-block;vertical-align:middle;background:${esc(p.cor_hex||'#888')}"></span> ${esc(v)}`
    : k==='data_compra' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v.split('-').reverse().join('/') : esc(v);
  $('#folha-conteudo').innerHTML = `<div class="det-foto"><img src="${esc(p.foto)}?v=${Date.now()}" alt="${esc(p.nome)}"></div><h2>${esc(p.nome)}</h2>
    <dl class="campos">${ROTULOS.filter(([k]) => p[k]).map(([k,r]) => `<dt>${r}</dt><dd>${fmt(k,p[k])}</dd>`).join('')}</dl>`;
  $('#fundo').hidden = false; $('#folha').classList.add('aberta'); $('#folha').setAttribute('aria-hidden','false');
}
function fechar(){ $('#fundo').hidden = true; $('#folha').classList.remove('aberta'); $('#folha').setAttribute('aria-hidden','true'); }

document.addEventListener('click', e => {
  const t = e.target.closest('[data-aba],[data-cat],[data-cor],[data-id]'); if(!t) return;
  if(t.dataset.aba){ document.querySelectorAll('.aba').forEach(a => a.classList.toggle('ativa', a===t));
    document.querySelectorAll('.painel').forEach(s => s.hidden = s.id!==t.dataset.aba); }
  else if(t.dataset.cat){ estado.cat = t.dataset.cat; armario(); }
  else if(t.dataset.cor){ estado.cor = t.dataset.cor; armario(); }
  else if(t.dataset.id){ abrir(t.dataset.id); }
});
$('#fundo').onclick = fechar; $('#fechar').onclick = fechar;
document.addEventListener('keydown', e => e.key==='Escape' && fechar());

(async () => {
  [estado.pecas, estado.looks] = await Promise.all([carregar('data/pecas.json'), carregar('data/looks.json')]);
  armario(); looks();
})();
