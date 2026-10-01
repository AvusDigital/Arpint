
let PRODUCTS = [];
const itemsBox = document.querySelector('#cart-items');
const empty = document.querySelector('#cart-empty');
const subtotalEl = document.querySelector('#subtotal'), shipEl = document.querySelector('#shipping'), totalEl = document.querySelector('#total');
let shipping = 0;
function save(c) { arpintCart.set(c); render() }
function render() {
    const c = arpintCart.get();
    if (!c.length) { itemsBox.innerHTML = ''; empty.classList.remove('hidden'); document.querySelector('#checkout-link').classList.add('pointer-events-none', 'opacity-40'); subtotalEl.textContent = arpint.money(0); shipEl.textContent = 'Informe o CEP'; totalEl.textContent = arpint.money(0); return }
    empty.classList.add('hidden'); document.querySelector('#checkout-link').classList.remove('pointer-events-none', 'opacity-40');
    let sub = 0;
    itemsBox.innerHTML = c.map(i => {
        const p = PRODUCTS.find(x => +x.id === +i.id); if (!p) return '';
        sub += p.preco * i.quantidade;
        return `<div class="flex gap-4 rounded-2xl border border-theme bg-panel p-4">
   <div class="product-image h-28 w-28 shrink-0 overflow-hidden rounded-xl"><img src="${p.imagem}" onerror="this.onerror=null;this.src='./assets/images/produtos/placeholder.svg'" class="h-full w-full object-contain p-2"></div>
   <div class="min-w-0 flex-1"><div class="flex justify-between gap-3"><div><a href="./produto.html?id=${p.id}" class="font-black hover:orange">${p.nome}</a><p class="mt-1 text-xs text-muted">${p.sku}</p></div><button data-remove="${p.id}" class="text-xl text-muted hover:text-red-400">×</button></div><div class="mt-5 flex items-center justify-between"><div class="flex items-center rounded-lg border border-theme"><button data-minus="${p.id}" class="px-3 py-2">−</button><span class="min-w-8 text-center text-sm font-bold">${i.quantidade}</span><button data-plus="${p.id}" class="px-3 py-2">+</button></div><b class="text-lg">${arpint.money(p.preco * i.quantidade)}</b></div></div>
  </div>`;
    }).join('');
    subtotalEl.textContent = arpint.money(sub);
    shipEl.textContent = shipping ? arpint.money(shipping) : 'Informe o CEP';
    totalEl.textContent = arpint.money(sub + shipping);
    itemsBox.querySelectorAll('[data-remove]').forEach(b => b.onclick = () => { arpintCart.remove(+b.dataset.remove); render() });
    itemsBox.querySelectorAll('[data-minus]').forEach(b => b.onclick = () => change(+b.dataset.minus, -1));
    itemsBox.querySelectorAll('[data-plus]').forEach(b => b.onclick = () => change(+b.dataset.plus, 1));
    localStorage.setItem('arpint-shipping', shipping);
}
function change(id, d) { let c = arpintCart.get(), i = c.find(x => +x.id === id); if (!i) return; i.quantidade += d; if (i.quantidade <= 0) c = c.filter(x => +x.id !== id); save(c) }
// Transportadoras simuladas (estilo comparador tipo SuperFrete).
// multiplicador aplicado sobre o frete-base calculado por peso/valor, e faixa de prazo (dias úteis).
const CARRIERS = [
    { id: 'correios-pac', empresa: 'Correios', servico: 'PAC', cor: '#003399', mult: 1.00, prazo: [5, 10] },
    { id: 'correios-sedex', empresa: 'Correios', servico: 'SEDEX', cor: '#003399', mult: 1.48, prazo: [2, 5] },
    { id: 'jadlog-package', empresa: 'Jadlog', servico: '.Package', cor: '#e30613', mult: 0.86, prazo: [6, 12] },
    { id: 'jadlog-com', empresa: 'Jadlog', servico: '.Com', cor: '#e30613', mult: 1.15, prazo: [3, 6] },
    { id: 'azul-cargo', empresa: 'Azul Cargo', servico: 'Express', cor: '#1e40af', mult: 1.65, prazo: [1, 3] },
];

function calcShipping() {
    const cep = document.querySelector('#cep').value.replace(/\D/g, '');
    const results = document.querySelector('#shipping-results');
    if (cep.length !== 8) { arpint.toast('Digite um CEP válido com 8 números.', 'error'); return }
    results.innerHTML = '<div class="text-sm text-muted">Consultando CEP e comparando transportadoras...</div>';
    fetch(`https://viacep.com.br/ws/${cep}/json/`).then(r => r.json()).then(addr => {
        if (addr.erro) throw Error('cep');
        const c = arpintCart.get(); let weight = 0;
        c.forEach(i => { const p = PRODUCTS.find(x => +x.id === +i.id); if (p) weight += p.peso * i.quantidade });
        const subtotal = c.reduce((s, i) => { const p = PRODUCTS.find(x => +x.id === +i.id); return s + (p ? p.preco * i.quantidade : 0) }, 0);
        const base = Math.max(18, 15 + weight / 1000 * 7 + Math.min(40, subtotal / 200));

        const options = CARRIERS.map(cr => ({
            ...cr,
            preco: +(base * cr.mult).toFixed(2),
        })).sort((a, b) => a.preco - b.preco);

        shipping = options[0].preco;

        results.innerHTML = options.map((o, idx) => `
            <button
                data-choose="${o.id}"
                data-preco="${o.preco}"
                class="flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${idx === 0 ? 'border-[#ff6a00]/30 bg-[#ff6a00]/5' : 'border-theme hover:border-orange'}"
            >
                <div class="flex items-center gap-3">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-black text-white" style="background:${o.cor}">
                        ${o.empresa.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                        <b>${o.empresa} <span class="font-normal text-muted">${o.servico}</span></b>
                        <p class="text-xs text-muted">${addr.localidade}/${addr.uf} · estimado ${o.prazo[0]}–${o.prazo[1]} dias úteis</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    ${idx === 0 ? '<span class="rounded-full bg-[#ff6a00]/15 px-2 py-0.5 text-[10px] font-black orange">MAIS BARATO</span>' : ''}
                    <strong class="${idx === 0 ? 'orange' : ''}">${arpint.money(o.preco)}</strong>
                </div>
            </button>
        `).join('') + `<p class="text-[11px] leading-5 text-muted">Comparativo demonstrativo entre transportadoras, baseado em peso/valor do carrinho. Os valores e prazos oficiais dependem de contrato, dimensões, origem/destino e tabela vigente de cada transportadora.</p>`;

        results.querySelectorAll('[data-choose]').forEach(btn => {
            btn.onclick = () => {
                shipping = +btn.dataset.preco;
                render();
                results.querySelectorAll('[data-choose]').forEach(b => b.classList.remove('border-[#ff6a00]/30', 'bg-[#ff6a00]/5'));
                btn.classList.add('border-[#ff6a00]/30', 'bg-[#ff6a00]/5');
            };
        });
        render();
    }).catch(() => { results.innerHTML = '<p class="text-sm text-red-400">Não foi possível consultar esse CEP.</p>' });
}
document.querySelector('#calc-shipping').onclick = calcShipping;
document.querySelector('#cep').addEventListener('input', e => { let v = e.target.value.replace(/\D/g, '').slice(0, 8); if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5); e.target.value = v });
(async () => { PRODUCTS = await arpint.products(); shipping = +localStorage.getItem('arpint-shipping') || 0; render() })();