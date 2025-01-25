"use client";

import { createContext, useContext, useState } from "react";

type ColumnId = "column1" | "column2" | "column3" | "column4";

interface ColumnState {
	column1: boolean;
	column2: boolean;
	column3: boolean;
	column4: boolean;
}

interface ColumnContextType {
	columns: ColumnState;
	toggleColumn: (columnId: ColumnId) => void;
}

const ColumnStateContext = createContext<ColumnContextType>({
	columns: {
		column1: false,
		column2: false,
		column3: false,
		column4: false,
	},
	toggleColumn: () => {},
});

export function ColumnStateProvider({
	children,
}: { children: React.ReactNode }) {
	const [columns, setColumns] = useState<ColumnState>({
		column1: false,
		column2: false,
		column3: false,
		column4: false,
	});

	const toggleColumn = (columnId: ColumnId) => {
		setColumns((prev) => ({
			...prev,
			[columnId]: !prev[columnId],
		}));
	};

	return (
		<ColumnStateContext.Provider value={{ columns, toggleColumn }}>
			{children}
		</ColumnStateContext.Provider>
	);
}

export function useColumnState() {
	const context = useContext(ColumnStateContext);
	if (!context) {
		throw new Error("useColumnState must be used within a ColumnStateProvider");
	}
	return context;
}
