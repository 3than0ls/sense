import BudgetCategory from './BudgetCategory'
import Icon from '../icons/Icon'
import { useTheme, useThemeClass } from '~/context/ThemeContext'
import BudgetMenu from './BudgetMenu'
import EmptyBudget from './EmptyBudget'
import { useModal } from '~/context/ModalContext'
import BudgetForm from './BudgetForm'
import TopBar from './TopBar'
import { useRef, useState } from 'react'
import { Link, useNavigate } from '@remix-run/react'
import { useBudgetData, useFindRelation } from '~/context/BudgetDataContext'
import usePreventLinkSpan from '~/hooks/usePreventLinkSpam'

const Budget = () => {
    const budgetData = useBudgetData()

    const { theme } = useTheme()
    const themeClass = useThemeClass()
    const themeStyles = theme === 'DARK' ? 'bg-black' : 'bg-white'
    const hoverThemeStyle =
        theme === 'DARK'
            ? 'group-hover:stroke-light'
            : 'group-hover:stroke-dark'

    const backRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const { setModalChildren, setActive, setModalTitle } = useModal()

    const onEditClick = () => {
        setModalTitle('Edit Budget info')
        setModalChildren(<BudgetForm editBudget={budgetData} />)
        setActive(true)
    }

    const budgetCategoryComponents = Array.from(
        budgetData.budgetCategories,
        (budgetCategory) => (
            <BudgetCategory
                budgetCategory={budgetCategory}
                key={budgetCategory.id}
            />
        )
    )

    const { disableSpamClick, disabled } = usePreventLinkSpan()

    return (
        <div
            className={`w-full h-full min-w-[600px] flex flex-col overflow-y-auto ${themeClass}`}
        >
            <div className="flex flex-col w-full p-4">
                <button
                    className="text-4xl font-work-black text-left flex items-center gap-4 group w-fit"
                    onClick={onEditClick}
                >
                    <span className="text-4xl font-work-black group-hover:opacity-90 transition">
                        {budgetData.name}
                    </span>
                    <Icon
                        type="edit"
                        className={`size-6 stroke-subtle ${hoverThemeStyle} transition`}
                        interactive
                    />
                </button>
                <span>{budgetData.description}</span>
            </div>
            <div className="flex flex-grow h-full overflow-hidden">
                <div className="relative min-w-64 flex-grow overflow-y-auto scrollbar-custom flex flex-col border-t border-subtle">
                    <div
                        ref={backRef}
                        className={`min-w-[800px] flex flex-col ${themeStyles} flex-grow overflow-auto scrollbar-custom`}
                    >
                        <TopBar budgetId={budgetData.id} />
                        {budgetCategoryComponents.length > 0 ? (
                            budgetCategoryComponents
                        ) : (
                            <EmptyBudget />
                        )}
                        <Link
                            to={`/budget/${budgetData.id}`}
                            replace
                            onClick={disableSpamClick}
                            className={`${
                                disabled && 'pointer-events-none'
                            } hover:cursor-default w-full flex-grow min-h-32`}
                        />
                    </div>
                </div>

                <BudgetMenu budgetData={budgetData} />
            </div>
        </div>
    )
}

export default Budget
