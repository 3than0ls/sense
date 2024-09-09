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
            className={`${
                disabled
                    ? 'bg-opacity-50 hover:cursor-not-allowed'
                    : 'bg-opacity-100 hover:bg-opacity-[85%]'
            } bg-primary shadow-sm hover:shadow-md transition ease-in-out flex justify-center gap-4 ${style} ${className}`}
            type="submit"
        >
            {children}
        </button>
        // <button
        //     className={`relative group bg-black rounded-xl text-white py-3 px-10 overflow-hidden ${style}`}
        //     type="submit"
        // >
        //     <span className="absolute block top-0 left-0 w-full h-full rounded-xl bg-white bg-opacity-50 transform scale-0 group-hover:scale-100 transition-transform ease-out duration-150"></span>

        //     <span className="block">{text}</span>
        // </button>
    )
}

export default Submit
