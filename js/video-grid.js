/* Reusable video grid + modal. Powers any page that just needs a grid of video
   cards with a lightbox player (Content Creation, Video/Acting & Campaigns).
   Call: initVideoGrid({json:'content/x.json', grid:'#vgrid', modal:'#vb', empty:'No items yet.'}) */
window.initVideoGrid=async function(opts){
const g=document.querySelector(opts.grid),vb=document.querySelector(opts.modal);
if(!g||!vb)return;
const e=s=>String(s||'').replace(/"/g,'&quot;');
let items=[];
try{const r=await fetch(opts.json,{cache:'no-store'});items=((await r.json()).items||[]).slice().sort((a,b)=>(a.order||0)-(b.order||0))}catch(err){items=[]}
if(!items.length){g.innerHTML=`<p class="t-empty">${opts.empty||'More coming soon.'}</p>`;return}
g.innerHTML=items.map((v,i)=>`<button class="vc reveal" style="--i:${i}" data-i="${i}" aria-label="Play: ${e(v.title)}"><span class="ph-wrap vt" data-label="${e(v.title||'VIDEO')}"><img src="${v.thumb||''}" alt="" loading="lazy" onerror="this.parentNode.classList.add('ph')"><span class="play"></span></span><span class="vm"><small>${[v.cat||v.role,v.brand].filter(Boolean).join(' · ')}</small><strong>${e(v.title)}</strong></span></button>`).join('');
if(window.obs)obs();
const st=vb.querySelector('.stage'),vs=vb.querySelector('.vcap span'),vi=vb.querySelector('.vcap a');let n=0;
const embed=u=>{let m=u.match(/(?:youtu\.be\/|v=)([\w-]{11})/);if(m)return`https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`;m=u.match(/vimeo\.com\/(\d+)/);return m?`https://player.vimeo.com/video/${m[1]}?autoplay=1`:''};
const showV=i=>{n=(i+items.length)%items.length;const v=items[n];st.innerHTML='';const x=v.url?embed(v.url):'';
 if(v.video){const el=document.createElement('video');el.controls=true;el.playsInline=true;el.poster=v.thumb||'';el.onerror=()=>st.innerHTML='<span class="soon">Video coming soon</span>';el.src=v.video;st.append(el);el.play().catch(()=>{})}
 else if(x)st.innerHTML=`<iframe src="${x}" title="${e(v.title)}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
 else if(v.url)st.innerHTML=`<a class="btn" href="${v.url}" target="_blank" rel="noopener">Watch video ↗</a>`;
 else st.innerHTML='<span class="soon">Video coming soon</span>';
 vs.textContent=[v.brand,v.title].filter(Boolean).join(' · ');const src=v.instagram||v.source;vi.hidden=!src;if(src){vi.href=src;vi.textContent=v.instagram?'View on Instagram ↗':'View source ↗'}};
g.onclick=ev=>{const b=ev.target.closest('.vc');if(b){showV(+b.dataset.i);vb.showModal()}};
vb.querySelector('.x').onclick=()=>vb.close();vb.querySelector('.pv').onclick=()=>showV(n-1);vb.querySelector('.nx').onclick=()=>showV(n+1);
vb.onclick=ev=>{if(ev.target===vb)vb.close()};vb.onkeydown=ev=>{if(ev.key==='ArrowLeft')showV(n-1);if(ev.key==='ArrowRight')showV(n+1)};
vb.addEventListener('close',()=>{st.innerHTML=''});
};
