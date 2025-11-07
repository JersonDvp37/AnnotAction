import React, { useState, useEffect } from 'react';
import notesCss from './Mynotes.module.css';
import iconMore from '/icons/icons8/Tools/3pontosV.png';

function Mynotes({onNoteSelect}) {
    // 1. ESTADO: Para armazenar a lista de notas
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. useEffect: Para buscar as notas quando o componente for montado
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                // A URL deve apontar para o seu backend Express
                const response = await fetch('http://localhost:3002/api/notes'); 
                
                if (!response.ok) {
                    throw new Error('Falha ao buscar as notas. Status: ' + response.status);
                }
                
                const data = await response.json();
                setNotes(data); // Atualiza o estado com a lista de notas
                setLoading(false);

            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error("Erro na busca:", err);
            }
        };

        fetchNotes();
    }, []); // O array vazio garante que a busca só ocorra uma vez na montagem

    // Condicionais de carregamento e erro
    if (loading) {
        return <div className={notesCss['mynotes-container']}>Carregando notas...</div>;
    }

    if (error) {
        return <div className={notesCss['mynotes-container']}>Erro ao carregar notas: {error}</div>;
    }


    return (
        <div className={notesCss['mynotes-container']}>
            <div className={notesCss['top-mynotes']}>
                <ul className={notesCss['ul-top-mynotes']}>
                    <li className={notesCss['column-header']}>Category</li>
                    <li className={notesCss['column-header']}>Notes</li>
                    <li className={notesCss['column-header']}>Date</li>
                    <li className={notesCss['column-header']}></li> {/* Coluna para o ícone */}
                </ul>
            </div>
            <div className={notesCss['list-mynotes']}>
                <ul className={notesCss['ul-mynotes-list']}>
                    
                    {/* 3. MAPEAMENTO: Itera sobre o estado 'notes' e cria um <li> para cada nota */}
                    {notes.map(note => (
                        <li key={note.id} onClick={() => onNoteSelect(note.id)} 
                            className={notesCss['li-mynotes-item']}>
                            {/* Ajuste conforme os dados que você realmente tem (ex: sua DB só tem title e content) */}
                            <div className={notesCss['note-category']}>
                                {/* Substitua por um campo real se tiver na DB */}
                                {note.category || 'Geral'} 
                            </div>
                            
                            <div className={notesCss['note-content']}>
                                <h4 className={notesCss['note-title']}>{note.title}</h4>
                                {/* Para a descrição na lista, você pode mostrar as primeiras palavras do HTML */}
                                <p className={notesCss['note-description']}>
                                    {note.content.substring(0, 100).replace(/<[^>]*>?/gm, '') + '...'} 
                                    {/* .replace remove tags HTML para exibir um texto limpo */}
                                </p>
                            </div>
                            
                            <div className={notesCss['note-date']}>
                                {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                            
                            <div className={notesCss['note-icon']}>
                                <img src={iconMore} alt="Mais opções" />
                            </div>
                        </li>
                    ))}
                    
                </ul>
                {notes.length === 0 && (
                     <div className={notesCss['no-notes']}>Nenhuma nota encontrada. Crie uma nova!</div>
                )}
            </div>
        </div>
    );
}

export default Mynotes;