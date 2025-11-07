"use client";

import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import TextEditor from "../TextEditor/TextEditor";
import RightSidebar from "../RightSidebar/RightSidebar";
import StatusBar from "../StatusBar/StatusBar";
import CreateNote from "../../CommonComponents/CreatePopUp/CreateNote";
import styles from "./NoteEditor.module.css";

export default function NoteEditor() {
  const { id } = useParams();
  const textEditorRef = useRef(null);

  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [title, setTitle] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [activeColor, setActiveColor] = useState(null); // 🔹 nova: controla a cor ativa globalmente

  const [createOpen, setCreateOpen] = useState(false);
  const openCreateNote = () => setCreateOpen(true);
  const closeCreateNote = () => setCreateOpen(false);

  // =========================================================
  // 🔹 Carregar nota
  // =========================================================
  useEffect(() => {
    if (id && id !== "0") {
      fetch(`http://localhost:3002/api/notes/${id}`)
        .then(res => res.json())
        .then(data => {
          setInitialContent(data.content || "");
          setTitle(data.title || "");
          setContent(data.content || "");
          if (textEditorRef.current) {
            textEditorRef.current.setContentExternally(data.content || "");
          }
        })
        .catch(err => console.error("Erro ao carregar nota:", err));
    } else {
      setInitialContent("");
      setTitle("");
      setContent("");
      if (textEditorRef.current) textEditorRef.current.clearContent();
    }
  }, [id]);

  // =========================================================
  // 🔹 Atualizar conteúdo ao digitar
  // =========================================================
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  // =========================================================
  // 🔹 Aplicar cor (corrigido: restaura antes de aplicar)
  // =========================================================
  const handleColorSelect = (color) => {
    if (!textEditorRef.current) return;
    textEditorRef.current.restoreSelection();  // 🔧 restaura cursor salvo
    textEditorRef.current.applyColor(color);   // 🔧 aplica cor corretamente
    setActiveColor(color);                     // 🔹 guarda cor ativa
  };

  // =========================================================
  // 🔹 Contagens
  // =========================================================
  const getWordCount = () => (content.trim() === "" ? 0 : content.trim().split(/\s+/).length);
  const getCharCount = () => content.length;
  const getLineCount = () => (content === "" ? 1 : content.split("\n").length);

  // =========================================================
  // 🔹 Salvar nota
  // =========================================================
  const handleSave = async () => {
    if (!textEditorRef.current) return;

    const noteTitle = title || "Sem título";
    const idSaved = await textEditorRef.current.saveNote(
      noteTitle,
      id !== "0" ? id : null
    );
    console.log("Nota salva:", idSaved);
  };

  const handleViewList = () => {
    console.log("Abrir lista de notas...");
  };

  // =========================================================
  // 🔹 Render
  // =========================================================
  return (
    <div className={styles.container}>
      <div className={styles.createNoteContainer}>
        <CreateNote isVisible={createOpen} onClose={closeCreateNote} />
      </div>

      <div className={styles.mainContent}>
        <LeftSidebar
          openCreateNote={openCreateNote}
          onSaveNote={handleSave}
          onViewList={handleViewList}
        />

        <div style={{ padding: "3px" }} />

        <TextEditor
          ref={textEditorRef}
          content={content}
          onChange={handleContentChange}
          fontSize={fontSize}
          fontFamily={fontFamily}
          isBold={isBold}
          isItalic={isItalic}
        />

        <div style={{ padding: "3px" }} />

        <RightSidebar
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          isBold={isBold}
          setIsBold={setIsBold}
          isItalic={isItalic}
          setIsItalic={setIsItalic}
          textEditorRef={textEditorRef}
          onColorSelect={handleColorSelect}   // 🔹 conecta escolha de cor
          activeColor={activeColor}           // 🔹 permite destacar cor ativa
        />
      </div>

      <StatusBar
        lineCount={getLineCount()}
        charCount={getCharCount()}
        wordCount={getWordCount()}
      />
    </div>
  );
}
