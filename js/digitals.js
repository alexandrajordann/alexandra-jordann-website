(async()=>{
const grid=document.getElementById('dg-grid');if(!grid)return;
let d={};try{const r=await fetch('content/digitals.json',{cache:'no-store'});d=await r.json()}catch(e){d={}}
if(d.intro)document.getElementById('dg-intro').textContent=d.intro;
grid.innerHTML=(d.images||[]).map(im=>`<figure><span class="ph-wrap" data-label="${im.label||'DIGITAL'}"><img src="${im.file}" alt="${(im.label||'Digital')} — Alexandra Jordann" loading="lazy" onerror="this.parentNode.classList.add('ph')"></span><figcaption>${im.label||''}</figcaption></figure>`).join('');
const slot=document.getElementById('dg-video'),v=d.introVideo||{};
const embed=u=>{let m=u.match(/(?:youtu\.be\/|v=)([\w-]{11})/);if(m)return`https://www.youtube-nocookie.com/embed/${m[1]}`;m=u.match(/vimeo\.com\/(\d+)/);return m?`https://player.vimeo.com/video/${m[1]}`:''};
if(v.video)slot.innerHTML=`<video controls playsinline poster="${v.thumb||''}" src="${v.video}"></video>`;
else if(v.url&&embed(v.url))slot.innerHTML=`<iframe src="${embed(v.url)}" title="Introductory video" allow="fullscreen" allowfullscreen></iframe>`;
else if(v.url)slot.innerHTML=`<a class="btn" href="${v.url}" target="_blank" rel="noopener">Watch intro video ↗</a>`;
else slot.innerHTML='<p class="t-empty">Intro video coming soon.</p>';
if(d.pdf){const a=document.getElementById('dg-pdf');a.href=d.pdf;a.hidden=false}
if(window.obs)obs();
})();
