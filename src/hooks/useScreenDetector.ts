import { useEffect, useState } from "react";

export const useScreenDetector = () => {
	// Initialize with null to indicate server-side rendering
	const [width, setWidth] = useState<number | null>(null);

	useEffect(() => {
		// Set the initial width once we're on the client side
		setWidth(window.innerWidth);

		const handleWindowSizeChange = () => {
			setWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleWindowSizeChange);

		return () => {
			window.removeEventListener("resize", handleWindowSizeChange);
		};
	}, []);

	// Return null values during SSR
	if (width === null) {
		return {
			isMobile: false,
			isTablet: false,
			isDesktop: false,
			width: null,
		};
	}

	// Once we have a width value, return the breakpoint checks
	return {
		isMobile: width <= 768,
		isTablet: width <= 1024 && width > 768,
		isDesktop: width > 1024,
		width,
	};
};

// Optional: Export breakpoint values as constants
export const BREAKPOINTS = {
	MOBILE: 768,
	TABLET: 1024,
} as const;
