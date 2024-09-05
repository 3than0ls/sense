import { Link } from '@remix-run/react'

type SidebarLinkProps = {
    href: string
    text?: React.ReactNode
}

const SidebarLink = ({ href, text }: SidebarLinkProps) => {
    return (
        <Link
            to={href}
            className={`flex items-center py-1 px-2 bg-opacity-0 bg-white hover:bg-opacity-20 transition-all duration-400 ease-in-out rounded-lg`}
        >
            <span className="truncate text-base">{text}</span>
        </Link>
    )
}

export default SidebarLink
