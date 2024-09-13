import React from 'react'
import { useTheme } from '~/context/ThemeContext'
import Edit from './Edit'
import ChevronDown from './ChevronDown'
import ChevronUp from './ChveronUp'
import ChevronLeft from './ChevronLeft'
import ChevronRight from './ChevronRight'
import CurrencyDollar from './CurrencyDollar'
import PlusCircle from './PlusCircle'
import XCircle from './XCircle'
import Trash from './Trash'
import ExclamationCircle from './ExclamationCircle'
import Spinner from './Spinner'
import InformationCircle from './InformationCircle'
import MagnifyingGlassCircle from './MagnifyingGlassCircle'
import MagnifyingGlass from './MagnifyingGlass'
import Plus from './Plus'
import Minus from './Minus'

type IconProps = {
    color?: string
    type:
        | 'edit'
        | 'chevron-down'
        | 'chevron-up'
        | 'chevron-left'
        | 'chevron-right'
        | 'currency-dollar'
        | 'plus-circle'
        | 'x-circle'
        | 'trash'
        | 'exclamation-circle'
        | 'spinner'
        | 'information-circle'
        | 'magnifying-glass-circle'
        | 'magnifying-glass'
        | 'plus'
        | 'minus'
    className?: string
    interactive?: boolean
}

/**
 * All icons from https://heroicons.com/
 *
 * @returns Icon component
 */
const Icon = ({ color, type, className, interactive = false }: IconProps) => {
    const { theme } = useTheme()

    if (!color) {
        if (theme === 'DARK') {
            color === 'white'
        } else {
            color === 'black'
        }
    }

    // I'm starting to see how this has become un-ideal
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
        case 'currency-dollar':
            icon = <CurrencyDollar className={className} />
            break
        case 'plus-circle':
            icon = <PlusCircle className={className} />
            break
        case 'x-circle':
            icon = <XCircle className={className} />
            break
        case 'trash':
            icon = <Trash className={className} />
            break
        case 'exclamation-circle':
            icon = <ExclamationCircle className={className} />
            break
        case 'spinner':
            icon = <Spinner className={className} />
            break
        case 'information-circle':
            icon = <InformationCircle className={className} />
            break
        case 'magnifying-glass-circle':
            icon = <MagnifyingGlassCircle className={className} />
            break
        case 'magnifying-glass':
            icon = <MagnifyingGlass className={className} />
            break
        case 'plus':
            icon = <Plus className={className} />
            break
        case 'minus':
            icon = <Minus className={className} />
            break
    }

    return (
        <span className={interactive ? 'hover:cursor-pointer' : ''}>
            {icon}
        </span>
    )
}

export default Icon
