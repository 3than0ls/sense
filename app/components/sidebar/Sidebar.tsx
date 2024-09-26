import { useRef, useState } from 'react'
import SidebarCloseButton from './SidebarCloseButton'
import SidebarLink from './SidebarLink'
import { useThemeClass } from '~/context/ThemeContext'
import Divider from '../Divider'
import { SidebarDataType } from '~/prisma/sidebarData'
import SidebarDropdown from './SidebarDropdown'
import AddBudgetButton from './AddBudgetButton'

type SidebarProps = {
    sidebarData: SidebarDataType
}

const Sidebar = ({ sidebarData }: SidebarProps) => {
    const [closed, setClosed] = useState(false)
    const sidebarRef = useRef<HTMLDivElement | null>(null)
    const themeStyle = useThemeClass()

    const budgetLinks = Array.from(sidebarData, (b) => (
        <SidebarDropdown budget={b} key={b.id}>
            {b.accounts.map((a) => (
                <SidebarLink
                    key={a.id}
                    href={`/account/${a.id}`}
                    text={a.name}
                />
            ))}
        </SidebarDropdown>
    ))

    return (
        <div
            className={`relative bg-primary overflow-hidden h-full flex flex-col ${
                closed ? 'w-full min-w-16 max-w-16' : 'w-full min-w-64 max-w-64'
            } transition-all duration-500 ease-in-out ${themeStyle} `}
            ref={sidebarRef}
        >
            <div
                className={`${
                    closed && 'opacity-0'
                } absolute w-64 flex flex-col gap-2 transition-all duration-500 ease-in-out p-4`}
            >
                <span className="font-work-black text-2xl">Budgets</span>
                {budgetLinks}
                <Divider className="border-white my-2" />
                <AddBudgetButton />
                {/* <Divider className="border-white" /> */}
            </div>
            <div
                className={`${!closed && 'hidden'} absolute h-full w-64 z-10`}
            />
            <SidebarCloseButton closed={closed} setClosed={setClosed} />
        </div>
    )
}

export default Sidebar
