"use client";

import { useAboutContent } from "@/hooks/useAboutContent";

const AboutSkeleton = () => <div className="space-y-8 p-4 pb-32"></div>;

export const About = () => {
	const { content, isLoading, error } = useAboutContent();

	// Show skeleton only on initial load, not when revalidating
	if (isLoading && !content) {
		return <AboutSkeleton />;
	}

	// Show error state with fallback content
	if (error && !content) {
		console.error("Error loading about content:", error);
	}

	// Always render content - either cached, fresh, or fallback
	return (
		<div
			className="about space-y-4 p-4 pb-32"
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	);
};
