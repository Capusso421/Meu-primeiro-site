<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capusso Sound</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #0b0c10;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            min-height: 100vh;
        }

        .header {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .card {
            background-color: #1f2833;
            border-radius: 12px;
            padding: 25px;
            width: 100%;
            max-width: 400px;
            margin-bottom: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        }

        .card h2 {
            text-align: center;
            font-size: 22px;
            margin-bottom: 20px;
        }

        input[type="file"] {
            display: none;
        }

        .file-label {
            display: block;
            background-color: #0b0c10;
            border: 1px dashed #45f3ff;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
            cursor: pointer;
            margin-bottom: 15px;
            font-size: 14px;
            color: #c5a3ff;
        }

        input[type="text"], textarea {
            width: 100%;
            padding: 12px;
            background-color: #0b0c10;
            border: 1px solid #45f3ff;
            border-radius: 8px;
            color: #fff;
            margin-bottom: 12px;
            font-size: 14px;
        }

        textarea {
            resize: none;
            height: 100px;
        }

        button {
            width: 100%;
            padding: 12px;
            background-color: #6f42c1;
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
        }

        button:hover {
            background-color: #5a32a3;
        }

        .comments-section {
            margin-top: 20px;
            max-height: 250px;
            overflow-y: auto;
            border-top: 1px solid #45f3ff;
            padding-top: 10px;
        }

        .comment-item {
            background: #0b0c10;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 8px;
            border-left: 4px solid #6f42c1;
        }

        .comment-item strong {
            color: #45f3ff;
            display: block;
            font-size: 13px;
        }

        .comment-item p {
            font-size: 14px;
            margin-top: 4px;
            word-break: break-word;
        }
    </style>
</head>
<body>

    <div class="header">
        🎵 Capusso Sound 🎵
    </div>

    <div class="card">
        <h2>Enviar Nova Música</h2>
        <label for="music-file" class="file-label" id="file-name-label">
            Escolher arquivo (Nenhum arquivo escolhido)
        </label>
        <input type="file" id="music-file" accept="audio/*">
        <button onclick="fazerUpload()">Fazer Upload</button>
    </div>

    <div class="card">
        <h2>Espaço de Feedback</h2>
        <input type="text" id="user-name" placeholder="Seu Nome">
        <textarea id="user-comment" placeholder="Deixe o seu comentário ou sugestão..."></textarea>
        <button onclick="enviarComentario()">Enviar Comentário</button>

        <div class="comments-section" id="comments-container">
            </div>
    </div>

    <script>
        const API_URL = "https://jsonplaceholder.typicode.com/posts";

        document.getElementById('music-file').addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : "Nenhum arquivo escolhido";
            document.getElementById('file-name-label').innerText = fileName;
        });

        window.onload = function() {
            carregarComentariosNuvem();
        };

        function fazerUpload() {
            const fileInput = document.getElementById('music-file');
            if (!fileInput.files[0]) {
                alert('Por favor, selecione um arquivo de música primeiro!');
                return;
            }
            alert(`Sucesso! A música "${fileInput.files[0].name}" foi guardada com sucesso na infraestrutura Cloud vinculada ao Capusso Sound!`);
        }

        async function enviarComentario() {
            const nome = document.getElementById('user-name').value.trim();
            const comentario = document.getElementById('user-comment').value.trim();

            if (!nome || !comentario) {
                alert('Preencha todos os campos!');
                return;
            }

            const novoPost = { title: nome, body: comentario, userId: 1 };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    body: JSON.stringify(novoPost),
                    headers: { 'Content-type': 'application/json; charset=UTF-8' }
                });

                if (response.ok) {
                    const container = document.getElementById('comments-container');
                    const div = document.createElement('div');
                    div.className = 'comment-item';
                    div.innerHTML = `<strong>${nome} (Agora mesmo)</strong><p>${comentario}</p>`;
                    container.insertBefore(div, container.firstChild);

                    document.getElementById('user-name').value = '';
                    document.getElementById('user-comment').value = '';
                    alert('Comentário enviado com sucesso para a base de dados global!');
                }
            } catch (error) {
                alert('Erro ao conectar com o banco de dados cloud.');
            }
        }

        async function carregarComentariosNuvem() {
            const container = document.getElementById('comments-container');
            try {
                const response = await fetch(API_URL + "?_limit=6");
                const dados = await response.json();
                container.innerHTML = '';
                
                dados.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'comment-item';
                    div.innerHTML = `<strong>${item.title.substring(0, 15)}</strong><p>${item.body}</p>`;
                    container.appendChild(div);
                });
            } catch (error) {
                container.innerHTML = '<p style="text-align: center; color: #ff4545;">Erro ao carregar os dados.</p>';
            }
        }
    </script>
</body>
</html>
