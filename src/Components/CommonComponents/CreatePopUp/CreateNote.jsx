import React from 'react'
import {NotebookText} from "lucide-react"
import { Link } from 'react-router-dom';
import CreateCss from '../CreatePopUp/CreateNote.module.css'

function CreateNote({ isVisible, onClose, message }) {
  const noteId = 0;

  const openCreateNote = () => {
    console.log("Abrindo CreateNote");
    setCreateOpen(true);
  };

  const closeCreateNote = () => {
    console.log("Fechando CreateNote");
    setCreateOpen(false);
  };

  if (!isVisible) return null; // Não renderiza se isVisible for false

  return (
        <div className={CreateCss['popup-overlay']} onClick={onClose}>
            <div className={CreateCss['popup-container']} onClick={(e) => e.stopPropagation()}>
                <h3 className={CreateCss['popup-title']}>Criar Nova Nota</h3>
                
                {/* <form className={CreateCss['popup-form']}> */}
                <div className={CreateCss['popup-form']}>
                    <input 
                        type="text"   
                        placeholder="Título da nota" 
                        className={CreateCss['note-title-input']} 
                    />
                    
                    <div className={CreateCss['form-group']}>
                        <label htmlFor="note-category-select">Categoria:</label>
                        <select id="note-category-select" className={CreateCss['category-select']}>
                            <option value="Life">Life</option>
                            <option value="Works">Works</option>
                            <option value="Plan">Plan</option>
                            <option value="Ideas">Ideas</option>
                            <option value="Creativity">Creativity</option>
                            <option value="Purpose">Purpose</option>
                            <option value="Instructions">Instructions</option>
                            <option value="Bureaucracy">Bureaucracy</option>
                            <option value="Sketch">Sketch</option>
                        </select>
                    </div>

                    <div className={CreateCss['popup-actions']}>
                        <button type="button"
                                className={CreateCss['btn-cancel']}
                                onClick={() => {onClose()}}>Cancelar
                        </button>
                        <Link to={`/Editor/${noteId}`} style={{textDecoration: 'none'}}>
                            <button type="submit" className={CreateCss['btn-save']}>
                                <NotebookText size={16} className={CreateCss['btn-save-img']}/> Create
                            </button>
                        </Link>
                    </div>
                </div>
                {/* </form> */}
            </div>
        </div>

  )
}

export default CreateNote