import { Link } from '@remix-run/react'
import React, { useState } from 'react'

type SidebarLinkProps = {
    href: string
    closed: boolean
    openChildren: () => React.ReactNode
    closedChildren: () => React.ReactNode
}

const SidebarLink = ({
    href,
    closed,
    openChildren,
    closedChildren,
}: SidebarLinkProps) => {
    const [transitionEnd, setTransitionEnd] = useState(true)

    return (
        <Link
            to={href}
            onTransitionEnd={(e) => console.log(e.eventPhase)}
            className={`flex items-center ${
                closed ? 'justify-center' : ''
            } w-full text-lg h-12 bg-opacity-0 bg-white hover:bg-opacity-20 transition-all duration-300 ease-in-out rounded-xl font-work-bold text-nowrap overflow-hidden`}
        >
            {closed ? closedChildren() : openChildren()}
        </Link>
    )
}

export default SidebarLink
