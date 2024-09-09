import { useNavigation } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useTheme } from '~/context/ThemeContext'

const LoadingBar = () => {
    const navigation = useNavigation()

    const { theme } = useTheme()
    const themeClass =
        theme === 'DARK' ? 'brightness-[80%]' : 'brightness-[120%]'

    const [aniState, setAniState] = useState<
        'start' | 'stop' | 'end' | 'disappear'
    >('disappear')

    // console.log(navigation.state)
    useEffect(() => {
        // may want to refine navigation.state !== 'idle' to just navigation.state === 'loading'
        // this would eliminate the submitting state, thus preventing loading bar when form submitting
        if (navigation.state !== 'idle' && aniState !== 'start') {
            console.log('starting animation')
            setAniState('start')
        }
        if (navigation.state === 'idle' && aniState === 'start') {
            console.log('stopping animation')
            setAniState('stop')
        }
    }, [navigation.state, aniState])

    return (
        aniState !== 'disappear' && (
            <div className="fixed top-0 left-0 w-full h-1 z-50">
                <div
                    onTransitionEnd={() => {
                        if (aniState === 'stop') {
                            console.log('ending animation')
                            setAniState('end')
                        }
                        if (aniState === 'end') {
                            console.log('disappearing animation')
                            setAniState('disappear')
                        }
                    }}
                    className={`origin-left w-full h-full bg-primary
                    ${aniState === 'end' && 'opacity-0 duration-300'}
                    ${
                        aniState === 'start' &&
                        'opacity-100 scale-x-0 duration-300'
                    }
                    ${
                        aniState === 'stop' &&
                        'opacity-100 scale-x-100 duration-300'
                    }
                    transition-all ease-in-out
                    ${themeClass}
                    `}
                ></div>
            </div>
        )
    )
}

export default LoadingBar
