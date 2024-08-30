import BudgetCategory from './BudgetCategory'
import Icon from '../icons/Icon'
import { useTheme } from '~/context/ThemeContext'
import BudgetMenu from './BudgetMenu'
import { FullBudgetDataType } from '~/prisma/fullBudgetData'
import EmptyBudget from './EmptyBudget'
import { useModal } from '~/context/ModalContext'
import BudgetInfoForm from './BudgetInfoForm'
import TopBar from './TopBar'
import { useRef } from 'react'
import { useNavigate } from '@remix-run/react'

type BudgetProps = {
    budgetData: FullBudgetDataType
}

const Budget = ({ budgetData }: BudgetProps) => {
    const { description, name, budgetCategories } = budgetData

    const budgetCategoryComponents = Array.from(
        budgetCategories,
        (budgetCategory) => (
            <BudgetCategory
                budgetCategory={budgetCategory}
                key={budgetCategory.id}
            />
        )
    )

    const { theme } = useTheme()
    const themeStyles = theme === 'DARK' ? 'bg-black' : 'bg-white'

    const backRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const { setModalChildren, setActive, setModalTitle } = useModal()

    return (
        <div className="w-full h-full min-w-[600px] flex flex-col">
            <div className={`flex gap-6 p-4 items-center`}>
                <div className="flex flex-col w-full">
                    <button
                        className="text-4xl font-work-black text-left flex items-center gap-4 group w-fit"
                        onClick={() => {
                            setModalTitle('Budget info')
                            setModalChildren(
                                <BudgetInfoForm
                                    name={budgetData.name}
                                    description={budgetData.description || ''}
                                    budgetId={budgetData.id}
                                />
                            )
                            setActive(true)
                        }}
                    >
                        <span className="text-4xl font-work-black group-hover:opacity-90 transition">
                            {name}
                        </span>
                        <Icon
                            type="edit"
                            className={`size-6 stroke-subtle group-hover:brightness-150 transition`}
                            interactive
                        />
                    </button>
                    <span>{description}</span>
                </div>
            </div>
            <div className="flex flex-grow overflow-auto">
                <div className="relative flex-grow flex flex-col border-t border-subtle">
                    <div
                        ref={backRef}
                        className={`flex flex-col ${themeStyles} flex-grow overflow-y-auto`}
                    >
                        <TopBar budgetId={budgetData.id} />
                        {budgetCategoryComponents.length > 0 ? (
                            budgetCategoryComponents
                        ) : (
                            <EmptyBudget />
                        )}
                        <button
                            onClick={() => {
                                // clicking this navigates back to main budget page
                                navigate(`/budget/${budgetData.id}`)
                            }}
                            className="hover:cursor-default w-full flex-grow"
                        ></button>
                    </div>
                </div>

                <BudgetMenu budgetData={budgetData} />
            </div>
        </div>
    )
}

export default Budget
