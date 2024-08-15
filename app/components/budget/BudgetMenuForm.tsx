import { useState } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { useTheme } from '~/context/ThemeContext'
import Submit from '../form/Submit'
import Icon from '../icons/Icon'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFetcher, useRevalidator } from '@remix-run/react'

type BudgetMenuProps = {
    className?: string
    label: string
    name: string
    defaultValue: string
    schema: z.AnyZodObject
}

const BudgetMenuForm = ({
    label,
    name,
    className,
    defaultValue,
    schema,
}: BudgetMenuProps) => {
    // this component is an abomination
    // in an ideal world, this would not have been necessary, and I would've been able to use RemixForm
    // unfortunately, it's not an ideal world. In fact it's a cruel one.
    // I wasn't even able to use useRemixForm hook
    // Instead, a bunch of manual settings from scratch had to be created
    // I hate forms.
    const {
        register,
        getValues,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        // defaultValues: {
        //      [name]: defaultValue,
        // },
        resetOptions: {
            keepErrors: false,
        },
    })
    const error = errors[name] as FieldError | undefined
    const [changed, setChanged] = useState(false)

    const fetcher = useFetcher()
    const validator = useRevalidator()

    const { theme } = useTheme()
    const themeStyles =
        theme === 'DARK' ? 'text-dark bg-dark' : 'text-light bg-light'
    const focusThemeStyles =
        theme === 'DARK' ? 'focus:outline-light' : 'focus:outline-dark'

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                fetcher.submit({ [name]: getValues(name) }, { method: 'PATCH' })
                validator.revalidate()
            }}
            onChange={() => setChanged(getValues('name') !== defaultValue)}
            className={`flex flex-col gap-1 text-md w-full ${className}`}
        >
            <label htmlFor={name} className={`ml-1 text-lg`}>
                {label}
            </label>
            <div className="flex gap-2">
                <input
                    aria-label={label}
                    className={
                        `${themeStyles} flex-grow rounded-lg p-2 transition-all duration-100 outline-none outline-offset-0` +
                        (error
                            ? ' outline-error outline-[3px]'
                            : ` ${focusThemeStyles} focus:outline-[3px]`)
                    }
                    autoComplete="off"
                    defaultValue={defaultValue}
                    {...register(name)}
                    onBlur={() => {
                        if (error) {
                            reset()
                            setChanged(false)
                        }
                    }}
                />
                <Submit
                    className="text-sm px-0 py-0 flex justify-center items-center rounded-lg w-auto h-full aspect-square"
                    disabled={(!changed || error) as boolean}
                >
                    <Icon type="edit" className="size-5" />
                </Submit>
            </div>
            {error && (
                <p className="text-error transition-all duration-100 animate-fade-in">
                    {error.message}
                </p>
            )}
        </form>
    )
}

export default BudgetMenuForm
