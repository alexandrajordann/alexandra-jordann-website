/* Pulls editable text/images/brands from the /content JSON files the CMS writes to.
   If a file is missing or the page is opened straight from disk (no server), the
   original wording already in the HTML stays as a safe fallback. */
(async()=>{
const j=async p=>{try{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw 0;return await r.json()}catch(e){return null}};

const about=document.getElementById('ab-body');
if(about){
 const d=await j('content/about.json');
 if(d){
  document.getElementById('ab-label').textContent=d.label||'';
  document.getElementById('ab-lead').textContent=d.lead||'';
  about.innerHTML=(d.bio||[]).map(p=>`<p>${p}</p>`).join('');
  const i1=document.getElementById('ab-img1'),i2=document.getElementById('ab-img2');
  if(i1&&d.image1){const im=i1.querySelector('img');im.src=d.image1;im.alt=d.image1Alt||im.alt;i1.classList.remove('ph')}
  if(i2&&d.image2){const im=i2.querySelector('img');im.src=d.image2;im.alt=d.image2Alt||im.alt;i2.classList.remove('ph')}
 }
}

const heroImg=document.getElementById('hero-img');
if(heroImg){
 const d=await j('content/home.json');
 if(d&&d.heroAlt)heroImg.querySelector('img').alt=d.heroAlt;
 const lead=document.getElementById('intro-lead');
 if(d&&d.introLead&&lead)lead.textContent=d.introLead;
}

const brandsList=document.getElementById('brands-list');
if(brandsList){
 const d=await j('content/brands.json');
 const items=d&&d.items;
 if(items&&items.length){
  brandsList.innerHTML=[...items].sort((a,b)=>(a.order||0)-(b.order||0)).map(b=>{
   const img=`<img src="${b.logo}" alt="${b.name}" onerror="this.replaceWith(document.createTextNode('${b.name.replace(/'/g,"&#39;")}'))">`;
   return `<li>${b.url?`<a href="${b.url}" target="_blank" rel="noopener">${img}</a>`:img}</li>`;
  }).join('');
 }
}

const tList=document.getElementById('testimonials-list');
if(tList){
 const d=await j('content/testimonials.json');
 const items=(d&&d.items||[]).slice().sort((a,b)=>(a.order||0)-(b.order||0));
 if(!items.length){tList.innerHTML='<p class="t-empty">Testimonials from brands I’ve worked with — coming soon.</p>'}
 else tList.innerHTML=items.map(t=>{
  const logo=t.logo?`<img src="${t.logo}" alt="${t.brand||''}">`:'';
  const who=(t.name||t.role||logo)?`<div class="t-who">${logo}<div>${t.name?`<p class="n">${t.name}</p>`:''}${t.role||t.brand?`<p class="r">${[t.role,t.brand].filter(Boolean).join(' · ')}</p>`:''}</div></div>`:'';
  const src=t.source?`<a class="src" href="${t.source}" target="_blank" rel="noopener">View source ↗</a>`:'';
  return `<div class="t-card reveal"><span class="mark">“</span><blockquote>${t.quote||''}</blockquote>${who}${src}</div>`;
 }).join('');
}
if(window.obs)obs();
})();
