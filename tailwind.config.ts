import type { Config } from "tailwindcss";
import type { PluginUtils } from "tailwindcss/types/config";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
			typography: ({ theme }: PluginUtils) => ({
				black: {
					css: {
						"--tw-prose-body": theme("colors.black"),
						"--tw-prose-headings": theme("colors.black"),
						"--tw-prose-lead": theme("colors.black"),
						"--tw-prose-links": theme("colors.black"),
						"--tw-prose-bold": theme("colors.black"),
						"--tw-prose-counters": theme("colors.black"),
						"--tw-prose-bullets": theme("colors.black"),
						"--tw-prose-hr": theme("colors.black"),
						"--tw-prose-quotes": theme("colors.black"),
						"--tw-prose-quote-borders": theme("colors.black"),
						"--tw-prose-captions": theme("colors.black"),
						"--tw-prose-code": theme("colors.black"),
						"--tw-prose-pre-code": theme("colors.black"),
						"--tw-prose-pre-bg": theme("colors.black"),
						"--tw-prose-th-borders": theme("colors.black"),
						"--tw-prose-td-borders": theme("colors.black"),
						"--tw-prose-invert-body": theme("colors.black"),
						"--tw-prose-invert-headings": theme("colors.black"),
						"--tw-prose-invert-lead": theme("colors.black"),
						"--tw-prose-invert-links": theme("colors.black"),
						"--tw-prose-invert-bold": theme("colors.black"),
						"--tw-prose-invert-counters": theme("colors.black"),
						"--tw-prose-invert-bullets": theme("colors.black"),
						"--tw-prose-invert-hr": theme("colors.black"),
						"--tw-prose-invert-quotes": theme("colors.black"),
						"--tw-prose-invert-quote-borders": theme("colors.black"),
						"--tw-prose-invert-captions": theme("colors.black"),
						"--tw-prose-invert-code": theme("colors.black"),
						"--tw-prose-invert-pre-code": theme("colors.black"),
						"--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
						"--tw-prose-invert-th-borders": theme("colors.black"),
						"--tw-prose-invert-td-borders": theme("colors.black"),
					},
				},
			}),
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
export default config;
