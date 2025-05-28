 const API_URL = window.location.origin + '/api/pizzas';

    async function carregarPizzas() {
      const res = await fetch(API_URL);
      const pizzas = await res.json();
      const container = document.getElementById('lista-pizzas');

      const adicionarCard = container.querySelector('.adicionar-card');

      container.querySelectorAll('.pizza-card').forEach(card => {
        const img = card.querySelector('img');
        if (img && img.src.includes('personalizado.png')) {
          card.remove();
        }
      });

      pizzas.forEach(pizza => {
        const div = document.createElement('div');
        div.className = 'pizza-card';
        div.id = `pizza-card-${pizza.id}`;
        div.innerHTML = `
      <img src="images/personalizado.png" alt="Pizza Personalizada">
      <div class="pizza-content">
        <h3 id="nome-${pizza.id}">${pizza.nome}</h3>
        <p id="sabores-${pizza.id}">${pizza.sabores}</p>
        <p><strong>R$ <span id="preco-${pizza.id}">${pizza.preco.toFixed(2).replace('.', ',')}</span></strong></p>
        <button class="btn editar-btn" data-id="${pizza.id}">Editar</button>
        <button class="btn" onclick="removerPizza(${pizza.id})">Remover</button>
      </div>
    `;
        container.insertBefore(div, adicionarCard);
      });

      document.querySelectorAll('.editar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          iniciarEdicao(parseInt(id));
        });
      });
    }


    async function adicionarPizza() {
      const nome = prompt('Nome da nova pizza:');
      const sabores = prompt('Descrição/Sabores da pizza:');
      const preco = parseFloat(prompt('Preço da nova pizza:'));
      if (!nome || !sabores || isNaN(preco)) return alert('Dados inválidos.');

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco, sabores })
      });

      const nova = await res.json();

      const novaPizza = document.createElement('div');
      novaPizza.className = 'pizza-card';
      novaPizza.id = `pizza-card-${nova.id}`;
      novaPizza.innerHTML = `
        <img src="images/personalizado.png" alt="Pizza Personalizada">
        <div class="pizza-content">
          <h3 id="nome-${nova.id}">${nova.nome}</h3>
          <p id="sabores-${nova.id}">${nova.sabores}</p>
          <p><strong>R$ <span id="preco-${nova.id}">${nova.preco.toFixed(2).replace('.', ',')}</span></strong></p>
          <button class="btn editar-btn" data-id="${nova.id}">Editar</button>
          <button class="btn" onclick="removerPizza(${nova.id})">Remover</button>
        </div>
      `;

      const container = document.getElementById('lista-pizzas');
      const botaoAdicionar = container.querySelector('.adicionar-card');
      container.insertBefore(novaPizza, botaoAdicionar);

      document.querySelector(`#pizza-card-${nova.id} .editar-btn`).addEventListener('click', () => {
        iniciarEdicao(nova.id);
      });
    }

    function iniciarEdicao(id) {
      const card = document.getElementById(`pizza-card-${id}`);
      const nomeEl = document.getElementById(`nome-${id}`);
      const precoEl = document.getElementById(`preco-${id}`);
      const saboresEl = document.getElementById(`sabores-${id}`);

      const nomeAtual = nomeEl.textContent;
      const precoAtual = precoEl.textContent.replace(',', '.');
      const saboresAtual = saboresEl.textContent;

      nomeEl.innerHTML = `<input type="text" id="input-nome-${id}" value="${nomeAtual}">`;
      precoEl.innerHTML = `<input type="number" id="input-preco-${id}" value="${precoAtual}">`;
      saboresEl.innerHTML = `<input type="text" id="input-sabores-${id}" value="${saboresAtual}">`;

      card.querySelectorAll('.btn').forEach(btn => btn.style.display = 'none');

      const salvarBtn = document.createElement('button');
      salvarBtn.className = 'btn';
      salvarBtn.innerText = 'Salvar';
      salvarBtn.style.marginTop = '10px';
      salvarBtn.onclick = () => salvarEdicao(id);
      card.querySelector('.pizza-content').appendChild(salvarBtn);
    }

    async function salvarEdicao(id) {
      const nome = document.getElementById(`input-nome-${id}`).value;
      const preco = parseFloat(document.getElementById(`input-preco-${id}`).value);
      const sabores = document.getElementById(`input-sabores-${id}`).value;

      if (!nome || !sabores || isNaN(preco)) {
        alert('Dados inválidos.');
        return;
      }

      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco, sabores })
      });

      location.reload();
    }

    async function removerPizza(id) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      location.reload();
    }

    document.addEventListener('DOMContentLoaded', carregarPizzas);