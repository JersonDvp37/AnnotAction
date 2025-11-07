"use client"

import { useState } from "react"
import {Link} from 'react-router-dom'
import { FolderOpen, NotebookText } from "lucide-react"
import styles from "./LeftSidebar.module.css"

import iconInstruction from '/icons/icons8/instructions.png'
import iconRules from '/icons/icons8/rules.png'
import iconPurpose from '/icons/icons8/purpose.png'
import iconSketch from '/icons/icons8/sketch.png'

import iconBack from '/icons/icons8/iconsEditor/back.png'
import iconTools from '/icons/icons8/iconsEditor/tools.png'
import iconSave from '/icons/icons8/iconsEditor/Salvar.png'
import iconList from '/icons/icons8/iconsEditor/listaNotas.png'
import iconDraft from '/icons/icons8/iconsEditor/Rascunho.png'
import iconShare from '/icons/icons8/iconsEditor/share.png'
import iconAI from '/icons/icons8/iconsEditor/AI.png'
import iconPrint from '/icons/icons8/iconsEditor/print.png'
import iconExport from '/icons/icons8/iconsEditor/export.png'
import iconSettings from '/icons/icons8/iconsEditor/settings.png'

// 1. O componente agora recebe 'onSaveNote' como uma propriedade
export default function LeftSidebar({openCreateNote, onSaveNote}) {

  return (
    <div className={styles.sidebar}>
      <Link to={"/"} style={{listStyle: 'none', textDecoration: 'none'}}>
        <div className={styles.backButtonContainer}>
          <button className={styles.backButton}>
            <img src={iconBack} alt="" /> <p>back</p>
          </button>
        </div>
      </Link>

        <div className={styles.header} onClick={openCreateNote}>
          <button className={styles.createButton}>  
            <NotebookText size={25} margin="0" padding="0" />
            Create Note
          </button>
        </div>

      <div className={styles.section}>
        <p className={styles['line2']}></p>
        <div className={styles.sectionHeader}>
          <img src={iconTools} alt="" />
          <span>Actions</span>
        </div>
        <p className={styles['line']}></p>
          
          <ul className={styles['ul_category_list']}>
    
            {/* 2. ADICIONADO onClick={onSaveNote} ao <li> de salvar */}
            <li 
              className={styles['li_category_list']} 
              title="Save note"
              onClick={onSaveNote} 
            >
              <ul className={styles['ul-category']}> 
                <li><img style={{margin: 'auto 0'}} src={iconSave} alt="" /></li> 
                <li><span>Save</span></li>
              </ul>
          
            </li>
                <li className={styles['li_category_list']} 
                    title="Saved notes"
                    // onClick={onViewList}
                    onClick={() => alert("Função de ver notas ainda não implementada!")}
                >

                  <ul className={styles['ul-category']}> 
                    <li><img src={iconList} alt="" /></li> 
                    <li><span>Notes list</span></li>
                  </ul>
                </li>
                    <li className={styles['li_category_list']} title="Draft note">
                      <ul className={styles['ul-category']}> 
                        <li><img src={iconDraft} alt="" /></li> 
                        <li><span>Draft</span></li>
                      </ul>
                    </li>
                    <p className={styles['line']}></p>

                        <li className={styles['li_category_list']} title="Share note/Environment">
                          <ul className={styles['ul-category']}> 
                            <li><img src={iconShare} alt="" /></li> 
                            <li><span>Share</span></li>
                          </ul>
                        </li>

                  <li className={styles['li_category_list']} title="Artificial Intelligence">
                    <ul className={styles['ul-category']}> 
                      <li><img src={iconAI} alt="" /></li> 
                      <li><span>AI</span></li>
                    </ul>
                  </li>

                    <li className={styles['li_category_list']} title="Print note">
                      <ul className={styles['ul-category']}> 
                        <li><img src={iconPrint} alt="" /></li> 
                        <li><span>Print</span></li>
                      </ul>
                    </li>
                <li className={styles['li_category_list']} title="Export note as file">
                  <ul className={styles['ul-category']}> 
                    <li><img src={iconExport} alt="" /></li> 
                    <li><span>Export</span></li>
                  </ul>
                </li>
                    <p className={styles['line']}></p>

                <li className={styles['li_category_list']} title="Settings">
                  <ul className={styles['ul-category']}> 
                    <li><img src={iconSettings} alt="" /></li> 
                    <li><span>Settings</span></li>
                  </ul>
                </li>
          </ul>
      </div>
    </div>
  )
}