import React, { useContext, createContext, useState } from 'react'
import { useTheme, useThemeClass } from './ThemeContext'
import Icon from '~/components/icons/Icon'

type ModalContextType = {
    active: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
    modalChildren: React.ReactNode
    setModalChildren: React.Dispatch<React.SetStateAction<React.ReactNode>>
}

const ModalContext = createContext<ModalContextType | null>(null)

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    // rather than using a state, the data provided by BudgetProvider should originate from a useLoaderData
    // it should only be set once, on load, from useLoaderData

    const [modalChildren, setModalChildren] = useState<React.ReactNode>()
    const [active, setActive] = useState(true)

    const themeClass = useThemeClass()
    const themeStyle =
        useTheme().theme === 'DARK' ? 'stroke-white' : 'stroke-black'

    return (
        <ModalContext.Provider
            value={{ active, setActive, modalChildren, setModalChildren }}
        >
            <div
                className={`bg-black bg-opacity-50 h-full w-full ${
                    active ? 'absolute z-50' : 'hidden'
                } flex justify-center items-center`}
            >
                <div className={`${themeClass} p-12 rounded-2xl relative`}>
                    <button
                        className="absolute top-4 right-4 flex jutify-center items-center hover:opacity-85 transition"
                        onClick={() => setActive(false)}
                    >
                        <Icon
                            type="x-circle"
                            className={`${themeStyle} size-7`}
                        />
                    </button>
                    {modalChildren}
                </div>
            </div>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = (): ModalContextType => {
    return useContext(ModalContext)!
}

export default ModalProvider
