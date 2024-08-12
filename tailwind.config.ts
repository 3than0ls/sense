import type { Config } from 'tailwindcss'

export default {
    content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            backgroundColor: {
                light: '#edeae6',
                dark: '#262625',
            },
            textColor: {
                light: '#0f0f0f',
                dark: '#fefefe',
                subtle: '#999999',
            },
            colors: {
                primary: '#f7843c',
                good: '#e62b25',
                bad: '#49cf06',
                error: '#ff3333',
            },
            fontFamily: {
                'work-black': ['Work-Sans-Black', 'sans-serif'],
                'work-bold': ['Work-Sans-Bold', 'sans-serif'],
                'work-sans': ['Work-Sans', 'Work-Sans-Bold'],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.1s ease-in-out',
            },
        },
    },
    plugins: [],
} satisfies Config
