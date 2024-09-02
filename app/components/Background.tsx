import React from 'react'
import { useThemeClass } from '~/context/ThemeContext'

type BackgroundProps = {
    className?: string
    side?: 'left' | 'right'
    children?: React.ReactNode
}

const Background = ({
    className,
    side = 'left',
    children,
}: BackgroundProps) => {
    const leftSide = side === 'left'
    const themeStyle = useThemeClass()

    return (
        <div
            className={`${className} flex ${
                leftSide ? 'flex-row-reverse' : 'flex-row'
            } min-h-full h-fit overflow-y-auto ${themeStyle}`}
        >
            <div className="relative flex-grow">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/background.jpg')",
                        clipPath: !leftSide
                            ? 'polygon(0 0, 90% 0, 100% 100%, 0% 100%)'
                            : 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)',
                    }}
                ></div>
            </div>
            <div className="">{children}</div>
        </div>
    )
}

export default Background
