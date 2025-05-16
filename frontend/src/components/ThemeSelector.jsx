import React, { useContext } from 'react'
import {ThemeSelectorContext} from '../context/ThemeContext'
import { MoonIcon, SunIcon } from 'lucide-react'


function ThemeSelector() {
  const {theme, setTheme } = useContext(ThemeSelectorContext)
  return (
    <button className='btn btn-ghost text-base-content' onClick={()=>{
      setTheme(theme === 'light' ? 'dark' : 'light')
      localStorage.setItem('theme', theme==='light'? 'dark' : 'light'  )
    }}>
      {theme === 'light' ? (
        <>
        <SunIcon className='size-4' />
        Light Mode
        </>
      ) : (
        <>
        <MoonIcon className='size-4' />
        Dark Mode
        </>
      )  }
    </button>
  )
}

export default ThemeSelector
