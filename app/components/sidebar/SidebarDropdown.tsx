import { Budget } from '@prisma/client'
import { Link } from '@remix-run/react'
import { useState } from 'react'
import { useModal } from '~/context/ModalContext'
import AccountForm from '../account/AccountForm'
import Icon from '../icons/Icon'

const SidebarDropdown = ({
    budget,
    children,
}: {
    budget: Pick<Budget, 'id' | 'name'>
    children?: React.ReactNode
}) => {
    const [closed, setClosed] = useState(false)
    const { setModalChildren, setModalTitle, setActive } = useModal()

    const onCreateAccount = () => {
        setModalTitle('Create an Account')
        setModalChildren(<AccountForm budgetData={budget} />)
        setActive(true)
    }

    return (
        <div className="w-full">
            <div className="w-full flex">
                <Link
                    to={`/budget/${budget.id}`}
                    className="overflow-hidden flex justify-between mb-1 group text-left hover:underline"
                    onClick={() => setClosed(false)}
                >
                    <span className="text-lg truncate font-work-bold group-hover:text-white transition">
                        {budget.name}
                    </span>
                </Link>
                <button
                    className="ml-auto w-fit"
                    onClick={() => setClosed(!closed)}
                >
                    <Icon
                        type="chevron-down"
                        className={`group-hover:stroke-white ml-auto transform transition ${
                            closed && '-rotate-180'
                        } size-6`}
                    />
                </button>
            </div>
            {!closed && (
                <>
                    {children}
                    <button
                        onClick={onCreateAccount}
                        className={`flex justify-center items-center w-full gap-2 my-1 p-1 bg-opacity-15 bg-white hover:bg-opacity-30 transition-all duration-400 ease-in-out rounded-lg truncate text-sm`}
                    >
                        Create Account
                        <Icon type="plus-circle" className="size-5" />
                    </button>
                </>
            )}
        </div>
    )
}

export default SidebarDropdown
