import type { Config } from "tailwindcss";
import type { PluginUtils } from "tailwindcss/types/config";

const config: Config = {
    darkMode: ["class"],
    content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
    	extend: {
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		typography: '({ theme }: PluginUtils) => ({\n				black: {\n					css: {\n						"--tw-prose-body": theme("colors.black"),\n						"--tw-prose-headings": theme("colors.black"),\n						"--tw-prose-lead": theme("colors.black"),\n						"--tw-prose-links": theme("colors.black"),\n						"--tw-prose-bold": theme("colors.black"),\n						"--tw-prose-counters": theme("colors.black"),\n						"--tw-prose-bullets": theme("colors.black"),\n						"--tw-prose-hr": theme("colors.black"),\n						"--tw-prose-quotes": theme("colors.black"),\n						"--tw-prose-quote-borders": theme("colors.black"),\n						"--tw-prose-captions": theme("colors.black"),\n						"--tw-prose-code": theme("colors.black"),\n						"--tw-prose-pre-code": theme("colors.black"),\n						"--tw-prose-pre-bg": theme("colors.black"),\n						"--tw-prose-th-borders": theme("colors.black"),\n						"--tw-prose-td-borders": theme("colors.black"),\n						"--tw-prose-invert-body": theme("colors.black"),\n						"--tw-prose-invert-headings": theme("colors.black"),\n						"--tw-prose-invert-lead": theme("colors.black"),\n						"--tw-prose-invert-links": theme("colors.black"),\n						"--tw-prose-invert-bold": theme("colors.black"),\n						"--tw-prose-invert-counters": theme("colors.black"),\n						"--tw-prose-invert-bullets": theme("colors.black"),\n						"--tw-prose-invert-hr": theme("colors.black"),\n						"--tw-prose-invert-quotes": theme("colors.black"),\n						"--tw-prose-invert-quote-borders": theme("colors.black"),\n						"--tw-prose-invert-captions": theme("colors.black"),\n						"--tw-prose-invert-code": theme("colors.black"),\n						"--tw-prose-invert-pre-code": theme("colors.black"),\n						"--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",\n						"--tw-prose-invert-th-borders": theme("colors.black"),\n						"--tw-prose-invert-td-borders": theme("colors.black"),\n					},\n				},\n			})',
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
	plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
export default config;
