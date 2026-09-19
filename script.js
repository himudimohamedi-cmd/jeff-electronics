
const DEFAULT_HEROES = [
  {
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1800&q=85",
    name: "Simu & Tablets"
  },
  {
    image: "https://images.unsplash.com/photo-1505740420928-5e560a06d30e?auto=format&fit=crop&w=1800&q=85",
    name: "Headphones & Audio"
  },
  {
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1800&q=85",
    name: "Accessories"
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1800&q=85",
    name: "Smart Watches"
  }
];

function buildHero() {
  const hero = document.getElementById('heroSlider');
  hero.innerHTML = DEFAULT_HEROES.map((p,i) =>
    `<div class="slide ${i===0?'active':''}" style="--bg:url('${p.image}')"></div>`
  ).join('');
  slides=[...hero.querySelectorAll('.slide')];
  const dots=document.getElementById('dots');
  dots.innerHTML=slides.map((_,i)=>`<button class="dot ${i===0?'active':''}" onclick="goToSlide(${i})" aria-label="Slide ${i+1}"></button>`).join('');
  currentSlide=0;
  updateSlideLabel(DEFAULT_HEROES);
  if(slides.length>1) autoTimer=setInterval(nextSlide,5000);
}

let slides=[];
let currentSlide=0;
let autoTimer;

function productTitle(name){
  return name.replace(/\s+/g,' ').trim() || 'Bidhaa';
}

function buildProducts(){
  const items=Array.isArray(window.JEFF_PRODUCTS)?window.JEFF_PRODUCTS:[];
  const grid=document.getElementById('productGrid');
  if(!items.length){
    grid.innerHTML='<div class="empty-products"><b>Hakuna picha za bidhaa bado.</b><p>Weka picha kwenye JEFF PRODUCTS kisha endesha UPDATE_PRODUCTS.bat.</p></div>';
  } else {
    grid.innerHTML=items.map((p,i)=>`<article class="product-card"><img src="${p.image}" alt="${productTitle(p.name)}" loading="lazy"><div><span>Jeff Electronics</span><h3>${productTitle(p.name)}</h3><a href="https://wa.me/255768384919?text=${encodeURIComponent('Habari Jeff Electronics, naulizia bidhaa: '+productTitle(p.name))}" target="_blank">Ulizia WhatsApp →</a></div></article>`).join('');
  }
}

function updateSlideLabel(items){
  const title=document.getElementById('slideTitle');
  const no=document.getElementById('slideNo');
  if(!items.length) return;
  title.textContent=productTitle(items[currentSlide]?.name || items[0].name);
  no.textContent=String(currentSlide+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
}
function showSlide(n){
  if(!slides.length)return;
  currentSlide=(n+slides.length)%slides.length;
  slides.forEach((s,i)=>s.classList.toggle('active',i===currentSlide));
  document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===currentSlide));
  const items=(window.JEFF_PRODUCTS||[]).slice(0,6); updateSlideLabel(items);
}
function nextSlide(){showSlide(currentSlide+1)}
function prevSlide(){showSlide(currentSlide-1)}
function goToSlide(n){showSlide(n); clearInterval(autoTimer); if(slides.length>1)autoTimer=setInterval(nextSlide,5000)}
function toggleMenu(){document.getElementById('navMenu').classList.toggle('open')}
document.getElementById('year').textContent=new Date().getFullYear();
buildProducts();
buildHero();
