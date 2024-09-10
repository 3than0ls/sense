const bindNumber = (num: number, min: number, max: number) => {
    if (min > max || max < min) {
        throw new Error('Binding number parameters min and max are invalid.')
    }
    return Math.min(Math.max(num, min), max)
}

type BudgetItemBarProps = {
    balance: number
    target: number
    assigned: number
    expanded: boolean
}

const BudgetItemBar = ({
    balance,
    target,
    assigned,
    expanded,
}: BudgetItemBarProps) => {
    const assignedWidth = bindNumber((assigned / target) * 100, 0, 100)
    const balanceWidth = bindNumber((balance / target) * 100, 0, 100)

    return (
        <div
            className={`relative w-full h-2 flex min-w-64 justify-center items-center ${
                expanded && 'hidden'
            }`}
        >
            <div className="absolute left-0 bg-target w-full h-full rounded-lg" />
            <div
                className="absolute left-0 bg-assigned h-full rounded-lg"
                style={{
                    width: `${assignedWidth}%`,
                }}
            />
            <div
                className="absolute left-0 bg-balance h-full rounded-lg"
                style={{
                    width: `${balanceWidth}%`,
                }}
            />
        </div>
    )
}

export default BudgetItemBar
