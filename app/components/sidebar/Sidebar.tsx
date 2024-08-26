import { useRef, useState } from 'react'
import SidebarCloseButton from './SidebarCloseButton'
import SidebarLink from './SidebarLink'
import { useThemeClass } from '~/context/ThemeContext'
import { useFetcher, useNavigate } from '@remix-run/react'

const Sidebar = () => {
    // make length adjustable, make it able to close

    const [width, setWidth] = useState(600)
    const sidebarRef = useRef<HTMLDivElement | null>(null)
    const [closed, setClosed] = useState(false)
    const themeStyle = useThemeClass()

    const TEMPFETCHER = useFetcher()

    return (
        <div
            onTransitionEnd={(e) => {
                if (e.target === sidebarRef.current) {
                    setClosed(!closed)
                }
            }}
            className={`bg-primary h-full flex flex-col max-w-64 min-w-16 py-4 px-2 transition-all duration-500 ease-in-out ${themeStyle} `}
            style={{ width }}
            ref={sidebarRef}
        >
            <SidebarLink
                href="/"
                closed={width === 0 && closed}
                openChildren={() => 'Home'}
                closedChildren={() => 'H'}
            />
            <SidebarLink
                href="c859c0a7-e5b9-40e4-ad93-bc045b0459d3"
                closed={width === 0 && closed}
                openChildren={() => 'Budget 1'}
                closedChildren={() => 'B'}
            />
            <SidebarLink
                href="idkwhatthiswilldo"
                closed={width === 0 && closed}
                openChildren={() => 'ignore the bad color :('}
                closedChildren={() => 'N'}
            />
            <TEMPFETCHER.Form action="/api/bud/create" method="POST">
                <button
                    type="submit"
                    className="bg-primary text-white border-2 border-black rounded-2xl"
                >
                    create a budget!
                </button>
            </TEMPFETCHER.Form>
            <SidebarCloseButton
                width={width}
                closed={closed}
                setWidth={setWidth}
            />
        </div>
    )
}

export default Sidebar
