import { useEffect, useState } from 'react'
import { useTheme, useThemeClass } from '~/context/ThemeContext'
import Icon from '../icons/Icon'

type TransactionFormFlowButtonProps = {
    onSwitch: (side: 'outflow' | 'inflow') => void
    className?: string
    defaultSide?: 'outflow' | 'inflow'
}

const TransactionFormFlowButton = ({
    onSwitch,
    className,
    defaultSide = 'outflow',
}: TransactionFormFlowButtonProps) => {
    const [side, setSide] = useState<'outflow' | 'inflow'>(defaultSide)

    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'border-light' : 'border-dark'
    const themeClass = useThemeClass()

    useEffect(() => {
        if (onSwitch) {
            onSwitch(side)
        }
    }, [side, onSwitch])

    return (
        <div
            className={`${themeClass} h-8 border ${themeStyle} ${className} m-1 w-fit rounded-lg flex relative text-xs`}
        >
            <div
                className={`absolute top-0 transform -translate-y-7 text-base text-center w-full ${
                    side === 'outflow' ? 'text-bad' : 'text-good'
                }`}
            >
                {side[0].toUpperCase() + side.slice(1)}
            </div>
            <div
                className={`absolute w-8 bg-primary flex overflow-hidden ${
                    side === 'outflow' ? 'translate-x-0' : 'translate-x-full'
                } transition-all h-full duration-500 ease-in-out transform scale-125 origin-center rounded-lg`}
            >
                <div
                    className={`${
                        side === 'outflow'
                            ? 'translate-x-0'
                            : '-translate-x-full'
                    } p-1 min-w-full transition-all duration-500 ease-in-out flex items-center justify-center gap-1`}
                >
                    <Icon type="minus" className="size-4" />
                </div>
                <div
                    className={`${
                        side === 'outflow'
                            ? 'translate-x-0'
                            : '-translate-x-full'
                    } p-1 min-w-full transition-all duration-500 ease-in-out flex items-center justify-center gap-1`}
                >
                    <Icon type="plus" className="size-4" />
                </div>
            </div>
            <button
                type="button"
                className="p-1 w-8 flex items-center justify-center gap-1"
                onClick={() => setSide('outflow')}
            >
                <Icon type="minus" className="size-4" />
            </button>
            <button
                type="button"
                className="p-1 w-8 flex items-center justify-center gap-1"
                onClick={() => setSide('inflow')}
            >
                <Icon type="plus" className="size-4" />
            </button>
        </div>
    )
}

export default TransactionFormFlowButton
