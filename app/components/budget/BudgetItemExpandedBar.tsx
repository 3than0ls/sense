import { useTheme } from '~/context/ThemeContext'

type IndicatorProps = {
    label: string
    amount: number
    x: number
    direction: 'up' | 'down'
}

const bindNumber = (num: number, min: number, max: number) => {
    if (min > max || max < min) {
        throw new Error('Binding number parameters min and max are invalid.')
    }
    return Math.min(Math.max(num, min), max)
}

const Indicator = ({ label, amount, x, direction }: IndicatorProps) => {
    const { theme } = useTheme()

    const themeStyle =
        theme === 'LIGHT' ? 'bg-dark text-dark' : 'bg-light text-light'

    return (
        <div
            className={`absolute flex flex-col items-center text-sm text-nowrap `}
            style={{
                left: `${bindNumber(x, 1, 99)}%`,
            }}
        >
            <div
                className={`absolute ${
                    direction === 'up' ? '-top-[30px]' : '-top-[30px] '
                } flex flex-col items-center`}
            >
                <div
                    className={`w-[4px] ${
                        direction === 'up' ? 'h-[70px]' : 'h-[40px]'
                    }  ${themeStyle}`}
                ></div>
                <span
                    className={`${themeStyle} px-3 py-1 text-xs rounded-full`}
                >
                    {label}: ${amount.toFixed(2)}
                </span>
            </div>
        </div>
    )
}

type BudgetItemExpandedBarProps = {
    balance: number
    target: number
    assigned: number
}

const BudgetItemExpandedBar = ({
    balance,
    target,
    assigned,
}: BudgetItemExpandedBarProps) => {
    const assignedWidth = bindNumber((assigned / (target || 1)) * 100, 0, 100)
    const balanceWidth = bindNumber((balance / (target || 1)) * 100, 0, 100)
    const stacked = Math.abs(balanceWidth - assignedWidth) < 15

    return (
        <div
            className={`pt-3 ${
                stacked ? 'pb-[4.5rem]' : 'pb-9'
            } px-20 relative w-full flex flex-col justify-center items-start`}
        >
            <div
                className={`h-[20px] relative flex justify-end items-center w-full rounded-lg overflow-x-hidden`}
            >
                {/* <span className="mr-2">{target}</span> */}
                <div className="absolute left-0 bg-target w-full h-full rounded-lg" />
                <div
                    className="absolute left-0 bg-assigned h-full rounded-sm"
                    style={{
                        width: `${assignedWidth}%`,
                    }}
                />
                <div
                    className="absolute left-0 bg-balance h-full rounded-sm"
                    style={{
                        width: `${balanceWidth}%`,
                    }}
                />
            </div>
            <div className="relative w-full">
                <Indicator
                    label="Assigned"
                    amount={assigned}
                    x={assignedWidth}
                    direction={stacked ? 'up' : 'down'}
                />
                <Indicator
                    label="Balance"
                    amount={balance}
                    x={balanceWidth}
                    direction="down"
                />
            </div>
        </div>
    )
}

export default BudgetItemExpandedBar
