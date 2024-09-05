import { useRef, useState } from 'react'
import SidebarCloseButton from './SidebarCloseButton'
import SidebarLink from './SidebarLink'
import { useThemeClass } from '~/context/ThemeContext'
import { useFetcher } from '@remix-run/react'
import { useModal } from '~/context/ModalContext'
import AccountForm from '../account/AccountForm'
import { Budget } from '@prisma/client'
import Divider from '../Divider'
import Icon from '../icons/Icon'

const SidebarDropdown = ({
    title,
    children,
}: {
    title: string
    children?: React.ReactNode
}) => {
    const [closed, setClosed] = useState(false)

    return (
        <div className="w-full">
            <button
                onClick={() => setClosed(!closed)}
                className="w-full flex justify-between mb-1 group"
            >
                <span className="text-2xl font-work-black group-hover:text-white transition">
                    {title}
                </span>
                <Icon
                    type="chevron-down"
                    className={`group-hover:stroke-white ml-auto transform transition ${
                        closed && '-rotate-180'
                    } size-6`}
                />
            </button>
            {!closed && children}
            <hr className="border-black border my-2" />
        </div>
    )
}

type SidebarProps = {
    budgets: Budget[]
}

const Sidebar = ({ budgets }: SidebarProps) => {
    // make length adjustable, make it able to close

    const [closed, setClosed] = useState(false)
    const sidebarRef = useRef<HTMLDivElement | null>(null)
    const themeStyle = useThemeClass()

    const budgetLinks = Array.from(budgets, (b) => (
        <SidebarLink key={b.id} href={`/budget/${b.id}`} text={b.name} />
    ))

    const TEMPFETCHER = useFetcher()

    const { setActive, setModalTitle, setModalChildren } = useModal()

    return (
        <div
            className={`relative bg-primary overflow-hidden h-full flex flex-col max-w-64 ${
                closed ? 'w-16' : 'w-96'
            } transition-all duration-500 ease-in-out ${themeStyle} `}
            ref={sidebarRef}
        >
            <div
                className={`${
                    closed && 'opacity-0'
                } absolute w-64 flex flex-col gap-2 transition-all duration-500 ease-in-out p-4`}
            >
                <SidebarDropdown title="Budgets">{budgetLinks}</SidebarDropdown>

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
                        setModalTitle('Create an Account')
                        setModalChildren(<AccountForm budgets={budgets} />)
                        setActive(true)
                    }}
                    className="bg-primary text-white border-2 border-black rounded-2xl"
                >
                    create a account!
                </button>
                <Divider themed />
            </div>
            <div
                className={`${!closed && 'hidden'} absolute h-full w-64 z-10`}
            />
            <SidebarCloseButton closed={closed} setClosed={setClosed} />
        </div>
    )
}

export default Sidebar
