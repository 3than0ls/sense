import React, { useContext, createContext, useState, useEffect } from 'react'
import { useTheme, useThemeClass } from './ThemeContext'
import Icon from '~/components/icons/Icon'

type ModalContextType = {
    active: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
    modalChildren: React.ReactNode
    setModalChildren: React.Dispatch<React.SetStateAction<React.ReactNode>>
    setModalTitle: React.Dispatch<React.SetStateAction<string>>
}

const ModalContext = createContext<ModalContextType | null>(null)

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    // rather than using a state, the data provided by BudgetProvider should originate from a useLoaderData
    // it should only be set once, on load, from useLoaderData

    const [modalChildren, setModalChildren] = useState<React.ReactNode>()
    const [active, setActive] = useState(false)
    const [modalTitle, setModalTitle] = useState<string>('')

    // automatically clear modal children and title when modal is exited out of
    useEffect(() => {
        if (!active) {
            setModalChildren(null)
            setModalTitle('')
        }
    }, [active])

    const themeClass = useThemeClass()
    const themeStyle =
        useTheme().theme === 'DARK' ? 'stroke-white' : 'stroke-black'

    return (
        <ModalContext.Provider
            value={{
                setModalTitle,
                active,
                setActive,
                modalChildren,
                setModalChildren,
            }}
        >
            <div
                className={`bg-black bg-opacity-50 h-full w-full ${
                    active ? 'absolute z-50' : 'hidden'
                } flex flex-col justify-center items-center`}
            >
                <div className={`${themeClass} p-8 rounded-2xl relative`}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl">{modalTitle}</span>
                        <button
                            className="flex jutify-center items-center hover:opacity-85 transition"
                            onClick={() => setActive(false)}
                        >
                            <Icon
                                type="x-circle"
                                className={`${themeStyle} size-7`}
                            />
                        </button>
                    </div>
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
