import React, { useState } from 'react'
import { BudgetFullType } from '~/context/BudgetContext'
import Icon from '../icons/Icon'
import SidebarCloseButton from './SidebarCloseButton'
import SidebarLink from './SidebarLink'
import { useThemeClass } from '~/context/ThemeContext'

type SidebarProps = {}

const Sidebar = (SidebarProps: SidebarProps) => {
    // make length adjustable, make it able to close

    const [width, setWidth] = useState(250)
    const closed = width === 0
    const themeStyle = useThemeClass()

    return (
        <div
            className={`bg-primary h-full flex flex-col max-w-64 min-w-14 p-4 transition-all duration-300 ease-in-out ${themeStyle} `}
            style={{ width }}
        >
            <SidebarLink
                href="/a"
                closed={closed}
                openChildren={() => 'A Link'}
                closedChildren={() => 'A'}
            />
            <SidebarLink
                href="/a"
                closed={closed}
                openChildren={() => 'B Link'}
                closedChildren={() => 'B'}
            />
            <SidebarLink
                href="/a"
                closed={closed}
                openChildren={() => 'ignore the terrible color :('}
                closedChildren={() => 'C'}
            />
            <SidebarCloseButton closed={closed} setWidth={setWidth} />
        </div>
    )
}

export default Sidebar
