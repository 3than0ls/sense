import React from 'react'
import { useTheme } from '~/context/ThemeContext'
import Edit from './Edit'
import ChevronDown from './ChevronDown'
import ChevronUp from './ChveronUp'
import ChevronLeft from './ChevronLeft'
import ChevronRight from './ChevronRight'

type IconProps = {
    color?: string
    type:
        | 'edit'
        | 'chevron-down'
        | 'chevron-up'
        | 'chevron-left'
        | 'chevron-right'
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
        case 'chevron-left':
            icon = <ChevronLeft className={className} />
            break
        case 'chevron-right':
            icon = <ChevronRight className={className} />
            break
    }

    return (
        <span className={interactive ? 'hover:cursor-pointer' : ''}>
            {icon}
        </span>
    )
}

export default Icon
