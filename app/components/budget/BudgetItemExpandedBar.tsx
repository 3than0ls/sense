import { useTheme } from '~/context/ThemeContext'
import toCurrencyString from '~/utils/toCurrencyString'

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

const indicatorPosition = (num: number) => {
    const distance = 2

    if (num < 0) {
        return -distance
    }
    if (num > 100) {
        return 100 + distance
    }
    return bindNumber(num, 1, 99)
}

const Indicator = ({ label, amount, x, direction }: IndicatorProps) => {
    const { theme } = useTheme()

    const themeStyle =
        theme === 'LIGHT' ? 'bg-dark text-dark' : 'bg-light text-light'

    return (
        <div
            className={`absolute flex flex-col items-center text-sm text-nowrap `}
            style={{
                left: `${x}%`,
            }}
        >
            {(x < 0 || x > 100) && (
                <hr
                    className={`absolute 
                        ${x < 0 && 'left-0'} 
                        ${x > 100 && 'right-0'}
                        bottom-2 z-0 w-12 h-[3px] ${themeStyle}`}
                />
            )}

            <div
                className={`absolute ${
                    direction === 'up' ? '-top-[30px]' : '-top-[30px] '
                } z-30 flex flex-col items-center`}
            >
                <div
                    className={`w-[4px] ${
                        direction === 'up' ? 'h-[70px]' : 'h-[40px]'
                    }  ${themeStyle}`}
                ></div>
                <span
                    className={`${themeStyle} flex items-center justify-center gap-1 px-3 py-1 text-xs rounded-full`}
                >
                    <hr
                        className={`${
                            label === 'Balance' ? 'bg-balance' : 'bg-assigned'
                        } border aspect-square h-2 rounded-full`}
                    />
                    <span className={`${amount < 0 && 'text-bad'}`}>
                        {toCurrencyString(amount)}
                    </span>
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
    const assignedRatio = (assigned / (target || 1)) * 100
    const assignedWidth = bindNumber(assignedRatio, 0, 100)
    const assignedIndicator = indicatorPosition(assignedRatio)

    const balanceRatio = (balance / (target || 1)) * 100
    const balanceWidth = bindNumber(balanceRatio, 0, 100)
    const balanceIndicator = indicatorPosition(balanceRatio)

    // const assignedWidthUnadjusted = (assigned / (target || 1)) * 100
    // const assignedWidth =
    //     assigned >= 0 && assigned <= 100
    //         ? bindNumber(assignedWidthUnadjusted, 1, 99)
    //         : bindNumber(assignedWidthUnadjusted, 0, 100)
    // const balanceWidthUnadjusted = (balance / (target || 1)) * 100
    // const balanceWidth =
    //     balance >= 0 && balance <= 100
    //         ? bindNumber(balanceWidthUnadjusted, 1, 99)
    //         : bindNumber(balanceWidthUnadjusted, 0, 100)
    const stacked =
        Math.abs(balanceWidth - assignedWidth) < 15 && balance !== assigned

    return (
        <div
            className={`pt-3 ${
                stacked ? 'pb-[4.5rem]' : 'pb-9'
            } px-20 relative w-full flex flex-col justify-center items-start`}
        >
            <div
                className={`h-[20px] z-20 relative flex justify-end items-center w-full rounded-lg overflow-x-hidden`}
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
                {balance !== assigned && (
                    <Indicator
                        label="Assigned"
                        amount={assigned}
                        x={assignedIndicator}
                        direction="down"
                    />
                )}
                <Indicator
                    label="Balance"
                    amount={balance}
                    x={balanceIndicator}
                    direction={stacked ? 'up' : 'down'}
                />
            </div>
        </div>
    )
}

export default BudgetItemExpandedBar
