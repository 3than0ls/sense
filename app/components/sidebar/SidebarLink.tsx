import { Link } from '@remix-run/react'

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
    return (
        <Link
            to={href}
            className={`flex items-center  ${
                closed && 'justify-center'
            } w-full text-lg h-12 bg-opacity-0 bg-white hover:bg-opacity-20 transition-all duration-400 ease-in-out rounded-xl font-work-bold text-nowrap overflow-hidden`}
        >
            {closed ? (
                closedChildren()
            ) : (
                <span className="ml-4">{openChildren()}</span>
            )}
        </Link>
    )
}

export default SidebarLink
