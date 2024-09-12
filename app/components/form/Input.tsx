import React from 'react'
import { useFormContext, FieldError } from 'react-hook-form'
import { useTheme } from '~/context/ThemeContext'

interface InputProps {
    className?: string
    name: string
    label?: string
    placeholder?: string
    defaultValue?: string
    type?: React.HTMLInputTypeAttribute | undefined
    textArea?: boolean
    isMoney?: boolean
}

const Input = ({
    className,
    name,
    label,
    placeholder,
    type = 'text',
    defaultValue = '',
    textArea = false,
    isMoney = false,
}: InputProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext()

    label = label ?? name

    const error = errors[name] as FieldError | undefined

    const { theme } = useTheme()
    const themeStyles =
        theme === 'DARK' ? 'text-light bg-light' : 'text-light bg-white'
    const focusThemeStyles =
        theme === 'DARK' ? 'focus:outline-light' : 'focus:outline-dark'

    return (
        <div className={`flex flex-col w-full text-md gap-0.5 ${className}`}>
            <label htmlFor={name} className="ml-1 text-xl">
                {label}
            </label>
            {!textArea ? (
                <div className="w-full relative">
                    <input
                        {...register(name)}
                        aria-label={label}
                        placeholder={placeholder}
                        type={type}
                        className={
                            `${themeStyles} w-full rounded-lg p-2 transition-all duration-100 outline-none outline-offset-2` +
                            (error
                                ? ' outline-error outline-[3px]'
                                : ` ${focusThemeStyles} focus:outline-[3px]`)
                        }
                        defaultValue={defaultValue}
                    />
                    {isMoney && (
                        <span className="absolute p-2 mr-1 right-0 text-subtle">
                            ($)
                        </span>
                    )}
                </div>
            ) : (
                <textarea
                    {...register(name)}
                    aria-label={label}
                    placeholder={placeholder}
                    className={
                        `${themeStyles} rounded-lg p-2 h-32 transition-all duration-100 outline-none outline-offset-2` +
                        (error
                            ? ' outline-error outline-[3px]'
                            : ` ${focusThemeStyles} focus:outline-[3px]`)
                    }
                    defaultValue={defaultValue}
                />
            )}

            <p
                className={`${
                    !error && 'invisible'
                } text-sm ml-1 text-error transition-all duration-100 animate-fade-in`}
            >
                {error && error.message}&nbsp;
            </p>
        </div>
    )
}

export default Input
