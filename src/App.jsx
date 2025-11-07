import { useState } from 'react'
import {Routes, Route} from 'react-router-dom'

import Home from './Components/HomeComponents/Home'
import NotFound_404 from './Components/CommonComponents/NotFound_404'
import Header from './Components/HomeComponents/Header'
import NoteEditor from './Components/EditorComponents/NoteEditor/NoteEditor';
import CreateNote from './Components/CommonComponents/CreatePopUp/CreateNote' 
import './App.css'

//assets
import backgroundImage from '/image/abstract_background.png'

function App() {

  return (
    <div>
      <div>
        <Routes>
          <Route exact path='/' element={ <Home />} />
          <Route path='/Editor/:noteId' element={ <NoteEditor /> } />
          <Route path='/CreateNote' element={ <CreateNote />} />
          <Route path='*' element={ <NotFound_404 /> } />
        </Routes>
      </div>
    </div>
  )
}

export default App
