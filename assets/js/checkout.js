
let PRODUCTS=[];let method='card';
const c=arpintCart.get();
function luhn(v){let s=v.replace(/\D/g,'');let sum=0,dbl=false;for(let i=s.length-1;i>=0;i--){let n=+s[i];if(dbl){n*=2;if(n>9)n-=9}sum+=n;dbl=!dbl}return s.length>=13&&sum%10===0}
function render(){
 const box=document.querySelector('#summary');let total=0;
 box.innerHTML=c.map(i=>{const p=PRODUCTS.find(x=>+x.id===+i.id);if(!p)return '';total+=p.preco*i.quantidade;return `<div class="flex justify-between gap-3 text-sm"><span class="text-muted">${i.quantidade}× ${p.nome}</span><b>${arpint.money(p.preco*i.quantidade)}</b></div>`}).join('');
 const ship=+localStorage.getItem('arpint-shipping')||0;total+=ship;
 if(ship)box.innerHTML+=`<div class="flex justify-between text-sm"><span class="text-muted">Frete</span><b>${arpint.money(ship)}</b></div>`;
 document.querySelector('#checkout-total').textContent=arpint.money(total);
}
document.querySelectorAll('.pay-method').forEach(b=>b.onclick=()=>{method=b.dataset.method;document.querySelectorAll('.pay-method').forEach(x=>x.classList.remove('border-[#ff6a00]/50','bg-[#ff6a00]/10','orange'));b.classList.add('border-[#ff6a00]/50','bg-[#ff6a00]/10','orange');document.querySelector('#card-fields').classList.toggle('hidden',method!=='card');document.querySelector('#pix-fields').classList.toggle('hidden',method!=='pix');document.querySelector('#boleto-fields').classList.toggle('hidden',method!=='boleto')});
document.querySelector('#card').addEventListener('input',e=>{let v=e.target.value.replace(/\D/g,'').slice(0,16);e.target.value=v.replace(/(.{4})/g,'$1 ').trim()});
document.querySelector('#expiry').addEventListener('input',e=>{let v=e.target.value.replace(/\D/g,'').slice(0,4);if(v.length>2)v=v.slice(0,2)+'/'+v.slice(2);e.target.value=v});
document.querySelector('#cep').addEventListener('input',e=>{let v=e.target.value.replace(/\D/g,'').slice(0,8);if(v.length>5)v=v.slice(0,5)+'-'+v.slice(5);e.target.value=v});
document.querySelector('#checkout-form').addEventListener('submit',e=>{
 e.preventDefault();
 if(!c.length){arpint.toast('Seu carrinho está vazio.','error');return}
 if(method==='card'&&!luhn(document.querySelector('#card').value)){arpint.toast('Cartão inválido para a demonstração.','error');return}
 const name=document.querySelector('#name').value.trim();
 const order='ARP-'+Date.now().toString().slice(-7);
 localStorage.setItem('arpint-last-order',JSON.stringify({order,name,method,total:document.querySelector('#checkout-total').textContent}));
 arpintCart.clear();location.href=`./sucesso.html?pedido=${order}`;
});
(async()=>{PRODUCTS=await arpint.products();render()})();
