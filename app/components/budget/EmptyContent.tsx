const EmptyContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full h-full flex flex-col gap-4 justify-center items-center border-t-0 text-subtle pb-4">
            <img
                src="/piggy.svg"
                alt="piggy"
                className="opacity-75 aspect-square w-60"
            />
            {children}
        </div>
    )
}

export default EmptyContent
