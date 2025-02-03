"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
	onImageUpload: (imageUrl: string) => void;
	className?: string;
}

export function ImageUpload({ onImageUpload, className }: ImageUploadProps) {
	const [preview, setPreview] = React.useState<string | null>(null);
	const [isUploading, setIsUploading] = React.useState(false);
	const { toast } = useToast();

	const uploadImage = async (file: File) => {
		try {
			const formData = new FormData();
			formData.set("image", file);

			const response = await fetch("/api/images/upload", {
				method: "PUT",
				headers: {
					Authorization: `Basic ${btoa("active:chapter")}`,
				},
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`Upload failed: ${response.statusText}`);
			}

			const key = await response.text();
			return `/api/images/${key}`;
		} catch (error) {
			console.error("Upload error:", error);
			throw error;
		}
	};

	const handleUpload = async (file: File) => {
		try {
			setIsUploading(true);

			// Create temporary preview
			const previewUrl = URL.createObjectURL(file);
			setPreview(previewUrl);

			// Upload the file
			const imageUrl = await uploadImage(file);
			onImageUpload(imageUrl);

			// Clean up temporary preview and set final URL
			URL.revokeObjectURL(previewUrl);
			setPreview(imageUrl);

			toast({
				title: "Success",
				description: "Image uploaded successfully",
			});
		} catch (error) {
			console.error("Upload error:", error);
			toast({
				variant: "destructive",
				title: "Upload failed",
				description: "Failed to upload image. Please try again.",
			});
			if (preview) {
				URL.revokeObjectURL(preview);
				setPreview(null);
			}
		} finally {
			setIsUploading(false);
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif"],
		},
		maxFiles: 1,
		onDrop: async (acceptedFiles) => {
			if (acceptedFiles?.length > 0) {
				await handleUpload(acceptedFiles[0]);
			}
		},
	});

	return (
		<div className="space-y-2">
			<Card
				{...getRootProps()}
				className={cn(
					"border-2 border-dashed relative cursor-pointer hover:border-primary/50 transition-colors",
					isDragActive && "border-primary",
					className,
				)}
			>
				<input {...getInputProps()} />

				{preview ? (
					<div className="relative aspect-video w-full overflow-hidden rounded-lg">
						<img
							src={preview}
							alt="Cover preview"
							className="object-cover w-full h-full"
						/>
						<Button
							variant="secondary"
							size="sm"
							className="absolute bottom-2 right-2 z-10"
							onClick={(e) => {
								e.stopPropagation();
								if (preview.startsWith("blob:")) {
									URL.revokeObjectURL(preview);
								}
								setPreview(null);
								onImageUpload("");
							}}
						>
							Change Image
						</Button>
					</div>
				) : (
					<div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
						{isUploading ? (
							<div className="flex flex-col items-center gap-2">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
								<p>Uploading...</p>
							</div>
						) : (
							<>
								<Upload className="h-12 w-12 mb-4" />
								<p className="text-sm text-center">
									Drag & drop an image here, or click to select
								</p>
							</>
						)}
					</div>
				)}
			</Card>
		</div>
	);
}
