import { Fetcher } from '@remix-run/react'
import { useState, useEffect } from 'react'
import { useModal } from '~/context/ModalContext'

export default function useCloseModalWhenDone(
    fetcher: Fetcher,
    onSubmitLoad?: (d: unknown) => void
) {
    const [isFetchLoaded, setIsFetchLoaded] = useState(false)

    const { setActive } = useModal()

    useEffect(() => {
        if (fetcher.state === 'loading') {
            setIsFetchLoaded(true)
        }
        if (fetcher.state === 'idle' && isFetchLoaded) {
            if (onSubmitLoad) {
                onSubmitLoad(fetcher.data)
            }
            setActive(false)
        }
    }, [fetcher.state, fetcher.data, isFetchLoaded, onSubmitLoad, setActive])
}
