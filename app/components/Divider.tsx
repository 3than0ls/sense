type DividerProps = { className?: string }

const Divider = ({ className }: DividerProps) => {
    return <hr className={`h-[1px] border-none bg-subtle ${className}`} />
}

export default Divider
