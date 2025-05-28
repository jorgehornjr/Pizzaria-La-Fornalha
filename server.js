const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


let pizzas = [];
let idAtual = 1;


app.use(express.json());
app.use(express.static(__dirname));


app.get('/api/pizzas', (req, res) => {
    res.json(pizzas);
});

app.post('/api/pizzas', (req, res) => {
    const { nome, preco, sabores } = req.body;
    const nova = { id: idAtual++, nome, preco, sabores };

    pizzas.push(nova);
    res.status(201).json(nova);
});

app.put('/api/pizzas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pizza = pizzas.find(p => p.id === id);
    if (!pizza) return res.status(404).json({ erro: 'Pizza não encontrada' });

    const { nome, preco, sabores } = req.body;
    pizza.nome = nome;
    pizza.preco = preco;
    pizza.sabores = sabores;
    res.json(pizza);
});


app.delete('/api/pizzas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pizzas = pizzas.filter(p => p.id !== id);
    res.status(204).end();
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
