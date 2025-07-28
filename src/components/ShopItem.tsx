import { useEffect, useState } from "react";
import Image from "next/image";

type ShopItem = {
	src: string;
	alt: string;
};

type ShopItemProps = {
	props: {
		items: ShopItem[];
		priceDollars: string;
		priceCents: string;
		title: string;
		description: string;
		cta: string;
		url: string;
	};
};

export const ShopItem = (props: ShopItemProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeout(() => {
				setCurrentIndex((prev) => (prev + 1) % props.props.items.length);
			}, 500); // Match this with CSS transition duration
		}, 3000); // Change image every 3 seconds

		return () => clearInterval(timer);
	}, []);

	return (
		<div>
			<div className="relative w-full outline outline-black outline-[1px] border-black pb-[100%]">
				{props.props.items.map((image, index) => (
					<div
						key={index}
						className={`absolute inset-0 transition-opacity duration-500 ${
							currentIndex === index
								? "opacity-100"
								: "opacity-0 pointer-events-none"
						}`}
					>
						<Image
							src={image.src}
							alt={image.alt}
							fill
							className="object-contain"
							sizes="100vw"
							priority={index === 0}
						/>
					</div>
				))}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
					{props.props.items.map((_, index) => (
						<button
							type="button"
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`w-2 h-2 rounded-full transition-colors ${
								index === currentIndex ? "bg-[#FFFF00]" : "bg-white/50"
							}`}
						/>
					))}
				</div>
				<div className="outline outline-[1px] outline-black absolute font-semibold gap-1 pt-1 px-1 text-[#FF0000] bg-[#FFFF00] flex flex-row right-0 bottom-0">
					<div className="text-4xl">{props.props.priceDollars}</div>
					<div className="">{props.props.priceCents}</div>
				</div>
			</div>
			<div className="p-4 pt-8 space-y-4">
				<h2 className="text-xl/5 md:text-3xl font-medium text-balance">
					{props.props.title}
				</h2>
				<p
					id="body-text"
					className="font-instrument text-sm/5 md:text-base/5 xl:text-lg/7 indent-0 space-y-2"
					dangerouslySetInnerHTML={{ __html: props.props.description }}
				></p>
				<a
					className="outline outline-[1px] outline-black block bg-[#FFFF00] py-2 px-4 max-w-fit"
					href={props.props.url}
					target="_blank"
					rel="noreferrer"
				>
					{props.props.cta}
				</a>
			</div>
		</div>
	);
};

export default ShopItem;
