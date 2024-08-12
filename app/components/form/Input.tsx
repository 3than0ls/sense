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
        <div className={`flex flex-col gap-1 text-md ${className}`}>
            <label htmlFor={name} className="ml-1 text-xl">
                {label}
            </label>
            <input
                {...register(name)}
                aria-label={label}
                placeholder={placeholder}
                type={type}
                className={
                    'text-black rounded-lg p-2 transition-all duration-100 outline-none outline-offset-0 ' +
                    (error
                        ? 'outline-error outline-[3px]'
                        : 'focus:outline-black focus:outline-[3px]')
                }
            />
            <span className="text-sm ml-1">
                {error ? (
                    <p className="text-error transition-all duration-100 animate-fade-in">
                        {error.message}
                    </p>
                ) : (
                    <p>&nbsp;</p>
                )}
            </span>
        </div>
    )
}

export default Input
