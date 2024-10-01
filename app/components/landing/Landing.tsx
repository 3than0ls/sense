import { Link, useRevalidator } from '@remix-run/react'
import React from 'react'
import { useTheme } from '~/context/ThemeContext'
import NavBar from './NavBar'
import { UserDataType } from '~/prisma/userData'
import { useSupabase } from '~/context/SupabaseContext'

const LandingButton = ({
    to,
    onClick,
    children,
}: {
    to?: string
    children: React.ReactNode
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
}) => {
    const { theme } = useTheme()

    const themeClass =
        theme === 'LIGHT'
            ? 'bg-white text-light border-dark'
            : 'bg-black text-dark border-light'

    const altThemeClass = theme === 'LIGHT' ? 'bg-dark' : 'bg-white'

    return (
        <div className="text-nowrap relative font-work-bold">
            <span className={`rounded-full px-6 py-3 border invisible`}>
                {children}
            </span>
            <Link
                onClick={onClick}
                to={to ?? '/'}
                className={`top-0 left-0 absolute peer z-10 shadow-2xl rounded-full px-6 py-3 border ${themeClass}`}
            >
                {children}
            </Link>
            <div
                className={`${altThemeClass} top-0 left-0 absolute rounded-full px-6 py-3 transform peer-hover:translate-x-0 translate-x-2 peer-hover:translate-y-0 translate-y-2 transition duration-300`}
            >
                <span className="invisible">{children}</span>
            </div>
        </div>
    )
}

type LandingProps = {
    userData: UserDataType | null
}

const Landing = ({ userData }: LandingProps) => {
    const { theme } = useTheme()

    const themeClass =
        theme === 'DARK' ? 'text-light bg-black' : 'text-dark bg-white'

    const revalidator = useRevalidator()
    const supabase = useSupabase()

    const signOut: React.MouseEventHandler<HTMLAnchorElement> = async (e) => {
        e.preventDefault()
        await supabase.auth.signOut()
        revalidator.revalidate()
    }

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <NavBar userData={userData} />
            <div className="absolute w-screen h-screen">
                <svg
                    className="absolute fill-primary size-[900px] opacity-40 transform -top-[300px] -left-[300px] scale-125"
                    viewBox="0 0 200 200"
                    // width="600"
                    // height="600"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M60.8,-14C67.7,1.4,54.6,29.2,32.1,46C9.6,62.7,-22.2,68.5,-37.2,56.4C-52.2,44.3,-50.3,14.3,-41.3,-4.1C-32.3,-22.5,-16.2,-29.2,5.4,-31C27,-32.7,54,-29.5,60.8,-14Z"
                        transform="translate(100 100)"
                    />
                </svg>
            </div>
            <div className="absolute w-full h-full z-10 flex justify-around items-center px-24 gap-12">
                <div className="flex flex-col w-3/5 max-w-[1000px] gap-6">
                    <div className="flex flex-col gap-4">
                        <span className="font-work-black text-8xl">
                            Know your money.
                        </span>
                        <div className="text-xl">
                            {userData === null
                                ? 'Want to start saving? Create a budget to track your expenses and limit the amount you spend a month. Start by creating an account or logging in!'
                                : 'Welcome back! View your budget to save more.'}
                        </div>
                    </div>
                    <div className="w-full flex gap-4">
                        {userData === null ? (
                            <>
                                <LandingButton to="/signin">
                                    Log In
                                </LandingButton>
                                <LandingButton to="/signup">
                                    Create Account
                                </LandingButton>
                            </>
                        ) : (
                            <>
                                <LandingButton to="/budget">
                                    View Budget Dashboard
                                </LandingButton>
                                <LandingButton onClick={signOut}>
                                    Sign Out
                                </LandingButton>
                            </>
                        )}
                    </div>
                </div>
                <div className="relative w-2/5 max-w-[500px] h-full p-12 flex justify-center items-center">
                    <img
                        src="/piggy.svg"
                        alt="piggy"
                        className="stroke-black aspect-square w-full relative z-10"
                    />
                    <div className="absolute left-0 top-24 rounded-t-full w-full h-full bg-opacity-40 bg-primary"></div>
                    {/* vertical rectangle with rounded corner covering pig here */}
                    {/* <svg
                        className="absolute inset-0 fill-primary opacity-50 z-0 transform scale-150"
                        viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M46.2,-46.9C61.5,-42.2,76.6,-29.2,81.9,-12.5C87.1,4.2,82.4,24.5,71.3,38.7C60.2,53,42.7,61,24.5,67.8C6.4,74.6,-12.4,80.1,-21.2,71.2C-30,62.4,-28.8,39.2,-32.4,23.4C-36,7.6,-44.3,-0.9,-48.8,-14.4C-53.3,-27.9,-53.9,-46.5,-45.2,-52.3C-36.4,-58.1,-18.2,-51,-1.4,-49.4C15.5,-47.8,30.9,-51.5,46.2,-46.9Z"
                            transform="translate(100 100)"
                        />
                    </svg> */}
                </div>
            </div>
            <div
                className={`${themeClass} z-40 absolute bottom-0 left-0 h-20 w-full`}
            ></div>
        </div>
    )
}

export default Landing
