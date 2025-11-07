"use client"

import React from "react"

import {
  Settings, Type, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  AlignJustify, Heading1, Heading2, Heading3, List, ListOrdered, Link, Quote, Code, Code2,
  Indent, Outdent, RotateCcw, Palette, Undo, Redo, ChevronDown, ChevronRight, X,
} from "lucide-react"
import { useState } from "react"
import styles from "./RightSidebar.module.css"

export default function RightSidebar({
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
  textEditorRef, // ✅ RECEBE O REF DO TEXTEDITOR
}) {
  const fontFamilies = ["Inter", "Arial", "Georgia", "Times New Roman", "Courier New", "Helvetica"]

  // Atualizar a paleta de cores com melhores contrastes e cores mais visíveis
  const colorPalette = {
    neutral: [
      { color: "#000000", name: "Preto" },
      { color: "#333333", name: "Cinza Escuro" },
      { color: "#6c757d", name: "Cinza Médio" },
      { color: "#ffffff", name: "Branco" },
    ],
    primary: [
      { color: "#007bff", name: "Azul" },
      { color: "#28a745", name: "Verde" },
      { color: "#fd7e14", name: "Laranja" },
      { color: "#0f766e", name: "Teal" },
    ],
    secondary: [
      { color: "#dc3545", name: "Vermelho" },
      { color: "#6f42c1", name: "Roxo" },
      { color: "#17a2b8", name: "Ciano" },
      { color: "#e83e8c", name: "Rosa" },
    ],
    highlight: [
      { color: "#fff3cd", name: "Amarelo Suave", textColor: "#856404" },
      { color: "#cce5ff", name: "Azul Suave", textColor: "#004085" },
      { color: "#d4edda", name: "Verde Suave", textColor: "#155724" },
      { color: "#f8d7da", name: "Rosa Suave", textColor: "#721c24" },
    ],
  }

  // Estados para controlar accordions
  const [openAccordions, setOpenAccordions] = useState({
    typography: true,
    textStyles: true,
    alignment: false,
    headings: false,
    lists: false,
    linksQuotes: false,
    code: false,
    indentHistory: false,
    colors: false,
  })

  // Estados para controlar blocos ativos
  const [activeBlocks, setActiveBlocks] = useState({
    blockquote: false,
    pre: false,
    ul: false,
    ol: false,
  })

  // Estado para modal de confirmação
  const [showClearModal, setShowClearModal] = useState(false)

  const toggleAccordion = (accordion) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [accordion]: !prev[accordion],
    }))
  }

  const execCommand = (command, value) => {
    document.execCommand(command, false, value)
  }
  
const [activeColor, setActiveColor] = useState(null);

const applyTextColor = (color) => {
  if (textEditorRef?.current?.applyColor) {
    textEditorRef.current.applyColor(color);
    setActiveColor(color);
  }
};

  const applyHighlight = (backgroundColor, textColor) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)

    if (selection.isCollapsed) {
      // Sem seleção: aplica destaque no texto a ser digitado
      const span = document.createElement("span")
      span.style.backgroundColor = backgroundColor
      span.style.color = textColor || "#000000"
      span.appendChild(document.createTextNode("\u200B"))
      range.insertNode(span)
      range.setStart(span, 1)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      // Com seleção: aplica destaque no texto selecionado
      const span = document.createElement("span")
      span.style.backgroundColor = backgroundColor
      span.style.color = textColor || "#000000"
      span.className = "highlight-text"

      const contents = range.extractContents()
      span.appendChild(contents)
      range.insertNode(span)

      selection.removeAllRanges()
    }
    setActiveColor(backgroundColor);
  }


  const insertLink = () => {
    const url = prompt("Digite a URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  // Melhorar a função clearFormatting para remover highlights também
  const clearFormatting = () => {
    const selection = window.getSelection()
    if (selection && selection.toString()) {
      // Remover formatação do texto selecionado
      execCommand("removeFormat")
      execCommand("unlink")

      // Remover highlights personalizados
      const range = selection.getRangeAt(0)
      const container = range.commonAncestorContainer
      const parent = container.nodeType === Node.TEXT_NODE ? container.parentElement : container

      // Encontrar e remover spans de highlight
      const highlights = parent.querySelectorAll(".highlight-text")
      highlights.forEach((highlight) => {
        const textNode = document.createTextNode(highlight.textContent)
        highlight.parentNode.replaceChild(textNode, highlight)
      })
    } else {
      // Limpar toda a formatação se nada estiver selecionado
      execCommand("selectAll")
      execCommand("removeFormat")
      execCommand("unlink")

      // Remover todos os highlights
      const editor = document.querySelector('[contenteditable="true"]')
      if (editor) {
        const highlights = editor.querySelectorAll(".highlight-text")
        highlights.forEach((highlight) => {
          const textNode = document.createTextNode(highlight.textContent)
          highlight.parentNode.replaceChild(textNode, highlight)
        })
      }

      // Limpar seleção
      selection.removeAllRanges()
    }

    setActiveBlocks({
      blockquote: false,
      pre: false,
      ul: false,
      ol: false,
    })
    setShowClearModal(false)
  }

  const toggleBlockquote = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer
    const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container
    const existingBlockquote = element?.closest("blockquote")

    if (existingBlockquote) {
      const content = existingBlockquote.innerHTML
      const p = document.createElement("p")
      p.innerHTML = content

      existingBlockquote.parentNode?.insertBefore(p, existingBlockquote.nextSibling)
      existingBlockquote.remove()

      const newRange = document.createRange()
      newRange.setStart(p, 0)
      newRange.setEnd(p, 0)
      selection.removeAllRanges()
      selection.addRange(newRange)

      setActiveBlocks((prev) => ({ ...prev, blockquote: false }))
    } else {
      const blockquote = document.createElement("blockquote")
      blockquote.innerHTML = "Digite sua citação aqui..."

      if (range.collapsed) {
        range.insertNode(blockquote)
      } else {
        const contents = range.extractContents()
        blockquote.appendChild(contents)
        range.insertNode(blockquote)
      }

      const newRange = document.createRange()
      newRange.selectNodeContents(blockquote)
      newRange.collapse(false)
      selection.removeAllRanges()
      selection.addRange(newRange)

      setActiveBlocks((prev) => ({ ...prev, blockquote: true }))
    }
  }

  const toggleCodeBlock = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer
    const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container
    const existingPre = element?.closest("pre")

    if (existingPre) {
      const content = existingPre.textContent || ""
      const p = document.createElement("p")
      p.textContent = content

      existingPre.parentNode?.insertBefore(p, existingPre.nextSibling)
      existingPre.remove()

      const newRange = document.createRange()
      newRange.setStart(p, 0)
      newRange.setEnd(p, 0)
      selection.removeAllRanges()
      selection.addRange(newRange)

      setActiveBlocks((prev) => ({ ...prev, pre: false }))
    } else {
      const pre = document.createElement("pre")
      const code = document.createElement("code")
      code.textContent = "// Digite seu código aqui..."
      pre.appendChild(code)

      if (range.collapsed) {
        range.insertNode(pre)
      } else {
        const contents = range.extractContents()
        code.textContent = contents.textContent || "// Digite seu código aqui..."
        range.insertNode(pre)
      }

      const newRange = document.createRange()
      newRange.selectNodeContents(code)
      newRange.collapse(false)
      selection.removeAllRanges()
      selection.addRange(newRange)

      setActiveBlocks((prev) => ({ ...prev, pre: true }))
    }
  }

  const toggleList = (listType, command) => {
    const isActive = activeBlocks[listType]

    if (isActive) {
      execCommand("insertHTML", "<br><p><br></p>")
      setActiveBlocks((prev) => ({ ...prev, [listType]: false }))
    } else {
      execCommand(command)
      setActiveBlocks((prev) => ({ ...prev, [listType]: true }))
    }
  }

  // Detectar mudanças no cursor para atualizar estados dos blocos
  const handleSelectionChange = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const container = range.commonAncestorContainer
      const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container

      if (element) {
        const blockquote = element.closest("blockquote")
        const pre = element.closest("pre")
        const ul = element.closest("ul")
        const ol = element.closest("ol")

        setActiveBlocks({
          blockquote: !!blockquote,
          pre: !!pre,
          ul: !!ul,
          ol: !!ol,
        })
      }
    }
  }

  React.useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange)
    return () => document.removeEventListener("selectionchange", handleSelectionChange)
  }, [])

  const AccordionItem = ({ title, icon: Icon, isOpen, onToggle, children }) => (
    <div className={styles.accordionItem}>
      <button className={styles.accordionHeader} onClick={onToggle}>
        <div className={styles.accordionTitle}>
          <Icon size={14} />
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div className={styles.accordionContent}>{children}</div>}
    </div>
  )

  const ColorSection = ({ title, colors, isHighlight = false }) => (
  <div className={styles.colorSection}>
    <h4 className={styles.colorSectionTitle}>{title}</h4>
    <div className={styles.colorGrid}>
      {colors.map((colorItem, index) => (
        <button
          key={index}
          className={styles.colorSwatch}
          style={{
            backgroundColor: colorItem.color,
            border: activeColor === colorItem.color ? "2px solid #000" : "1px solid #ccc",
          }}

          onClick={() =>
            isHighlight
              ? applyHighlight(colorItem.color, colorItem.textColor)
              : applyTextColor(colorItem.color) // ✅ Agora usa a função corrigida
          }
          title={`${colorItem.name} - ${colorItem.color}`}
        />
      ))}
    </div>
  </div>
);


  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <Settings size={16} />
        <span>Ferramentas de Edição</span>
      </div>

      <div className={styles.accordionContainer}>
        {/* Tipografia */}
        <AccordionItem
          title="Tipografia"
          icon={Type}
          isOpen={openAccordions.typography}
          onToggle={() => toggleAccordion("typography")}
        >
          <div className={styles.control}>
            <label className={styles.label}>Fonte</label>
            <select className={styles.select} value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
              {fontFamilies.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.control}>
            <label className={styles.label}>Tamanho</label>
            <input
              type="range"
              min="10"
              max="32"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.value}>{fontSize}px</span>
          </div>
        </AccordionItem>

        {/* Estilos de Texto */}
        <AccordionItem
          title="Estilos de Texto"
          icon={Bold}
          isOpen={openAccordions.textStyles}
          onToggle={() => toggleAccordion("textStyles")}
        >
          <div className={styles.buttonGrid}>
            <button className={styles.toolButton} onClick={() => execCommand("bold")} title="Negrito (Ctrl+B)">
              <Bold size={16} />
            </button>
            <button className={styles.toolButton} onClick={() => execCommand("italic")} title="Itálico (Ctrl+I)">
              <Italic size={16} />
            </button>
            <button className={styles.toolButton} onClick={() => execCommand("underline")} title="Sublinhado (Ctrl+U)">
              <Underline size={16} />
            </button>
            <button className={styles.toolButton} onClick={() => execCommand("strikeThrough")} title="Tachado">
              <Strikethrough size={16} />
            </button>
          </div>
        </AccordionItem>

        {/* Cores Expandidas */}
        <AccordionItem
          title="Cores e Destaques"
          icon={Palette}
          isOpen={openAccordions.colors}
          onToggle={() => toggleAccordion("colors")}
        >
          <ColorSection title="Cores Neutras" colors={colorPalette.neutral} />
          <ColorSection title="Cores Primárias" colors={colorPalette.primary} />
          <ColorSection title="Cores Secundárias" colors={colorPalette.secondary} />
          <ColorSection title="Marcadores (Highlight)" colors={colorPalette.highlight} isHighlight={true} />
        </AccordionItem>

        {/* Alinhamento */}
        <AccordionItem
          title="Alinhamento"
          icon={AlignLeft}
          isOpen={openAccordions.alignment}
          onToggle={() => toggleAccordion("alignment")}
        >
          <div className={styles.buttonGrid}>
            <button className={styles.toolButton} onClick={() => execCommand("justifyLeft")} title="Alinhar à Esquerda">
              <AlignLeft size={16} />
            </button>
            <button className={styles.toolButton} onClick={() => execCommand("justifyCenter")} title="Centralizar">
              <AlignCenter size={16} />
            </button>
            <button className={styles.toolButton} onClick={() => execCommand("justifyRight")} title="Alinhar à Direita">
              <AlignRight size={16} />
            </button>
            <button className={styles.toolButton} onClick={() => execCommand("justifyFull")} title="Justificar">
              <AlignJustify size={16} />
            </button>
          </div>
        </AccordionItem>

        {/* Cabeçalhos */}
        <AccordionItem
          title="Cabeçalhos"
          icon={Heading1}
          isOpen={openAccordions.headings}
          onToggle={() => toggleAccordion("headings")}
        >
          <div className={styles.buttonGrid}>
            <button className={styles.toolButton} onClick={() => execCommand("formatBlock", "h1")} title="Cabeçalho 1">
              <Heading1 size={16} />
            </button>
            <button className={styles.toolButton} onClick={() => execCommand("formatBlock", "h2")} title="Cabeçalho 2">
              <Heading2 size={16} />
            </button>
            <button className={styles.toolButton} onClick={() => execCommand("formatBlock", "h3")} title="Cabeçalho 3">
              <Heading3 size={16} />
            </button>
            <button
              className={styles.toolButton}
              onClick={() => execCommand("formatBlock", "p")}
              title="Parágrafo Normal"
            >
              P
            </button>
          </div>
        </AccordionItem>

        {/* Listas */}
        <AccordionItem
          title="Listas"
          icon={List}
          isOpen={openAccordions.lists}
          onToggle={() => toggleAccordion("lists")}
        >
          <div className={styles.buttonGrid}>
            <button
              className={`${styles.toolButton} ${activeBlocks.ul ? styles.active : ""}`}
              onClick={() => toggleList("ul", "insertUnorderedList")}
              title="Lista com Marcadores"
            >
              <List size={16} />
            </button>
            <button
              className={`${styles.toolButton} ${activeBlocks.ol ? styles.active : ""}`}
              onClick={() => toggleList("ol", "insertOrderedList")}
              title="Lista Numerada"
            >
              <ListOrdered size={16} />
            </button>
          </div>
        </AccordionItem>

        {/* Links e Citações */}
        <AccordionItem
          title="Links e Citações"
          icon={Link}
          isOpen={openAccordions.linksQuotes}
          onToggle={() => toggleAccordion("linksQuotes")}
        >
          <div className={styles.buttonGrid}>
            <button className={styles.toolButton} onClick={insertLink} title="Inserir Link">
              <Link size={16} />
            </button>
            <button
              className={`${styles.toolButton} ${activeBlocks.blockquote ? styles.active : ""}`}
              onClick={toggleBlockquote}
              title="Citação em Bloco"
            >
              <Quote size={16} />
            </button>
          </div>
        </AccordionItem>

        {/* Código */}
        <AccordionItem title="Código" icon={Code} isOpen={openAccordions.code} onToggle={() => toggleAccordion("code")}>
          <div className={styles.buttonGrid}>
            <button
              className={`${styles.toolButton} ${activeBlocks.pre ? styles.active : ""}`}
              onClick={toggleCodeBlock}
              title="Bloco de Código"
            >
              <Code2 size={16} />
            </button>
            <button
              className={styles.toolButton}
              onClick={() => {
                const selection = window.getSelection()
                if (selection && selection.toString()) {
                  execCommand("insertHTML", `<code>${selection.toString()}</code>`)
                }
              }}
              title="Código Inline"
            >
              <Code size={16} />
            </button>
          </div>
        </AccordionItem>

        {/* Recuo e Histórico */}
        <AccordionItem
          title="Recuo e Histórico"
          icon={Indent}
          isOpen={openAccordions.indentHistory}
          onToggle={() => toggleAccordion("indentHistory")}
        >
          <div className={styles.buttonGrid}>
            <button className={styles.toolButton} onClick={() => execCommand("indent")} title="Aumentar Recuo">
              <Indent size={16} />
            </button>
            <button className={styles.toolButton} onClick={() => execCommand("outdent")} title="Diminuir Recuo">
              <Outdent size={16} />
            </button>
            <button className={styles.toolButton} onClick={() => execCommand("undo")} title="Desfazer (Ctrl+Z)">
              <Undo size={16} />
            </button>
            <button className={styles.toolButton} onClick={() => execCommand("redo")} title="Refazer (Ctrl+Shift+Z)">
              <Redo size={16} />
            </button>
          </div>
        </AccordionItem>
      </div>

      {/* Botão Limpar Formatação */}
      <div className={styles.clearSection}>
        <button className={styles.clearButton} onClick={() => setShowClearModal(true)} title="Limpar Formatação">
          <RotateCcw size={16} />
          Limpar Formatação
        </button>
      </div>

      {/* Modal de Confirmação Customizado */}
      {showClearModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Confirmar Limpeza</h3>
              <button className={styles.modalClose} onClick={() => setShowClearModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Tem certeza que deseja limpar toda a formatação do texto selecionado?</p>
              <p className={styles.modalWarning}>Esta ação não pode ser desfeita.</p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancel} onClick={() => setShowClearModal(false)}>
                Cancelar
              </button>
              <button className={styles.modalConfirm} onClick={clearFormatting}>
                Limpar Formatação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
