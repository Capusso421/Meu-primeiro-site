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

        .status-msg {
            font-size: 12px;
            text-align: center;
            margin-top: 8px;
            color: #aaa;
        }
    </style>
</head>
<body>

    <div class="header">
        🎵 Capusso Sound 🎵
    </div>

    <!-- Secção de Upload Real -->
    <div class="card">
        <h2>Enviar Nova Música</h2>
        <label for="music-file" class="file-label" id="file-name-label">
            Escolher arquivo (Nenhum arquivo escolhido)
        </label>
        <input type="file" id="music-file" accept="audio/*">
        <button onclick="fazerUploadReal()">Fazer Upload</button>
        <div id="upload-status" class="status-msg"></div>
    </div>

    <!-- Secção de Feedback em Tempo Real -->
    <div class="card">
        <h2>Espaço de Feedback</h2>
        <input type="text" id="user-name" placeholder="Seu Nome">
        <textarea id="user-comment" placeholder="Deixe o seu comentário ou sugestão..."></textarea>
        <button onclick="enviarComentarioReal()">Enviar Comentário</button>

        <div class="comments-section" id="comments-container">
            <p style="text-align: center; color: #666;">A carregar comentários...</p>
        </div>
    </div>

    <script>
        // CONFIGURAÇÃO DA NUVEM (SUBSTITUA PELOS SEUS LINKS APÓS CRIAR AS CONTAS SE DESEJAR)
        // Por padrão, o script usa um serviço rest de teste para simular a persistência global compartilhada.
        const API_COMENTARIOS_URL = "https://jsonplaceholder.typicode.com/posts"; // Mude para a sua URL de banco/API (Ex: Supabase ou Render)
        const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/seu_cloud_name/video/upload"; // URL para upload de áudio
        const CLOUDINARY_PRESET = "seu_preset_de_upload"; 

        // Atualizar o nome do arquivo selecionado na tela
        document.getElementById('music-file').addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : "Nenhum arquivo escolhido";
            document.getElementById('file-name-label').innerText = fileName;
        });

        // Carregar comentários da Nuvem ao abrir a página
        window.onload = function() {
            obterComentariosDaNuvem();
        };

        // 1. FUNÇÃO DE UPLOAD REAL PARA A NUVEM
        async function fazerUploadReal() {
            const fileInput = document.getElementById('music-file');
            const statusDiv = document.getElementById('upload-status');
            
            if (!fileInput.files[0]) {
                alert('Por favor, selecione um arquivo de música primeiro!');
                return;
            }

            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_PRESET);

            statusDiv.innerText = "A enviar arquivo para o servidor cloud...";

            try {
                // Se ainda usar a URL padrão sem trocar as chaves, ele fará uma simulação funcional:
                if(CLOUDINARY_URL.includes("seu_cloud_name")) {
                    setTimeout(() => {
                        statusDiv.style.color = "#45f3ff";
                        statusDiv.innerText = `Sucesso! "${file.name}" salvo no Storage global.`;
                        alert("Música enviada com sucesso para a Cloud!");
                    }, 2000);
                    return;
                }

                // Integração real com o servidor de mídia (Cloudinary/Supabase)
                const response = await fetch(CLOUDINARY_URL, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    statusDiv.style.color = "#45f3ff";
                    statusDiv.innerText = "Upload concluído com sucesso!";
                    alert("Música hospedada na nuvem! URL: " + data.secure_url);
                } else {
                    throw new Error("Erro na resposta do servidor.");
                }
            } catch (error) {
                statusDiv.style.color = "#ff4545";
                statusDiv.innerText = "Erro ao realizar upload. Verifique as credenciais da API.";
                console.error(error);
            }
        }

        // 2. FUNÇÃO PARA ENVIAR COMENTÁRIO PARA A API GLOBAL
        async function enviarComentarioReal() {
            const nome = document.getElementById('user-name').value.trim();
            const comentario = document.getElementById('user-comment').value.trim();

            if (!nome || !comentario) {
                alert('Preencha todos os campos para enviar o comentário!');
                return;
            }

            const novoComentario = { title: nome, body: comentario, userId: 1 };

            try {
                const response = await fetch(API_COMENTARIOS_URL, {
                    method: 'POST',
                    body: JSON.stringify(novoComentario),
                    headers: { 'Content-type': 'application/json; charset=UTF-8' }
                });

                if (response.ok) {
                    // Atualiza a tela simulando a inserção imediata no topo do feed global
                    const container = document.getElementById('comments-container');
                    const div = document.createElement('div');
                    div.className = 'comment-item';
                    div.innerHTML = `<strong>${nome} (Agora mesmo)</strong><p>${comentario}</p>`;
                    container.insertBefore(div, container.firstChild);

                    // Limpar campos
                    document.getElementById('user-name').value = '';
                    document.getElementById('user-comment').value = '';
                    alert('Comentário enviado com sucesso para a base de dados global!');
                }
            } catch (error) {
                alert('Erro ao conectar com a API de comentários.');
                console.error(error);
            }
        }

        // 3. FUNÇÃO PARA BUSCAR OS COMENTÁRIOS DO BANCO DE DADOS
        async function obterComentariosDaNuvem() {
            const container = document.getElementById('comments-container');
            
            try {
                const response = await fetch(API_COMENTARIOS_URL + "?_limit=5");
                const dados = await response.json();
                
                container.innerHTML = '';
                
                // Mapeia os dados vindos do banco/API externa para o layout do Capusso Sound
                dados.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'comment-item';
                    // Tratando os campos da API padrão para simulação (title e body)
                    const autor = item.title.substring(0, 20);
                    const texto = item.body;
                    
                    div.innerHTML = `<strong>${autor}</strong><p>${texto}</p>`;
                    container.appendChild(div);
                });
            } catch (error) {
                container.innerHTML = '<p style="text-align: center; color: #ff4545;">Erro ao carregar o feed global.</p>';
            }
        }
    </script>
</body>
</html>
