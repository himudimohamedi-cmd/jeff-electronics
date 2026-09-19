const OWNER='himumidmohamedi-cmd', REPO='jeff-electronics', BRANCH='main';
const API=`https://api.github.com/repos/${OWNER}/${REPO}/contents/products?ref=${BRANCH}`;
const RAW=`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/products/`;
const WA='255768384919';

const fallbackQueries=['smartphone','smart watch','wireless earbuds','headphones','laptop','tablet','charger','power bank','speaker','gaming headset','camera','keyboard','mouse','usb cable','electronics'];
let allProducts=[], filtered=[], shown=0, active='All', heroIndex=0, heroTimer;

const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const pretty=s=>s.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();

function category(name){
 const n=name.toLowerCase();
 if(/iphone|samsung|tecno|infinix|xiaomi|oppo|vivo|phone|simu/.test(n))return'Simu';
 if(/watch|smartwatch|band/.test(n))return'Smart Watch';
 if(/ear|airpod|headphone|headset|speaker|audio|buds/.test(n))return'Audio';
 if(/charger|charging|power.?bank|adapter|cable/.test(n))return'Charging';
 if(/laptop|computer|tablet|ipad|keyboard|mouse|monitor/.test(n))return'Computing';
 return'Accessories';
}
function imgName(n){return encodeURIComponent(n).replace(/%2F/g,'/')}
function makeRemote(i){
 const q=fallbackQueries[i%fallbackQueries.length].replace(/ /g,',');
 return {name:`Electronics ${String(i+1).padStart(3,'0')}`,cat:category(q),url:`https://loremflickr.com/900/1100/${q}?lock=${i+1}`,remote:true};
}
async function load(){
 try{
  const r=await fetch(API,{cache:'no-store'}); if(!r.ok)throw Error();
  const files=await r.json();
  const imgs=files.filter(x=>x.type==='file'&&/\.(jpe?g|png|webp|gif)$/i.test(x.name));
  allProducts=imgs.map((x,i)=>({name:pretty(x.name),cat:category(x.name),url:RAW+imgName(x.name),remote:false,id:i}));
 }catch(e){allProducts=[]}
 // The engine supports 500+ visuals; real inventory images are always shown first.
 if(allProducts.length<500){
   const needed=500-allProducts.length;
   for(let i=0;i<needed;i++)allProducts.push(makeRemote(i));
 }
 $('#realCount').textContent=allProducts.length+'+';
 $('#heroCount').textContent=Math.max(500,allProducts.length)+'+';
 filtered=[...allProducts];
 buildFilters(); render(); buildHero(); buildTicker();
}
function buildFilters(){
 const cats=['All',...new Set(allProducts.map(x=>x.cat))];
 $('#filters').innerHTML=cats.map(c=>`<button class="filter ${c===active?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
 document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{active=b.dataset.cat; document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));apply()});
}
function apply(){
 const q=$('#search').value.toLowerCase().trim();
 filtered=allProducts.filter(x=>(active==='All'||x.cat===active)&&(!q||x.name.toLowerCase().includes(q)||x.cat.toLowerCase().includes(q)));
 shown=0;render();
 $('#resultText').textContent=`${filtered.length} items found`;
}
function render(){
 const take=12; const slice=filtered.slice(shown,shown+take); shown+=slice.length;
 const grid=$('#productGrid');
 if(shown===slice.length)grid.innerHTML='';
 grid.insertAdjacentHTML('beforeend',slice.map((p,i)=>`<article class="product" data-i="${allProducts.indexOf(p)}">
  <img loading="lazy" src="${p.url}" alt="${esc(p.name)}" onerror="this.closest('.product').style.display='none'">
  <div class="product-overlay"><div class="product-name">${esc(p.name)}</div><div class="product-cat">${esc(p.cat)}</div></div>
  <a class="product-wa" href="https://wa.me/${WA}?text=${encodeURIComponent('Habari JEFF ELECTRONICS, naulizia '+p.name)}" target="_blank" onclick="event.stopPropagation()">↗</a>
 </article>`).join(''));
 document.querySelectorAll('.product').forEach(el=>el.onclick=()=>openProduct(allProducts[+el.dataset.i]));
 $('#loadMore').style.display=shown<filtered.length?'block':'none';
 if(!$('#search').value)$('#resultText').textContent=`${shown} kati ya ${filtered.length} items zinaonekana`;
}
function openProduct(p){
 $('#modalBody').innerHTML=`<div class="modal-content"><img src="${p.url}" alt="${esc(p.name)}"><div class="modal-info"><span class="kicker">${esc(p.cat)}</span><h3>${esc(p.name)}</h3><p>Unataka kujua bei, stock au specifications? Tuma ujumbe moja kwa moja kwa JEFF ELECTRONICS.</p><a target="_blank" href="https://wa.me/${WA}?text=${encodeURIComponent('Habari JEFF ELECTRONICS, naulizia '+p.name)}">Ulizia WhatsApp →</a></div></div>`;
 $('#modal').classList.add('show');document.body.style.overflow='hidden';
}
function closeModal(){$('#modal').classList.remove('show');document.body.style.overflow=''}
function buildHero(){
 const picks=allProducts.filter(x=>!x.remote).slice(0,6);
 const list=picks.length?picks:allProducts.slice(0,6);
 $('#heroMedia').innerHTML=list.map((p,i)=>`<div class="hero-slide ${i===0?'active':''}" style="background-image:url('${p.url}')"></div>`).join('');
 $('#heroDots').innerHTML=list.map((_,i)=>`<button class="${i===0?'active':''}" data-i="${i}"></button>`).join('');
 document.querySelectorAll('.hero-dots button').forEach(b=>b.onclick=()=>setHero(+b.dataset.i));
 clearInterval(heroTimer);heroTimer=setInterval(()=>setHero((heroIndex+1)%list.length),2000);
}
function setHero(i){
 const slides=document.querySelectorAll('.hero-slide'),dots=document.querySelectorAll('.hero-dots button');if(!slides.length)return;
 heroIndex=i;slides.forEach((s,j)=>s.classList.toggle('active',j===i));dots.forEach((s,j)=>s.classList.toggle('active',j===i));
 const p=$('#heroProgress');p.style.transition='none';p.style.width='0';requestAnimationFrame(()=>{p.style.transition='width 2s linear';p.style.width='100%'});
}
function buildTicker(){
 const words=['SIMU','SMART WATCH','AUDIO','CHARGERS','POWER BANK','ACCESSORIES','GAMING','TABLETS','SPEAKERS','JEFF ELECTRONICS'];
 $('#tickerTrack').innerHTML=[...words,...words,...words].map(w=>`<span>${w} ✦</span>`).join('');
}
$('#search').addEventListener('input',apply);$('#clearSearch').onclick=()=>{$('#search').value='';active='All';document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x.dataset.cat==='All'));apply()};$('#loadMore').onclick=render;
$('#closeModal').onclick=closeModal;$('.modal-backdrop').onclick=closeModal;
$('#hamb').onclick=()=>$('#nav').classList.toggle('open');
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
load();
