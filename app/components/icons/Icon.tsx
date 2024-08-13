import React from 'react'
import { useTheme } from '~/context/ThemeContext'
import Edit from './Edit'

type IconProps = {
    color?: string
    type: 'edit'
    className?: string
}

const Icon = ({ color, type, className }: IconProps) => {
    const { theme } = useTheme()

    if (!color) {
        if (theme === 'DARK') {
            color === 'white'
        } else {
            color === 'black'
        }
    }

    let icon: React.ReactNode
    switch (type) {
        case 'edit':
            icon = <Edit className={className} />
            break
        default:
            icon = <Edit className={className} />
    }

    return <span className="hover:cursor-pointer">{icon}</span>
}

export default Icon
