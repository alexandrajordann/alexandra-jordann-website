document.getElementById('yr').textContent=new Date().getFullYear();
document.querySelectorAll('.drop').forEach(d=>{
 d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.drop').forEach(o=>{if(o!==d)o.open=false})});
});
document.addEventListener('click',e=>{if(!e.target.closest('.drop'))document.querySelectorAll('.drop[open]').forEach(d=>d.open=false)});
const b=document.querySelector('.burger'),m=document.getElementById('menu');
b.onclick=()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)};
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
const obs=()=>document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));obs();
window.obs=obs;
const f=document.getElementById('enq');
if(f)f.onsubmit=async e=>{e.preventDefault();const s=document.getElementById('status');
 if(!f.checkValidity()||!f.querySelector('[name=Platforms]:checked')){s.textContent='Please complete all required fields (*) and choose at least one platform.';f.reportValidity();return}
 if(!window.FORM_ENDPOINT){s.textContent='Form not connected yet — add your Formspree address in js/config.js.';return}
 const d=new FormData(f),pl=d.getAll('Platforms').join(', ');d.delete('Platforms');d.set('Platforms',pl);
 try{const r=await fetch(FORM_ENDPOINT,{method:'POST',body:d,headers:{Accept:'application/json'}});
  if(r.ok){f.reset();s.textContent='Thank you — your enquiry has been sent. I’ll be in touch soon.'}else throw 0}
 catch{s.textContent='Something went wrong. Please try again.'}};
