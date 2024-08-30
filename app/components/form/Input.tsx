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
}

const Input = ({
    className,
    name,
    label,
    placeholder,
    type = 'text',
    defaultValue = '',
    textArea = false,
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
        <div className={`flex flex-col gap-1 text-md ${className}`}>
            <label htmlFor={name} className="ml-1 text-xl">
                {label}
            </label>
            {!textArea ? (
                <input
                    {...register(name)}
                    aria-label={label}
                    placeholder={placeholder}
                    type={type}
                    className={
                        `${themeStyles} rounded-lg p-2 transition-all duration-100 outline-none outline-offset-2` +
                        (error
                            ? ' outline-error outline-[3px]'
                            : ` ${focusThemeStyles} focus:outline-[3px]`)
                    }
                    defaultValue={defaultValue}
                />
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
