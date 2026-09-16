
(function(){
  const root=document.documentElement;
  const saved=localStorage.getItem('arpint-theme')||'dark';
  root.classList.toggle('light',saved==='light');
  root.classList.toggle('dark',saved!=='light');

  window.arpintTheme={
    toggle(){
      const light=!root.classList.contains('light');
      root.classList.toggle('light',light);
      root.classList.toggle('dark',!light);
      localStorage.setItem('arpint-theme',light?'light':'dark');
      document.querySelectorAll('[data-theme-icon]').forEach(e=>e.textContent=light?'☀':'☾');
      document.querySelectorAll('[data-theme-label]').forEach(e=>e.textContent=light?'Modo escuro':'Modo claro');
    },
    init(){
      document.querySelectorAll('[data-theme-icon]').forEach(e=>e.textContent=root.classList.contains('light')?'☀':'☾');
      document.querySelectorAll('[data-theme-label]').forEach(e=>e.textContent=root.classList.contains('light')?'Modo escuro':'Modo claro');
    }
  };

  window.arpintCart={
    get(){try{return JSON.parse(localStorage.getItem('arpint-cart')||'[]')}catch{return[]}},
    set(v){localStorage.setItem('arpint-cart',JSON.stringify(v));},
    count(){return this.get().reduce((s,i)=>s+(+i.quantidade||0),0)},
    add(id,qty=1){
      const c=this.get(), found=c.find(i=>+i.id===+id);
      if(found) found.quantidade+=qty; else c.push({id:+id,quantidade:qty});
      this.set(c); this.update();
    },
    remove(id){this.set(this.get().filter(i=>+i.id!==+id));this.update()},
    clear(){localStorage.removeItem('arpint-cart');this.update()},
    update(){
      document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=this.count());
    }
  };

  window.arpint={
    money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})},
    toast(msg,type='ok'){
      const t=document.createElement('div');
      t.className='toast fixed bottom-6 right-5 z-[999] max-w-sm rounded-xl border border-white/10 bg-[#151515] px-5 py-4 text-sm font-bold text-white shadow-2xl';
      t.innerHTML=`<span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full ${type==='error'?'bg-red-500/15 text-red-400':'bg-[#ff6a00]/15 text-[#ff6a00]'}">${type==='error'?'!':'✓'}</span>${msg}`;
      document.body.appendChild(t);setTimeout(()=>t.remove(),3000);
    },
    async products(){
      const r=await fetch('./data/produtos.json'); if(!r.ok) throw Error('produtos'); return r.json();
    },
    async product(id){const p=await this.products();return p.find(x=>+x.id===+id)}
  };

  document.addEventListener('DOMContentLoaded',()=>{
    arpintTheme.init();arpintCart.update();
    document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>arpintTheme.toggle()));
    document.querySelectorAll('[data-mobile-toggle]').forEach(b=>b.addEventListener('click',()=>{
      document.getElementById('mobile-menu')?.classList.toggle('hidden');
    }));
  });
})();
