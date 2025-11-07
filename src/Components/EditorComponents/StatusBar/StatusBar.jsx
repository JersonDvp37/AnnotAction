"use client"

import styles from "./StatusBar.module.css"

export default function StatusBar({ lineCount, charCount, wordCount }) {
  return (
    <div className={styles.statusBar}>
      <div className={styles.info}>
        <span className={styles.item}>Linhas: {lineCount}</span>
        <span className={styles.separator}>|</span>
        <span className={styles.item}>Caracteres: {charCount}</span>
        <span className={styles.separator}>|</span>
        <span className={styles.item}>Palavras: {wordCount}</span>
      </div>

      <div className={styles.rightInfo}>
        <span className={styles.item}>UTF-8</span>
        <span className={styles.separator}>|</span>
        <span className={styles.item}>Português</span>
      </div>
    </div>
  )
}
