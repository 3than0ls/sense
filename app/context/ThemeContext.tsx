import { Theme } from '@prisma/client'
import React, { useContext, createContext, useState } from 'react'

type ThemeProviderProps = {
    initialTheme: Theme
    children: React.ReactNode
}

type ThemeContextType = {
    theme: Theme
    setTheme: React.Dispatch<React.SetStateAction<Theme>> | undefined
}

const ThemeContext = createContext<ThemeContextType>({
    theme: Theme.DARK,
    setTheme: undefined,
})

const ThemeProvider = ({ initialTheme, children }: ThemeProviderProps) => {
    // initial theme is from server
    const [theme, setTheme] = useState<Theme>(initialTheme)
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

/**
 * @returns {ThemeContextType} theme and setTheme
 */
export const useTheme = (): ThemeContextType => {
    return useContext(ThemeContext)
}

/**
 * @returns TailwindCSS class names for basic styles pertaining to the theme (based on light or dark)
 */
export const useThemeClass = () => {
    const { theme } = useTheme()
    if (theme === 'LIGHT') {
        return 'bg-light text-light'
    } else {
        return 'bg-dark text-dark'
    }
}

export default ThemeProvider
