import React from 'react'
import { useTheme } from '~/context/ThemeContext'

type SubmitProps = {
    text?: string
    className?: string
}

const Submit = ({ text, className }: SubmitProps) => {
    const { theme } = useTheme()

    const style =
        theme === 'LIGHT' ? 'bg-black text-white' : 'bg-white text-black'

    return (
        <button
            className={`py-3 px-12 rounded-2xl bg-opacity-100 hover:bg-opacity-[85%] shadow-sm hover:shadow-md transition-all duration-300 ease-in-out ${style} ${className}`}
            type="submit"
        >
            <span className="">{text}</span>
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
