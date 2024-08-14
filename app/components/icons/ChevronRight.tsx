const ChevronRight = ({
    color,
    className,
}: {
    color?: string
    className?: string
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={color ?? 'currentColor'}
            className={className ?? 'size-6'}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
        </svg>
    )
}

export default ChevronRight
