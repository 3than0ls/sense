import { useRef, useState } from 'react'
import SidebarCloseButton from './SidebarCloseButton'
import SidebarLink from './SidebarLink'
import { useThemeClass } from '~/context/ThemeContext'
import { Link, useFetcher } from '@remix-run/react'
import { useModal } from '~/context/ModalContext'
import AccountForm from '../account/AccountForm'
import { Account, Budget } from '@prisma/client'
import Divider from '../Divider'
import Icon from '../icons/Icon'
import useRemixForm from '~/hooks/useRemixForm'
import { z } from 'zod'
import RemixForm from '../RemixForm'
import { SubmitHandler } from 'react-hook-form'
import { AccountFormSchemaType } from '~/zodSchemas/account'

const SidebarDropdown = ({
    title,
    budget,
    children,
}: {
    title: string
    budget: Budget
    children?: React.ReactNode
}) => {
    const [closed, setClosed] = useState(false)

    return (
        <div className="w-full">
            <Link
                to={`/budget/${budget.id}`}
                onClick={() => setClosed(!closed)}
                className="w-full flex justify-between mb-1 group text-left"
            >
                <span className="text-lg truncate font-work-bold group-hover:text-white transition">
                    {title}
                </span>
                <Icon
                    type="chevron-down"
                    className={`group-hover:stroke-white ml-auto transform transition ${
                        closed && '-rotate-180'
                    } size-6`}
                />
            </Link>
            {!closed && children}
            {/* <hr className="border-black border my-2" /> */}
        </div>
    )
}

type SidebarProps = {
    budgets: (Budget & {
        accounts: Account[]
    })[]
}

const Sidebar = ({ budgets }: SidebarProps) => {
    // make length adjustable, make it able to close

    const [closed, setClosed] = useState(false)
    const sidebarRef = useRef<HTMLDivElement | null>(null)
    const themeStyle = useThemeClass()

    const budgetLinks = Array.from(budgets, (b) => (
        <SidebarDropdown budget={b} title={b.name} key={b.id}>
            {Array.from(b.accounts, (a) => (
                <SidebarLink
                    key={a.id}
                    href={`/account/${a.id}`}
                    text={a.name}
                />
            ))}
        </SidebarDropdown>
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
                <span className="font-work-black text-2xl">Budgets</span>
                {budgetLinks}
                <Divider className="border-black" />

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
                <Divider className="border-black" />
            </div>
            <div
                className={`${!closed && 'hidden'} absolute h-full w-64 z-10`}
            />
            <SidebarCloseButton closed={closed} setClosed={setClosed} />
        </div>
    )
}

export default Sidebar
