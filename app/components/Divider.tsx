import { useTheme } from '~/context/ThemeContext'

type DividerProps = { className?: string; themed?: boolean }

const Divider = ({ className, themed = false }: DividerProps) => {
    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'border-light' : 'border-dark'
    return (
        <hr
            className={`border ${
                className || (themed && themeStyle) || 'border-subtle'
            } `}
        />
    )
}

export default Divider
