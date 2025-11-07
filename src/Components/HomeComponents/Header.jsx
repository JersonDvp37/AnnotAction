import {useState} from 'react'
import Tstyles from './Header.module.css'
// ICONS
import annotAction from '/logo/AnnotAction2.png'

function Header() {
  const [openNav, setOpenNav] = useState(false);

  const openNavbar = () => {
     setOpenNav(!openNav);
  }

  return (
    <div className={Tstyles['topHeader']}>
 
      <div /* style={{height: openNav ? 'auto' : '35px', cursor: 'pointer'}}  */
          className={Tstyles['navBar-conteiner']}> 
          <ul className={Tstyles['ul_Header']}>
            <li><img className={Tstyles['AnnotAction_Logo']} src={annotAction} alt="" /></li>
            <li></li>
          </ul>
      </div>
      <div className={Tstyles['div-line']}></div>
      
    </div>  
  )
}

export default Header;