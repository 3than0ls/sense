import { useFetchers, useNavigation } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useTheme } from '~/context/ThemeContext'

const LoadingBar = () => {
    const { theme } = useTheme()
    const themeClass =
        theme === 'DARK' ? 'brightness-[80%]' : 'brightness-[120%]'

    const [aniState, setAniState] = useState<
        | 'start-to-mid'
        | 'mid-to-end'
        | 'end-to-disappear'
        | 'disappear-to-start'
    >('disappear-to-start')

    const [fromSrc, setFromSrc] = useState<'fetchers' | 'navigation' | null>(
        null
    )

    // for fetcher loading
    const fetchers = useFetchers()
    useEffect(() => {
        if (fromSrc === 'navigation') {
            // don't bother with any of the below, preventing interference between animations
            return
        }

        if (
            fetchers.some((f) => f.state === 'submitting') &&
            aniState !== 'start-to-mid'
        ) {
            setAniState('start-to-mid')
            setFromSrc('fetchers')
        }
        if (
            fetchers.some((f) => f.state === 'loading') &&
            aniState !== 'mid-to-end'
        ) {
            setAniState('mid-to-end')
        }
        if (
            fetchers.every((f) => f.state === 'idle') &&
            aniState === 'mid-to-end'
        ) {
            setAniState('end-to-disappear')
        }
    }, [aniState, fetchers, fromSrc])

    const navigation = useNavigation()
    useEffect(() => {
        if (fromSrc === 'fetchers') {
            // don't bother with any of the below, preventing interference between animations
            return
        }

        if (navigation.state !== 'idle') {
            setFromSrc('navigation')
            setAniState('start-to-mid')
        } else if (navigation.state === 'idle') {
            if (aniState === 'start-to-mid') {
                setAniState('mid-to-end')
            } else if (aniState === 'mid-to-end') {
                setAniState('end-to-disappear')
            }
        }
    }, [aniState, navigation.state, fromSrc])

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-50">
            <div
                onTransitionEnd={() => {
                    if (aniState === 'end-to-disappear') {
                        setAniState('disappear-to-start')
                        setFromSrc(null)
                    }
                }}
                className={`origin-left w-full h-full bg-primary
                    ${
                        aniState === 'start-to-mid' &&
                        'opacity-100 scale-x-75 transition-transform duration-1000'
                    }
                    ${
                        aniState === 'mid-to-end' &&
                        'opacity-100 scale-x-100 transition-transform duration-300'
                    }
                    ${
                        aniState === 'end-to-disappear' &&
                        'opacity-0 transition-opacity duration-700'
                    }
                    ${
                        aniState === 'disappear-to-start' &&
                        'scale-x-0 opacity-0 transition-transform duration-0'
                    }
                    transition-all ease-in-out
                    ${themeClass}
                    `}
            ></div>
        </div>
    )
}

export default LoadingBar
