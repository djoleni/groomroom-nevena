(()=>{'use strict';
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,root=document.documentElement;
root.classList.add('js');
const TEL='+381655745696';
/* clean URL: no hash ever, logo/top links really go to top */
const clean=()=>history.replaceState(null,'',location.pathname+location.search);
const goto=id=>{const el=id==='#top'?null:$(id);scrollTo({top:el?el.getBoundingClientRect().top+scrollY-($('#hdr').offsetHeight-4):0,behavior:reduce?'auto':'smooth'});clean()};
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;e.preventDefault();closeMenu();goto(a.getAttribute('href'))});
if(location.hash)clean();
/* splash + hero entrance */
const sp=$('#splash');let ready=false;
const start=()=>{if(ready)return;ready=true;try{sessionStorage.gr=1}catch(e){}
 $$('.hero h1 span').forEach((s,i)=>s.style.setProperty('--n',i));$$('.hero-txt>*:not(h1)').forEach((s,i)=>s.style.setProperty('--n',i+4));
 if(sp){sp.classList.add('out');setTimeout(()=>sp.remove(),900)}root.classList.remove('splash');requestAnimationFrame(()=>root.classList.add('ready'))};
if(root.classList.contains('splash')){setTimeout(start,1500);sp.addEventListener('click',start)}else addEventListener('load',start,{once:true});
setTimeout(start,3000);
/* mobile menu with focus trap */
const nav=$('#nav'),bg=$('#burger');
function closeMenu(){nav.classList.remove('open');bg.setAttribute('aria-expanded','false');document.body.style.overflow=''}
bg.addEventListener('click',()=>{const o=bg.getAttribute('aria-expanded')==='true';if(o)return closeMenu();nav.classList.add('open');bg.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';$('a',nav).focus()});
document.addEventListener('keydown',e=>{if(!nav.classList.contains('open'))return;if(e.key==='Escape'){closeMenu();bg.focus()}
 if(e.key==='Tab'){const f=[bg,...$$('a',nav)],i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f.at(-1).focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
/* scroll effects (rAF) */
const hdr=$('#hdr'),bar=$('.progress'),par=$('[data-par]');let tick=false;
const onScroll=()=>{tick=false;const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;hdr.classList.toggle('s',y>20);bar.style.transform=`scaleX(${h>0?y/h:0})`;if(par&&!reduce&&y<innerHeight)par.style.transform=`translateY(${y*.08}px)`};
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
/* reveal + scrollspy + counters */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});$$('.rv').forEach(el=>io.observe(el));
const links=$$('#nav a'),spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>spy.observe(s));
$$('[data-count]').forEach(el=>{const t=+el.dataset.count;if(reduce)return;new IntersectionObserver(([e],o)=>{if(!e.isIntersecting)return;o.disconnect();const t0=performance.now(),f=n=>{const p=Math.min((n-t0)/1200,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}).observe(el)});
/* falling petals */
const pe=$('.petals');if(pe&&!reduce)for(let i=0;i<12;i++){const p=document.createElement('i');p.style.cssText=`left:${Math.random()*100}%;--dx:${(Math.random()*160-80)|0}px;animation-duration:${10+Math.random()*10}s;animation-delay:${-Math.random()*16}s;transform:scale(${.7+Math.random()*.8})`;pe.append(p)}
/* magnetic buttons (desktop) */
if(!reduce&&matchMedia('(hover:hover) and (pointer:fine)').matches)$$('.mag').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.28}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});
/* open/closed in Europe/Belgrade */
const H={1:[12,19],2:[8,15],3:[12,19],4:[8,15],5:[8,15]},DN=['nedelju','ponedeljak','utorak','sredu','četvrtak','petak','subotu'],WD={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
function status(){const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Belgrade',weekday:'short',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
 const d=WD[p.weekday],m=+p.hour*60+ +p.minute,t=H[d];let txt,open=false;
 if(t&&m>=t[0]*60&&m<t[1]*60){open=true;txt=`Otvoreno do ${t[1]}:00`}else{let n=t&&m<t[0]*60?0:1;while(n<8&&!H[(d+n)%7])n++;const nd=(d+n)%7;txt=`Zatvoreno, otvaramo ${n===0?'danas':n===1?'sutra':'u '+DN[nd]} u ${String(H[nd][0]).padStart(2,'0')}:00`}
 $$('[data-status]').forEach(s=>{s.classList.toggle('open',open);$('[data-status-txt]',s).textContent=txt});$$('#hours li').forEach(li=>li.classList.toggle('today',+li.dataset.d===d))}
status();setInterval(status,6e4);
/* gallery lightbox */
const lb=$('#lb'),lim=$('img',lb),gs=$$('.g');let cur=0,opener;
const show=i=>{cur=(i+gs.length)%gs.length;const s=$('img',gs[cur]);lim.classList.remove('miss');lb.classList.remove('ph');lim.src=s.src;lim.alt=s.alt};
gs.forEach((g,i)=>g.addEventListener('click',()=>{opener=g;show(i);lb.showModal()}));
$('.lb-x').onclick=()=>lb.close();$('.lb-p').onclick=()=>show(cur-1);$('.lb-n').onclick=()=>show(cur+1);
lb.addEventListener('click',e=>{if(e.target===lb)lb.close()});lb.addEventListener('close',()=>opener&&opener.focus());
lb.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
let sx=0;lb.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1))});
/* missing image -> on-brand placeholder */
const miss=i=>{if(!i.getAttribute('src')||i.closest('#lb'))return;i.classList.add('miss');(i.closest('.g,.arch,.blob')||i.parentElement).classList.add('ph')};
document.addEventListener('error',e=>{if(e.target.tagName==='IMG')miss(e.target)},true);
$$('img').forEach(i=>i.complete&&i.naturalWidth===0&&miss(i));
/* contact form: opens WhatsApp chat with the message prefilled, in a new window */
$('#form').addEventListener('submit',e=>{e.preventDefault();const f=e.target,t=`Zdravo, ovde ${f.ime.value}.${f.rasa.value?` Rasa psa: ${f.rasa.value}.`:''}\n${f.poruka.value}`;window.open(`https://wa.me/381655745696?text=${encodeURIComponent(t)}`,'_blank','noopener')});
$('#yr').textContent=new Date().getFullYear();
})();
