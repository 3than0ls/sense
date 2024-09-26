import React from 'react'
import { useModal } from '~/context/ModalContext'
import BudgetForm from '../budget/BudgetForm'
import { useTheme, useThemeClass } from '~/context/ThemeContext'
import Icon from '../icons/Icon'

const AddBudgetButton = () => {
    const { setActive, setModalTitle, setModalChildren } = useModal()
    const onClick = () => {
        setModalTitle('Create a Budget')
        setModalChildren(<BudgetForm />)
        setActive(true)
    }

    const { theme } = useTheme()
    const focusThemeStyles =
        theme === 'DARK' ? 'focus:outline-light ' : 'focus:outline-dark '

    return (
        <button
            onClick={onClick}
            className={`w-full bg-white bg-opacity-20 hover:bg-opacity-30 p-2 text-left rounded-lg gap-2 flex justify-center items-center
        ${focusThemeStyles} outline-offset-[3px] outline-2 outline-none transition`}
        >
            Create Budget
            <Icon type="plus-circle" />
        </button>
    )
}

export default AddBudgetButton
