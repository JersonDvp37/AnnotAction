"use client";

import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import styles from "./TextEditor.module.css";

const TextEditor = forwardRef(function TextEditor(
  { onChange, fontSize, fontFamily, isBold, isItalic },
  ref
) {
  const editorRef = useRef(null);
  const savedSelection = useRef(null);
  const activeColor = useRef(null);

  // =========================================================
  // ESTILOS DE TEXTO
  // =========================================================
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.fontSize = `${fontSize}px`;
      editorRef.current.style.fontFamily = fontFamily;
      editorRef.current.style.fontWeight = isBold ? "bold" : "normal";
      editorRef.current.style.fontStyle = isItalic ? "italic" : "normal";
    }
  }, [fontSize, fontFamily, isBold, isItalic]);

  // =========================================================
  // SALVAR / RESTAURAR CURSOR
  // =========================================================
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedSelection.current = sel.getRangeAt(0);
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (savedSelection.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelection.current);
    }
  };

  // =========================================================
  // APLICAR COR NO TEXTO
  // =========================================================
  const applyColor = (color) => {
    activeColor.current = color;
    const selection = window.getSelection();
    if (!selection) return;

    restoreSelection();

    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      // ✅ Cor em texto selecionado
      document.execCommand("styleWithCSS", false, true);
      document.execCommand("foreColor", false, color);
      saveSelection();
    } else {
      // ✅ Nenhuma seleção — aplica cor ativa para o texto seguinte
      const editor = editorRef.current;
      if (editor) {
        editor.focus();

        // Força o execCommand a definir a cor como padrão de digitação
        document.execCommand("styleWithCSS", false, true);
        document.execCommand("foreColor", false, color);

        // Salva a posição atual do cursor após aplicar cor
        saveSelection();
      }
    }
  };

  // =========================================================
  // DIGITAÇÃO MANTENDO A COR ATIVA
  // =========================================================
  const handleInput = () => {
    if (!editorRef.current) return;

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && activeColor.current) {
      document.execCommand("styleWithCSS", false, true);
      document.execCommand("foreColor", false, activeColor.current);
    }

    if (onChange) onChange(editorRef.current.innerHTML || "");
    saveSelection();
  };

  // =========================================================
  // IMPERATIVE HANDLE
  // =========================================================
  useImperativeHandle(ref, () => ({
    applyColor,
    saveSelection,
    restoreSelection,
    getContent: () => editorRef.current?.innerHTML || "",
    clearContent: () => {
      if (editorRef.current) editorRef.current.innerHTML = "";
    },
    setContentExternally: (newContent) => {
      if (editorRef.current) editorRef.current.innerHTML = newContent || "";
    },
  }));

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className={styles.editorContainer}>
      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        data-placeholder="Comece a escrever sua nota aqui..."
      />
    </div>
  );
});

export default TextEditor;
