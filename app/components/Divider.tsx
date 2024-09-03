import { useTheme } from '~/context/ThemeContext'

type DividerProps = { className?: string; themed?: boolean }

const Divider = ({ className, themed = false }: DividerProps) => {
    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'bg-light' : 'bg-dark'
    return (
        <hr
            className={`border border-black ${
                className || (themed && themeStyle) || 'bg-subtle'
            } `}
        />
    )
}

export default Divider
