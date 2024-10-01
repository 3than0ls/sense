// import { Theme } from "@prisma/client"
// the above line breaks vite compiling, so export a custom type theme

export type Theme = 'LIGHT' | 'DARK'

export const theme: {
    LIGHT: Theme
    DARK: Theme
} = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
}
