import { Link } from '@remix-run/react'

type SidebarLinkProps = {
    href: string
    text?: React.ReactNode
}

const SidebarLink = ({ href, text }: SidebarLinkProps) => {
    return (
        <Link
            to={href}
            className={`flex items-center p-2 bg-opacity-0 bg-white hover:bg-opacity-20 transition-all duration-400 ease-in-out rounded-xl`}
        >
            <span className="truncate text-base font-work-bold">{text}</span>
        </Link>
    )
}

export default SidebarLink
