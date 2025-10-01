"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PopupProps {
	content: string;
	isVisible: boolean;
	onClose: () => void;
}

export function Popup({ content, isVisible, onClose }: PopupProps) {
	return (
		<Dialog open={isVisible} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<div 
					className="prose prose-black font-instrument"
					dangerouslySetInnerHTML={{ __html: content }}
				/>
			</DialogContent>
		</Dialog>
	);
}