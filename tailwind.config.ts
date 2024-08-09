import type { Config } from 'tailwindcss'

export default {
    content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#f7843c',
                good: '#e62b25',
                bad: '#49cf06',
                'text-light': '#0f0f0f',
                'text-dark': '#0f0f0f',
                'bg-light': '#edeae6',
                'bg-dark': '#262625',
            },
        },
    },
    plugins: [],
} satisfies Config
