import React from 'react'
import Icon from '../icons/Icon'

type SidebarCloseButtonProps = {
    closed: boolean
    setWidth: React.Dispatch<React.SetStateAction<number>>
}

const SidebarCloseButton = ({ closed, setWidth }: SidebarCloseButtonProps) => {
    return (
        <div className={`mt-auto ${closed ? 'mr-auto' : 'ml-auto'}`}>
            {closed ? (
                <button onClick={() => setWidth(400)}>
                    <Icon
                        type="chevron-right"
                        interactive
                        className="hover:stroke-white size-6 transition duration-200 ease-in-out"
                    />
                </button>
            ) : (
                <button
                    onClick={() => setWidth(0)}
                    className="hover:stroke-white"
                >
                    <Icon
                        type="chevron-left"
                        interactive
                        className="hover:stroke-white size-6 transition duration-200 ease-in-out"
                    />
                </button>
            )}
        </div>
    )
}

export default SidebarCloseButton
