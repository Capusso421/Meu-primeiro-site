const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

// Configurações para ler JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir os ficheiros visuais do site (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

const BANCO_FILE = path.join(__dirname, 'comentários.json');
const SENHA_ADMIN = 'admin123';

function lerBanco() {
    if (!fs.existsSync(BANCO_FILE)) return [];
    try {
        const conteudo = fs.readFileSync(BANCO_FILE, 'utf-8');
        return JSON.parse(conteudo || '[]');
    } catch (e) {
        return [];
    }
}

function salvarNoBanco(dados) {
    fs.writeFileSync(BANCO_FILE, JSON.stringify(dados, null, 2));
}

// Comentários - Listar
app.get('/api/comentários', (req, res) => {
    res.json(lerBanco());
});

// Comentários - Salvar
app.post('/api/comentários', (req, res) => {
    const { nome, mensagem } = req.body;
    if (!nome || !mensagem) return res.status(400).json({ error: 'Campos inválidos' });
    const comentarios = lerBanco();
    comentarios.push({ id: Date.now(), nome, mensagem });
    salvarNoBanco(comentarios);
    res.json({ status: 'sucesso' });
});

// ROTA ADMIN: Excluir Comentário
app.delete('/api/comentários/:id', (req, res) => {
    const { senha } = req.query;
    if (senha !== SENHA_ADMIN) return res.status(403).json({ error: 'Não autorizado' });
    
    let comentarios = lerBanco();
    const idParaRemover = parseInt(req.params.id);
    comentarios = comentarios.filter(c => c.id !== idParaRemover);
    salvarNoBanco(comentarios);
    res.json({ status: 'sucesso' });
});

// Rota para o Upload
app.post('/upload', (req, res) => {
    res.send('Funcionalidade de upload a ser processada pelo servidor!');
});

// Iniciar o Servidor na porta correta para o Render
app.listen(PORT, () => {
    console.log(`Servidor a rodar na porta ${PORT}`);
});
