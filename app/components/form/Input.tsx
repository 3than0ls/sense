import React from 'react'
import { useFormContext, FieldError } from 'react-hook-form'

interface InputProps {
    className?: string
    name: string
    label?: string
    placeholder?: string
    type?: React.HTMLInputTypeAttribute | undefined
}

const Input = ({
    className,
    name,
    label,
    placeholder,
    type = 'text',
}: InputProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext()

    label = label ?? name

    const error = errors[name] as FieldError | undefined

    return (
        <div className={`rounded-xl flex flex-col gap-1 p-3 ${className}`}>
            <label htmlFor={name} className="text-2xl">
                {label}
            </label>
            <input
                {...register(name)}
                aria-label={label}
                placeholder={placeholder}
                type={type}
                className={
                    'rounded-lg p-2 transition-all duration-100 outline-none outline-offset-0 ' +
                    (error
                        ? 'outline-error outline-[3px]'
                        : 'focus:outline-black focus:outline-[3px]')
                }
            />
            {error && <p className="text-error">{error.message}</p>}
        </div>
    )
}

export default Input
