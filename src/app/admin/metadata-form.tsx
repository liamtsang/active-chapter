"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { format } from "date-fns";
import { useEffect } from "react";
import { getMetadataTypes, type MetadataTypes } from "@/lib/db";
import type { Metadata } from "@/types";

interface Item {
	label: string;
	value: string;
}

interface ComboboxProps {
	items: Item[];
	value: string | string[];
	onChange: (value: string | string[]) => void;
	onAddItem: (item: Item) => void;
	placeholder: string;
	label: string;
	isMulti?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({
	items,
	value,
	onChange,
	onAddItem,
	placeholder,
	label,
	isMulti = false,
}) => {
	const [open, setOpen] = React.useState(false);
	const [search, setSearch] = React.useState("");

	const filteredItems = items.filter((item) =>
		item.label.toLowerCase().includes(search.toLowerCase()),
	);

	const handleSelect = (currentValue: string) => {
		if (isMulti) {
			const currentValues = Array.isArray(value) ? value : [];
			const newValues = currentValues.includes(currentValue)
				? currentValues.filter((v) => v !== currentValue)
				: [...currentValues, currentValue];
			onChange(newValues);
		} else {
			onChange(currentValue === value ? "" : currentValue);
			setOpen(false);
		}
	};

	const handleAddNew = () => {
		if (search) {
			const newItem = {
				label: search.toLowerCase().replace(/\s+/g, "-"),
				value: search,
			};
			onAddItem(newItem); // Add the item to the parent's state
			handleSelect(newItem.value); // Select the new item
			setSearch("");
		}
	};

	const displayValue = React.useMemo(() => {
		if (isMulti) {
			const selectedCount = Array.isArray(value) ? value.length : 0;
			return selectedCount > 0 ? `${selectedCount} selected` : placeholder;
		}
		return items.find((item) => item.value === value)?.label || placeholder;
	}, [isMulti, value, items, placeholder]);

	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
					>
						{displayValue}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="font-instrument text-base w-full p-0">
					<div className="flex flex-col">
						<div className="flex items-center gap-2 p-2 border-b">
							<Input
								placeholder={`Search ${label.toLowerCase()}...`}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="border-0 focus:ring-0"
							/>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleAddNew}
								className="whitespace-nowrap"
								disabled={!search}
							>
								<Plus className="h-4 w-4 mr-2" />
								Add New
							</Button>
						</div>
						{filteredItems.length === 0 ? (
							<div className="px-2 py-4 text-center text-sm text-muted-foreground">
								No {label.toLowerCase()} found
							</div>
						) : (
							<div className="max-h-60 overflow-y-auto">
								{filteredItems.map((item) => (
									<div
										key={item.value}
										onClick={() => handleSelect(item.value)}
										className={cn(
											"flex cursor-pointer items-center justify-between px-2 py-2 hover:bg-accent",
											(isMulti &&
												Array.isArray(value) &&
												value.includes(item.value)) ||
												(!isMulti && value === item.value)
												? "bg-accent"
												: "",
										)}
									>
										<span>{item.label}</span>
										{((isMulti &&
											Array.isArray(value) &&
											value.includes(item.value)) ||
											(!isMulti && value === item.value)) && (
											<Check className="h-4 w-4" />
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

interface MetadataFormProps {
	onMetadataChange: (metadata: Metadata) => void;
	hasErrors?: boolean;
}

type MetadataTypeKey = keyof MetadataTypes;

const MetadataForm: React.FC<MetadataFormProps> = ({
	onMetadataChange,
	hasErrors,
}) => {
	const [formData, setFormData] = React.useState({
		title: "",
		author: "",
		publishDate: new Date(),
		tags: [] as string[],
		journal: "",
		medium: "",
		coverImage: "",
	});

	const [metadataTypes, setMetadataTypes] = React.useState<MetadataTypes>({
		authors: [],
		journals: [],
		mediums: [],
		tags: [],
	});

	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		async function loadMetadata() {
			const metadata = await getMetadataTypes();
			setMetadataTypes(metadata);
			setIsLoading(false);
		}
		loadMetadata();
	}, []);

	const handleAddItem = (type: MetadataTypeKey, newItem: Item) => {
		setMetadataTypes((prev) => ({
			...prev,
			[type]: [...prev[type], newItem],
		}));
	};

	useEffect(() => {
		onMetadataChange(formData);
	}, [formData, onMetadataChange]);

	if (isLoading) {
		return (
			<Card className="w-full max-w-full">
				<CardHeader>
					<CardTitle>Metadata</CardTitle>
					<CardDescription>Loading metadata...</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className={cn("w-full max-w-full", hasErrors && "border-red-500")}>
			<CardHeader>
				<CardTitle>Metadata</CardTitle>
				<CardDescription>Enter metadata here</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="space-y-6">
					<div className="space-y-2">
						<Label>Cover Image</Label>
						<ImageUpload
							onImageUpload={(imageUrl) =>
								setFormData((prev) => ({ ...prev, coverImage: imageUrl }))
							}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							value={formData.title}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, title: e.target.value }))
							}
							className="w-full"
							placeholder="Article title..."
						/>
					</div>

					<Combobox
						label="Author"
						items={metadataTypes.authors}
						value={formData.author}
						onChange={(value) =>
							setFormData((prev) => ({ ...prev, author: value as string }))
						}
						onAddItem={(item) => handleAddItem("authors", item)}
						placeholder="Select author..."
					/>

					<div className="space-y-2">
						<Label>Publish Date</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-full justify-start text-left font-normal",
										!formData.publishDate && "text-muted-foreground",
									)}
								>
									<span className="w-full flex justify-between items-center">
										{formData.publishDate
											? format(formData.publishDate, "PPP")
											: "Pick a date"}
									</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={formData.publishDate}
									onSelect={(date) =>
										setFormData((prev) => ({
											...prev,
											publishDate: date || new Date(),
										}))
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</div>

					<Combobox
						label="Tags"
						items={metadataTypes.tags}
						value={formData.tags}
						onChange={(value) =>
							setFormData((prev) => ({ ...prev, tags: value as string[] }))
						}
						onAddItem={(item) => handleAddItem("tags", item)}
						placeholder="Select tags..."
						isMulti
					/>

					<Combobox
						label="Journal"
						items={metadataTypes.journals}
						value={formData.journal}
						onChange={(value) =>
							setFormData((prev) => ({ ...prev, journal: value as string }))
						}
						onAddItem={(item) => handleAddItem("journals", item)}
						placeholder="Select journal..."
					/>

					<Combobox
						label="Medium"
						items={metadataTypes.mediums}
						value={formData.medium}
						onChange={(value) =>
							setFormData((prev) => ({ ...prev, medium: value as string }))
						}
						onAddItem={(item) => handleAddItem("mediums", item)}
						placeholder="Select medium..."
					/>
				</form>
			</CardContent>
		</Card>
	);
};

export default MetadataForm;
