import { useTheme } from '~/context/ThemeContext'

type SubmitProps = {
    children?: React.ReactNode
    className?: string
    disabled?: boolean
}

const Submit = ({ className, disabled, children }: SubmitProps) => {
    const { theme } = useTheme()

    const style = theme === 'DARK' ? 'text-white' : 'text-black'

    return (
        <button
            disabled={disabled}
            className={`${
                disabled
                    ? 'bg-opacity-50 hover:cursor-not-allowed'
                    : 'bg-opacity-100 hover:bg-opacity-[85%]'
            } bg-primary shadow-sm hover:shadow-md transition ease-in-out flex justify-center gap-4 ${style} ${className}`}
            type="submit"
        >
            {children}
        </button>
    )
}

export default Submit
