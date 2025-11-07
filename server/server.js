// server/server.js
import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3'; 
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

// 1. CONFIGURAÇÃO DE MIDDLEWARE
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // ✅ Métodos corretos, incluindo PUT e DELETE
    credentials: true,
}));

app.use(bodyParser.json());

// 2. CONFIGURAÇÃO DO BANCO DE DADOS
const db = new sqlite3.Database(path.join(__dirname, 'notes.db'), (err) => {
    if(err) {
        console.error('Erro ao abrir a base de dados:', err.message);
    } else {
        console.log('Conectado a base de dados SQLite.');

        // ✅ Corrigida a coluna Content/Content e adicionado 'updatedAt' (útil para edição)
        db.run(`CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT, 
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});


// ROTA 0: SAÚDE (ROOT) - GET /
app.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'API AnnotAction está em execução.',
        available_endpoints: [
            '/api/notes (GET/POST)',
            '/api/notes/:id (GET/PUT/DELETE)'
        ]
    });
});


// ROTA 1: SALVAR / CRIAR: POST
app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;

    if(!content) {
        return res.status(400).json({ error: 'O conteúdo da nota é obrigatório'});
    }

    // ✅ Corrigido: Agora insere na coluna 'title' (singular)
    const sql = `INSERT INTO notes (title, content) VALUES (?, ?)`;
    db.run(sql, [title || 'Nota sem Titulo', content], function(err){
        if(err){
            console.error('Erro ao salvar nota:', err.message);
            return res.status(500).json({error: 'Erro interno ao salvar nota.'});
        }

        res.status(201).json({
            message: 'Nota salva com sucesso',
            id: this.lastID // ✅ Corrigido: O SQLite usa this.lastID
        });
    });
});

// ROTA 2: BUSCAR POR ID: GET
// ✅ Corrigido: Uso de ':id' no path para capturar o parâmetro
app.get('/api/notes/:id', (req, res) => {
    const { id } = req.params; // Captura o ID corretamente do parâmetro

    // ✅ Corrigido: Coluna 'content' (minúsculo)
    const sql = `SELECT id, title, content, createdAt, updatedAt FROM notes WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        if(err) {
            console.error('Erro ao buscar nota:', err.message);
            return res.status(500).json({error: 'Erro interno ao buscar nota.'});
        }
        if(!row){
            return res.status(404).json({error: 'Nota não encontrada'}); // ✅ Status 404 é mais apropriado
        }

        res.status(200).json(row);
    });
});

// ROTA 3: BUSCAR TODAS: GET (Correta na sua versão, mantida)
app.get('/api/notes', (req, res) => {
    const sql = `SELECT id, title, createdAt, updatedAt, content FROM notes ORDER BY createdAt DESC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao listar notas:', err.message);
            return res.status(500).json({ error: 'Erro interno ao listar notas.' });
        }
        res.status(200).json(rows); 
    });
});


// ROTA 4: ATUALIZAR: PUT (Correta na sua versão, mantida)
app.put('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    
    // Incluímos o updatedAt aqui para rastrear a última edição
    const sql = `UPDATE notes SET title = ?, content = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`; 
    
    db.run(sql, [title, content, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
             return res.status(404).json({ message: `Nota com ID ${id} não encontrada para atualização.` });
        }
        
        res.status(200).json({ 
            message: 'Nota atualizada com sucesso', 
            id: id 
        });
    });
});


app.listen(PORT, () => {
    // A porta foi alterada para 3002, certifique-se de que seu frontend usa esta porta agora!
    console.log(`Servidor Express executando em http://localhost:${PORT}`);
}); 