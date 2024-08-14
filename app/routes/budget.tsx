import { Outlet } from '@remix-run/react'
import Sidebar from '~/components/sidebar/Sidebar'

export default function View() {
    // definitely going to have to use outlet?
    return (
        <div className="flex h-full">
            <Sidebar />

            <Outlet />
        </div>
    )
}
