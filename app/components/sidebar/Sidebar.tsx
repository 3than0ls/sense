import { useRef, useState } from 'react'
import SidebarCloseButton from './SidebarCloseButton'
import SidebarLink from './SidebarLink'
import { useThemeClass } from '~/context/ThemeContext'
import { useFetcher } from '@remix-run/react'
import { useModal } from '~/context/ModalContext'
import AccountForm from '../account/AccountForm'
import { Account, Budget } from '@prisma/client'

type SidebarProps = {
    budgets: Budget[]
    accounts: Account[]
}

const Sidebar = ({ budgets, accounts }: SidebarProps) => {
    // make length adjustable, make it able to close

    const [width, setWidth] = useState(600)
    const sidebarRef = useRef<HTMLDivElement | null>(null)
    const [closed, setClosed] = useState(false)
    const themeStyle = useThemeClass()

    const TEMPFETCHER = useFetcher()

    const { setActive, setModalChildren } = useModal()

    return (
        <div
            onTransitionEnd={(e) => {
                if (e.target === sidebarRef.current) {
                    setClosed(!closed)
                }
            }}
            className={`bg-primary h-full flex flex-col max-w-64 min-w-16 py-4 px-2 transition-all duration-500 ease-in-out ${themeStyle} `}
            style={{ width }}
            ref={sidebarRef}
        >
            <SidebarLink
                href="/"
                closed={width === 0 && closed}
                openChildren={() => 'Home'}
                closedChildren={() => 'H'}
            />
            <SidebarLink
                href="/budget/c1f1b492-7b06-4742-b493-1c7bc3dece57"
                closed={width === 0 && closed}
                openChildren={() => 'Budget 1'}
                closedChildren={() => 'B'}
            />
            <SidebarLink
                href="idkwhatthiswilldo"
                closed={width === 0 && closed}
                openChildren={() => 'ignore the bad color :('}
                closedChildren={() => 'N'}
            />
            <TEMPFETCHER.Form action="/api/bud/create" method="POST">
                <button
                    type="submit"
                    className="bg-primary text-white border-2 border-black rounded-2xl"
                >
                    create a budget!
                </button>
            </TEMPFETCHER.Form>

            <button
                onClick={() => {
                    setModalChildren(<AccountForm budgets={budgets} />)
                    setActive(true)
                }}
                className="bg-primary text-white border-2 border-black rounded-2xl"
            >
                create a account!
            </button>

            <SidebarCloseButton
                width={width}
                closed={closed}
                setWidth={setWidth}
            />
        </div>
    )
}

export default Sidebar
