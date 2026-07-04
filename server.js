const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const FICHEIRO_BANCO = './comentarios.json';
const SENHA_ADMIN = '1234'; // CHAVE DE SEGURANÇA: Mude aqui se quiser outra senha!

function lerBanco() {
    if (!fs.existsSync(FICHEIRO_BANCO)) fs.writeFileSync(FICHEIRO_BANCO, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(FICHEIRO_BANCO, 'utf-8'));
}
function salvarNoBanco(dados) {
    fs.writeFileSync(FICHEIRO_BANCO, JSON.stringify(dados, null, 2));
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'uploads/'); },
    filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/arquivos-musica', express.static('uploads'));

// Upload
app.post('/upload', upload.single('musica'), (req, res) => {
    if (!req.file) return res.status(400).send('Nenhum arquivo enviado.');
    res.send('<h3>Música carregada com sucesso!</h3><a href="/">Voltar ao site</a>');
});

// Lista Músicas
app.get('/api/musicas', (req, res) => {
    const pastaUploads = path.join(__dirname, 'uploads');
    if (!fs.existsSync(pastaUploads)) fs.mkdirSync(pastaUploads);
    fs.readdir(pastaUploads, (err, arquivos) => {
        if (err) return res.status(500).json({ error: 'Erro' });
        const musicas = arquivos.filter(arq => arq.endsWith('.mp3') || arq.endsWith('.mpeg') || arq.endsWith('.ogg') || arq.endsWith('.wav'));
        res.json(musicas);
    });
});

// ROTA ADMIN: Excluir Música
app.delete('/api/musicas/:nome', (req, res) => {
    const { senha } = req.query;
    if (senha !== SENHA_ADMIN) return res.status(403).json({ error: 'Senha incorreta' });

    const caminhoArquivo = path.join(__dirname, 'uploads', req.params.nome);
    if (fs.existsSync(caminhoArquivo)) {
        fs.unlinkSync(caminhoArquivo); // Apaga o arquivo físico do celular
        res.json({ status: 'sucesso' });
    } else {
        res.status(404).json({ error: 'Arquivo não encontrado' });
    }
});

// Comentários - Listar
app.get('/api/comentarios', (req, res) => { res.json(lerBanco().reverse()); });

// Comentários - Salvar
app.post('/api/comentarios', (req, res) => {
    const { nome, mensagem } = req.body;
    if (!nome || !mensagem) return res.status(400).json({ error: 'Campos obrigatórios' });
    const comentarios = lerBanco();
    comentarios.push({ id: Date.now(), nome, mensagem });
    salvarNoBanco(comentarios);
    res.json({ status: 'sucesso' });
});

// ROTA ADMIN: Excluir Comentário
app.delete('/api/comentarios/:id', (req, res) => {
    const { senha } = req.query;
    if (senha !== SENHA_ADMIN) return res.status(403).json({ error: 'Senha incorreta' });

    let comentarios = lerBanco();
    const idParaRemover = parseInt(req.params.id);
    comentarios = comentarios.filter(c => c.id !== idParaRemover);
    salvarNoBanco(comentarios);
    res.json({ status: 'sucesso' });
});

app.listen(PORT, (const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor a rodar na porta ${PORT}`);
});) => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
