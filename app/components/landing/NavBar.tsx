import { Budget, User } from '@prisma/client'
import { Link } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import { useTheme } from '~/context/ThemeContext'
import { ReplaceDatesWithStrings } from '~/prisma/fullBudgetData'
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
    const [budgetData, setBudgetData] = useState()

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
