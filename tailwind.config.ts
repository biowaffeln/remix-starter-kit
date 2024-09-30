import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

export default {
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
			},
			colors: ({ colors }) => ({
				gray: colors.stone,
				primary: colors.pink,
			}),
			screens: {
				"pointer-coarse": { raw: "(pointer: coarse)" },
			},
			height: {
				input: "42px",
			},
		},
	},
	plugins: [forms],
} satisfies Config;
