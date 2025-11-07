import React, { useState } from 'react'
import {NotebookText} from "lucide-react"
import { Link } from 'react-router-dom';
import Mynotes from './Mynotes';
import CreateNotePopUp from '../CommonComponents/CreatePopUp/CreateNote';
import Header from './Header';
// import RecentNotes from './RecentNotes';
import hm_css from './Home.module.css'; 

import Category from '/icons/icons8/file-Folder.png'
import iconWork from '/icons/icons8/work.png'
import iconGeneral from '/icons/icons8/general.png'
import iconPlan from '/icons/icons8/target.png'
import iconIdea from '/icons/icons8/brain.png'
import iconInstruction from '/icons/icons8/instructions.png'
import iconRules from '/icons/icons8/rules.png'
import iconCreativity from '/icons/icons8/lamp.png'
import iconPurpose from '/icons/icons8/purpose.png'
import iconSketch from '/icons/icons8/sketch.png'
import iconLife from '/icons/icons8/Life.png'
import garbageCount from '/icons/icons8/Garbage.png'
import notesCount from '/icons/icons8/notes.png'

import lupeTool from '/icons/icons8/Tools/lupa.png'
import filterTool from '/icons/icons8/Tools/filter.png'
import updateTool from '/icons/icons8/Tools/update.png'
import settigTool from '/icons/icons8/Tools/settings.png'
import opened from '/icons/icons8/Tools/opened.png'

function Home() {
  const [createNotes, setCreateNote] = useState(false);
  const [message, setMessage] = useState("");

    const CreateNote = (message = 'Crie sua nova nota aqui!') => {
      setCreateNote(true);
      setMessage(message);
    }
    const closeCreateNote = () => {
      setCreateNote(false);
      setMessage("");
    }

  return (
    <div className={hm_css['home-container']}>
      <div>
        <CreateNotePopUp 
            isVisible={createNotes} 
            onClose={closeCreateNote} message={message}/>
      </div>

      <div>
        <Header />
      </div>
  
      <div className={hm_css['main-layout-conteiner']}>
               
        <ul className={hm_css['home-layout-conteiner']}>
          <li className={hm_css['category_conteiner']}>

            <div className={hm_css['Criar-nota']} onClick={CreateNote}>
              <span className={hm_css['span-Criar-nota']}> 
                <NotebookText size={25} className={hm_css['img-Criar-nota']} /> 
                  Create Note
              </span>
            </div>

            <p className={hm_css['line']}></p>
              <div className={hm_css['category-title']}>  
                <img className={hm_css['imgCategory']} src={Category} alt="" />
                <span className={hm_css['spanCategory']}>Category section</span>
              </div>
            <p className={hm_css['line']}></p>
 
              <ul className={hm_css['ul_category_list']}>
        
                <li className={hm_css['li_category_list']}>
                  <ul className={hm_css['ul-category']}> 
                    <li><img style={{margin: 'auto 0'}} src={iconGeneral} alt="" /></li> 
                    <li><span>Generals</span></li>
                  </ul>
                      <span className={hm_css['category_details']}><img src={notesCount} alt="" /><p>Notes: 20</p></span>
                      <span className={hm_css['category_details']}><img src={garbageCount} alt=''/><p>Deleted: 5</p></span>
              
                </li>
                    <li className={hm_css['li_category_list']}>
                      <ul className={hm_css['ul-category']}> 
                        <li><img src={iconLife} alt="" /></li> 
                        <li><span>Life</span></li>
                      </ul>
                    </li>
                        <li className={hm_css['li_category_list']}>
                          <ul className={hm_css['ul-category']}> 
                            <li><img src={iconWork} alt="" /></li> 
                            <li><span>Works</span></li>
                          </ul>
                        </li>
                    
                              <li className={hm_css['li_category_list']}>
                                <ul className={hm_css['ul-category']}> 
                                  <li><img src={iconPlan} alt="" /></li> 
                                  <li><span>Plan</span></li>
                                </ul>
                              </li>

                      <li className={hm_css['li_category_list']}>
                        <ul className={hm_css['ul-category']}> 
                          <li><img src={iconIdea} alt="" /></li> 
                          <li><span>Ideas</span></li>
                        </ul>
                      </li>

                        <li className={hm_css['li_category_list']}>
                          <ul className={hm_css['ul-category']}> 
                            <li><img src={iconCreativity} alt="" /></li> 
                            <li><span>Creativity</span></li>
                          </ul>
                        </li>

                      <li className={hm_css['li_category_list']}>
                        <ul className={hm_css['ul-category']}> 
                          <li><img src={iconPurpose} alt="" /></li> 
                          <li><span>Purpose</span></li>
                        </ul>
                      </li>

                            <li className={hm_css['li_category_list']}>
                              <ul className={hm_css['ul-category']}> 
                                <li><img src={iconInstruction} alt="" /></li> 
                                <li><span>Instructions</span></li>
                              </ul>
                            </li>
                              <li className={hm_css['li_category_list']}>
                                <ul className={hm_css['ul-category']}> 
                                  <li><img src={iconRules} alt="" /></li> 
                                  <li><span>Bureaucracy</span></li>
                                </ul>
                              </li>
                            
                              <li className={hm_css['li_category_list']}>
                                <ul className={hm_css['ul-category']}> 
                                  <li><img src={iconSketch} alt="" /></li> 
                                  <li><span>Sketch</span></li>
                                </ul>
                              </li>
              </ul>
          </li>


          <li className={hm_css['savednotes_conteiner']}>
            <div className={hm_css['tool-conteiner']}>
              <form action="">
                <ul className={hm_css['ul-tool']}>
                  <li className={hm_css['searchTool']}>
                      <input type="text" placeholder='Procurar por notas' />
                      <img src={lupeTool} alt="" />
                  </li>
                  <li>
                    <span className={hm_css['span-Tool']}>
                      <img className={hm_css['img-Tool']} src={filterTool} alt="" />
                      <p>Filter </p>
                    </span>
                  </li>
                  <li>
                    <span className={hm_css['span-Tool']}>
                      <img className={hm_css['img-Tool']} src={updateTool} alt="" />
                      <p>Update</p>
                    </span>
                  </li>
                  <li>
                    <span className={hm_css['span-Tool']}>
                      <img className={hm_css['img-Tool']} src={opened} alt="" />
                      <p>Opened</p>
                    </span>
                  </li>
                  <li>
                    <span className={hm_css['span-Tool']}>
                      <img className={hm_css['img-Tool']} src={settigTool} alt="" />
                      <p>Settings</p>
                    </span>
                  </li>
                </ul>
              </form>

            </div>

             <div className={hm_css['myNotes-conteiner']}>
              <Mynotes />
            </div>

          </li>

        </ul>
      </div>

    </div>
  )  
}

export default Home