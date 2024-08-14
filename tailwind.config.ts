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
            },
            colors: {
                primary: '#f7843c',
                bad: '#e62b25',
                good: '#49cf06',
                error: '#ff3333',
                balance: '#5adf17',
                target: '#f7e92d',
                assigned: '#357015',
                light: '#edeae6',
                dark: '#262625',
                subtle: '#999999',
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
