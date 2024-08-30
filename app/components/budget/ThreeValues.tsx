type ThreeValuesProps = {
    balance: string
    assigned: string
    target: string
}

const ThreeValues = ({ balance, assigned, target }: ThreeValuesProps) => {
    // ideas for the progress bar that will definitely be put in it's own component:
    // drag the assigned and balance ends to automatically set assigned and balance categories

    // alternative design choice: have own flex-box column for editing, making it fixed not hover

    return (
        <div className="flex items-center gap-4 min-h-10">
            <div className="w-24 flex justify-end items-center gap-2">
                <span className="text-right">{balance}</span>
                <hr className="bg-balance border-0 aspect-square h-2 rounded-full" />
            </div>
            <div className="w-24 flex justify-end items-center gap-2">
                <span className="text-right">{assigned}</span>
                <hr className="bg-assigned border-0 aspect-square h-2 rounded-full" />
            </div>
            <div className="w-24 flex justify-end items-center gap-2">
                <span className="text-right">{target}</span>
                <hr className="bg-target border-0 aspect-square h-2 rounded-full" />
            </div>
        </div>
    )
}

export default ThreeValues
