import React from 'react'
import { useTheme } from '~/context/ThemeContext'
import Edit from './Edit'
import ChevronDown from './ChevronDown'
import ChevronUp from './ChveronUp'

type IconProps = {
    color?: string
    type: 'edit' | 'chevron-down' | 'chevron-up'
    className?: string
    interactive?: boolean
}

const Icon = ({ color, type, className, interactive = false }: IconProps) => {
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
        case 'chevron-down':
            icon = <ChevronDown className={className} />
            break
        case 'chevron-up':
            icon = <ChevronUp className={className} />
            break
        default:
            icon = <Edit className={className} />
    }

    return (
        <span className={interactive ? 'hover:cursor-pointer' : ''}>
            {icon}
        </span>
    )
}

export default Icon
