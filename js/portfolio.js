(async()=>{
const g=document.getElementById('grid'),vg=document.getElementById('vgrid');
/* Content comes from content/portfolio.json and content/videos.json — the files
   the CMS (Decap, at /admin) edits. Sorted by their "order" field. */
const fetchJSON=async(p,fb)=>{try{const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw 0;return await r.json()}catch(e){return fb}};
const byOrder=(a,b)=>(a.order||0)-(b.order||0);
const P=((await fetchJSON('content/portfolio.json',{items:window.PHOTOS||[]})).items||[]).slice().sort(byOrder);
const V=((await fetchJSON('content/videos.json',{items:window.VIDEOS||[]})).items||[]).slice().sort(byOrder);
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1),e=s=>String(s).replace(/"/g,'&quot;');
/* Layout blocks. Each fills a rectangle exactly. Letters = preferred photo shape per slot. */
const T={fl:['p','l','l'],tri:['p','p','p'],duo:['l','p'],fr:['p','l','l'],pan:['l'],duo2:['p','p']},CYC=['fl','tri','duo','fr','pan','duo2'];
function layout(list){let out='',i=0,c=0,bi=0;
 while(i<list.length){const rem=list.length-i;let t=CYC[c++%CYC.length];if(T[t].length>rem)t=rem===2?'duo':'pan';
  const pool=list.slice(i,i+T[t].length);i+=T[t].length;
  const html=T[t].map((s,k)=>{let x=pool.findIndex(p=>p.shape===s);if(x<0)x=0;const p=pool.splice(x,1)[0],alt=e(p.alt||cap(p.cat)+' photography by Alexandra Jordann');
   return `<figure class="ph-wrap it s${k+1}" data-c="${p.cat}" data-cl="${e(p.client||'')}" data-label="PHOTO" tabindex="0" role="button" aria-label="Open photo: ${alt}"><img src="${p.file}" alt="${alt}" loading="lazy" onerror="this.parentNode.classList.add('ph')"><figcaption>${cap(p.cat)}${p.client?' · '+e(p.client):''}</figcaption></figure>`}).join('');
  out+=`<div class="blk ${t} n${T[t].length} reveal" style="--i:${bi++}">${html}</div>`}
 return out}
function render(f){const isC=f==='content';g.hidden=isC;vg.hidden=!isC;
 if(isC){vg.innerHTML=V.map((v,i)=>`<button class="vc reveal" style="--i:${i}" data-i="${i}" aria-label="Play video: ${e(v.title)}"><span class="ph-wrap vt" data-label="CONTENT ${String(i+1).padStart(2,'0')}"><img src="${v.thumb||'images/content/none'}" alt="" loading="lazy" onerror="this.parentNode.classList.add('ph')"><span class="play"></span></span><span class="vm"><small>${[v.cat,v.brand].filter(Boolean).join(' · ')}</small><strong>${v.title}</strong></span></button>`).join('')}
 else g.innerHTML=layout(P.filter(p=>f==='all'?p.all!==false:p.cat===f));
 obs()}
document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
 g.classList.add('fade');vg.classList.add('fade');setTimeout(()=>{render(b.dataset.f);g.classList.remove('fade');vg.classList.remove('fade')},250)});
render('all');
/* Photo lightbox */
const lb=document.getElementById('lb'),li=lb.querySelector('img'),lc=lb.querySelector('p');let cur=[],idx=0;
const showP=i=>{idx=(i+cur.length)%cur.length;const el=cur[idx],im=el.querySelector('img');li.src=im.src;li.alt=im.alt;lc.textContent=cap(el.dataset.c)+(el.dataset.cl?' · '+el.dataset.cl:'')+' · '+(idx+1)+'/'+cur.length};
const openP=el=>{cur=[...g.querySelectorAll('.it')];showP(cur.indexOf(el));lb.showModal()};
g.onclick=ev=>{const el=ev.target.closest('.it');if(el)openP(el)};
g.onkeydown=ev=>{const el=ev.target.closest('.it');if(el&&(ev.key==='Enter'||ev.key===' ')){ev.preventDefault();openP(el)}};
lb.querySelector('.x').onclick=()=>lb.close();lb.querySelector('.pv').onclick=()=>showP(idx-1);lb.querySelector('.nx').onclick=()=>showP(idx+1);
lb.onclick=ev=>{if(ev.target===lb)lb.close()};lb.onkeydown=ev=>{if(ev.key==='ArrowLeft')showP(idx-1);if(ev.key==='ArrowRight')showP(idx+1)};
let sx=0;lb.ontouchstart=ev=>sx=ev.touches[0].clientX;lb.ontouchend=ev=>{const d=ev.changedTouches[0].clientX-sx;if(Math.abs(d)>50)showP(idx+(d<0?1:-1))};
/* Video modal: the video only loads when opened */
const vb=document.getElementById('vb'),st=vb.querySelector('.stage'),vs=vb.querySelector('.vcap span'),vi=vb.querySelector('.vcap a');let n=0;
const embed=u=>{let m=u.match(/(?:youtu\.be\/|v=)([\w-]{11})/);if(m)return`https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`;m=u.match(/vimeo\.com\/(\d+)/);return m?`https://player.vimeo.com/video/${m[1]}?autoplay=1`:''};
const showV=i=>{n=(i+V.length)%V.length;const v=V[n];st.innerHTML='';const x=v.url?embed(v.url):'';
 if(v.video){const el=document.createElement('video');el.controls=true;el.playsInline=true;el.poster=v.thumb||'';el.onerror=()=>st.innerHTML='<span class="soon">Video coming soon</span>';el.src=v.video;st.append(el);el.play().catch(()=>{})}
 else if(x)st.innerHTML=`<iframe src="${x}" title="${e(v.title)}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
 else if(v.url)st.innerHTML=`<a class="btn" href="${v.url}" target="_blank" rel="noopener">Watch video ↗</a>`;
 else st.innerHTML='<span class="soon">Video coming soon</span>';
 vs.textContent=[v.brand,v.title].filter(Boolean).join(' · ');vi.hidden=!v.instagram;if(v.instagram)vi.href=v.instagram};
vg.onclick=ev=>{const b=ev.target.closest('.vc');if(b){showV(+b.dataset.i);vb.showModal()}};
vb.querySelector('.x').onclick=()=>vb.close();vb.querySelector('.pv').onclick=()=>showV(n-1);vb.querySelector('.nx').onclick=()=>showV(n+1);
vb.onclick=ev=>{if(ev.target===vb)vb.close()};vb.onkeydown=ev=>{if(ev.key==='ArrowLeft')showV(n-1);if(ev.key==='ArrowRight')showV(n+1)};
vb.addEventListener('close',()=>{st.innerHTML=''});
})();
