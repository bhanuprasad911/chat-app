import { createContext, useState } from "react";


export const ThemeSelectorContext = createContext();
export const ThemeSelectorProvider=({ children }) =>{
const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  return (
    <ThemeSelectorContext.Provider value={{ theme, setTheme }}>
        {children}
    </ThemeSelectorContext.Provider>
  )
}
