import React from 'react'
import Icon from '../icons/Icon'
import { useTheme } from '~/context/ThemeContext'

type SidebarCloseButtonProps = {
    closed: boolean
    width: number
    setWidth: React.Dispatch<React.SetStateAction<number>>
}

const SidebarCloseButton = ({
    closed,
    width,
    setWidth,
}: SidebarCloseButtonProps) => {
    const { theme } = useTheme()
    const themeStyle =
        theme === 'LIGHT' ? 'hover:stroke-light' : 'hover:stroke-dark'

    return (
        <div className={`mt-auto ml-auto mr-3`}>
            <button onClick={() => setWidth(closed ? 250 : 0)}>
                <Icon
                    type="chevron-left"
                    interactive
                    className={`${themeStyle} transform ${
                        width === 0 && 'rotate-180'
                    } size-6 transition duration-400`}
                />
            </button>
        </div>
    )
}

export default SidebarCloseButton
