"use client";

import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import styles from "./NoteViewer.module.css";

export default function NoteViewer({ noteId }) {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!noteId) return;

    const fetchNote = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:3002/api/notes/${noteId}`);
        if (!res.ok) throw new Error("Erro ao carregar a nota.");

        const data = await res.json();
        setNote(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  if (loading) return <div className={styles.status}>🕒 Carregando nota...</div>;
  if (error) return <div className={styles.error}>⚠️ {error}</div>;
  if (!note) return <div className={styles.status}>Nenhuma nota encontrada.</div>;

  return (
    <div className={styles.viewerContainer}>
      <h1 className={styles.title}>{note.title}</h1>
      <p className={styles.date}>
        Criada em: {new Date(note.createdAt).toLocaleString()}
      </p>
      <p className={styles.date}>
        Última atualização: {new Date(note.updatedAt).toLocaleString()}
      </p>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(note.content.replace(/\n/g, "<br/>")),
        }}
      />
    </div>
  );
}
