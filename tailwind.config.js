/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/renderer/**/*.{js,jsx,ts,tsx,html}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#282268',
                    hover: '#3a2f8f',
                    light: 'rgba(40, 34, 104, 0.1)',
                },
                bg: {
                    dark: '#0a0a0a',
                    secondary: '#111111',
                    tertiary: '#1a1a1a',
                },
                border: '#252525',
                text: {
                    primary: '#e4e4e7',
                    secondary: '#a1a1aa',
                    tertiary: '#71717a',
                },
                success: '#22c55e',
                error: '#ef4444',
                warning: '#f59e0b',
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
                mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace'],
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'pulse-slow': 'pulse 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
