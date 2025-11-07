"use client";

import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import styles from "./TextEditor.module.css";

const TextEditor = forwardRef(function TextEditor(
  { onChange, fontSize, fontFamily, isBold, isItalic },
  ref
) {
  const editorRef = useRef(null);
  const savedSelection = useRef(null);
  const activeColor = useRef(null); // Cor atual para digitar

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
    activeColor.current = color; // Salva a cor atual
    const selection = window.getSelection();
    if (!selection) return;

    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      // Texto selecionado → aplica cor
      document.execCommand("styleWithCSS", false, true);
      document.execCommand("foreColor", false, color);
    } else {
      // Cursor apenas → insere um span invisível para próxima digitação
      const editor = editorRef.current;
      if (editor) {
        editor.focus();
        const span = document.createElement("span");
        span.style.color = color;
        span.appendChild(document.createTextNode("\u200B")); // Espaço invisível
        const range = selection.getRangeAt(0);
        range.insertNode(span);

        // Move o cursor para dentro do span
        const newRange = document.createRange();
        newRange.setStart(span, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        saveSelection();
      }  
    }
  };

  // =========================================================
  // DIGITAÇÃO MANTENDO A COR ATIVA
  // =========================================================
  const handleInput = () => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const element =
        container.nodeType === Node.TEXT_NODE ? container.parentElement : container;

      // Detecta a cor do elemento atual ou usa a cor definida para digitar
      let color = activeColor.current;
      const computedColor = element && window.getComputedStyle(element).color;
      if (!color && computedColor) color = computedColor;

      if (color) {
        document.execCommand("styleWithCSS", false, true);
        document.execCommand("foreColor", false, color);
      }
    }

    if (onChange) onChange(editorRef.current.innerHTML || "");
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
