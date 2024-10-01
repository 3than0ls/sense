import { Link } from '@remix-run/react'
import { useTheme } from '~/context/ThemeContext'
import { UserDataType } from '~/prisma/userData'

type NavBarLinkProps = {
    children?: React.ReactNode
    to: string
    className?: string
}

const NavBarLink = ({ children, to, className }: NavBarLinkProps) => {
    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'text-light ' : 'text-dark'

    return (
        <Link
            to={to}
            className={`${themeStyle} ${className} rounded-xl font-work-bold text-xl text-white hover:text-opacity-80 transition duration-100`}
        >
            {children}
        </Link>
    )
}

type NavBarProps = {
    userData: UserDataType | null
}

const NavBar = ({ userData }: NavBarProps) => {
    return (
        <div className="absolute z-30 w-full py-5 px-24 bg-primary flex justify-end items-center gap-12">
            <NavBarLink to="/" className={'mr-auto'}>
                Home
            </NavBarLink>
            <NavBarLink to="/">About</NavBarLink>
            {userData === null ? (
                <>
                    <NavBarLink to="/signup">Sign In</NavBarLink>
                </>
            ) : (
                <>
                    <NavBarLink to="/budget">Budgets</NavBarLink>
                    <NavBarLink to="/">{userData.firstName}</NavBarLink>
                </>
            )}
        </div>
    )
}

export default NavBar
