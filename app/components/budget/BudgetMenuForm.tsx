import { useRef } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { useTheme } from '~/context/ThemeContext'
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
    action?: string
}

const BudgetMenuForm = ({
    label,
    name,
    className,
    defaultValue,
    schema,
    action,
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
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        resetOptions: {
            keepErrors: false,
        },
    })
    const { ref, ...rest } = register(name)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const error = errors[name] as FieldError | undefined
    const inputValue = watch(name)

    const fetcher = useFetcher()
    const validator = useRevalidator()

    const { theme } = useTheme()
    const themeStyles =
        theme === 'DARK' ? 'text-dark bg-dark' : 'text-light bg-light'
    const focusThemeStyles =
        theme === 'DARK' ? 'focus:outline-light' : 'focus:outline-dark'

    const submit = () => {
        // due to skeleton and nothing in the backend happening, defaultValue never changes
        // thus, currently it seems like it's constantly being submitted if you blur (various focus events)
        // even though the value hasn't changed
        // will fix itself once defaultValue is updated and this component is rerendered
        if (
            inputValue &&
            inputValue !== defaultValue &&
            inputValue !==
                (fetcher.data as unknown as { TEMP_DELETE_CAT_NAME?: string })
                    ?.TEMP_DELETE_CAT_NAME // shut up typescript i know it's temporary and will be deleted
        ) {
            fetcher.submit(
                { [name]: getValues(name) },
                { method: 'PATCH', action }
            )
            validator.revalidate()
            inputRef.current?.blur()
        }
    }

    // we don't use fetcher.Form because we mainly use fetcher for fetcher.submit
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                submit()
            }}
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
                    ref={(e) => {
                        ref(e)
                        inputRef.current = e
                    }}
                    {...rest}
                    onBlur={() => {
                        if (error) {
                            reset()
                        } else {
                            submit()
                        }
                    }}
                />
                <button
                    onClick={() => inputRef.current?.focus()}
                    className="flex justify-center items-center bg-opacity-100 hover:bg-opacity-[85%] bg-primary transition aspect-square h-full rounded-lg"
                >
                    <Icon type="edit" className="size-5" />
                </button>
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
