import React from 'react'
import Icon from '../icons/Icon'
import { useTheme } from '~/context/ThemeContext'

type SidebarCloseButtonProps = {
    closed: boolean
    setClosed: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarCloseButton = ({ closed, setClosed }: SidebarCloseButtonProps) => {
    const { theme } = useTheme()
    const themeStyle =
        theme === 'LIGHT' ? 'hover:stroke-light' : 'hover:stroke-dark'

    return (
        <button
            className={`mt-auto ml-auto mr-5 mb-4 z-20`}
            onClick={() => setClosed(!closed)}
        >
            <Icon
                type="chevron-left"
                interactive
                className={`${themeStyle} transform ${
                    closed && 'rotate-180'
                } size-6 transition duration-400`}
            />
        </button>
    )
}

export default SidebarCloseButton
