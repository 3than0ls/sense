import { useState } from 'react'

export default function usePreventLinkSpan(pause = 1000) {
    const [disabled, setDisabled] = useState(false)

    const disableSpamClick = () => {
        if (!disabled) {
            setDisabled(true)
            setTimeout(() => {
                setDisabled(false)
            }, pause)
        }
    }

    return { disableSpamClick, disabled }
}
