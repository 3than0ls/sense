import { useRef, useState } from 'react'
import SidebarCloseButton from './SidebarCloseButton'
import SidebarLink from './SidebarLink'
import { useThemeClass } from '~/context/ThemeContext'

type SidebarProps = {}

const Sidebar = (SidebarProps: SidebarProps) => {
    // make length adjustable, make it able to close

    const [width, setWidth] = useState(600)
    const sidebarRef = useRef<HTMLDivElement | null>(null)
    const [closed, setClosed] = useState(false)
    const themeStyle = useThemeClass()

    return (
        <div
            onTransitionEnd={(e) => {
                if (e.target === sidebarRef.current) {
                    console.log('correct transition ended')
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
                href="bogusbudgetID"
                closed={width === 0 && closed}
                openChildren={() => 'Budget A'}
                closedChildren={() => 'B'}
            />
            <SidebarLink
                href="idkwhatthiswilldo"
                closed={width === 0 && closed}
                openChildren={() => 'ignore the bad color :('}
                closedChildren={() => 'N'}
            />
            <SidebarCloseButton
                width={width}
                closed={closed}
                setWidth={setWidth}
            />
        </div>
    )
}

export default Sidebar
