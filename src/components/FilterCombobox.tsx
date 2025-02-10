import { Popover, PopoverContent } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import React from "react";
import { cn } from "@/lib/utils";

interface Item {
	label: string;
	value: string;
}

interface ComboboxProps {
	items: Item[];
	value: string | string[];
	onChange: (value: string | string[]) => void;
	onAddItem?: (item: Item) => void;
	placeholder: string;
	label: string;
	color: string;
	isMulti?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({
	items,
	value,
	onChange,
	onAddItem,
	placeholder,
	label,
	color,
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

	const displayValue = React.useMemo(() => {
		if (isMulti) {
			const selectedCount = Array.isArray(value) ? value.length : 0;
			return selectedCount > 0 ? `${selectedCount} selected` : placeholder;
		}
		return items.find((item) => item.value === value)?.label || placeholder;
	}, [isMulti, value, items, placeholder]);

	return (
		<div className="h-full space-y-2 flex items-center px-2">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						type="button"
						aria-expanded={open}
						className="text-xl pl-3 pr-4 py-1 w-max justify-between ring-black ring-1 rounded-full flex flex-row items-center"
					>
						<div
							className="mr-2 rounded-full min-w-[0.5ch] min-h-[0.5ch] max-w-[0.5ch] max-h-[0.5ch]"
							style={{ backgroundColor: color }}
						/>
						{displayValue}
					</button>
				</PopoverTrigger>
				<PopoverContent className="z-[5] bg-white font-instrument text-base w-full p-0 ring-1 ring-black">
					<div className="flex flex-col">
						<div className="flex items-center gap-2 p-2 border-b border-black">
							<Input
								placeholder={`Search ${label.toLowerCase()}...`}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="border-0"
							/>
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
											"flex cursor-pointer items-center justify-between px-2 py-2 hover:bg-[rgb(255,255,0)]",
											(isMulti &&
												Array.isArray(value) &&
												value.includes(item.value)) ||
												(!isMulti && value === item.value)
												? "bg-[rgb(255,255,0)]"
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

export default Combobox;
