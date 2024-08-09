'use client'

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

export const useTheme = (): ThemeContextType => {
    return useContext(ThemeContext)
}

export default ThemeProvider
