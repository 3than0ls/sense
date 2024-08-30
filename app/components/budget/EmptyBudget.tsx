import React from 'react'

const EmptyBudget = () => {
    return (
        <div className="w-full h-full flex flex-col gap-4 justify-center items-center border-t-0 text-subtle pb-6">
            <img
                src="/piggy.svg"
                alt="piggy"
                className="opacity-75 aspect-square w-60"
            />
            It appears you have nothing in your budget...
        </div>
    )
}

export default EmptyBudget
