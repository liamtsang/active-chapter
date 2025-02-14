export const NumberBadge = ({ number }: { number: string }) => {
	return (
		<div
			className={`bg-white absolute ${number === "1" ? "right-[-1px]" : "right-0"} bottom-[-1px] w-[24px] min-w-[24px] h-[24px] min-h-[24px] border border-black border-[1px]`}
		>
			<div className="bg-white translate-y-[-1px] translate-x-[-1px] flex items-center justify-center w-[24px] min-w-[24px] h-[24px] min-h-[24px] rounded-full border border-black border-[1px]">
				<span className="text-xl font-base" suppressHydrationWarning>
					{number}
				</span>
			</div>
		</div>
	);
};
