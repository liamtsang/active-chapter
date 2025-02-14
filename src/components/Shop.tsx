import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
	{ src: "/coverPhoto.jpg", alt: "Cover" },
	{ src: "/tableOfContents.jpg", alt: "Table of contents" },
	{ src: "/spread1.jpg", alt: "Spread 1" },
	{ src: "/spread2.jpg", alt: "Spread 2" },
];

export const Shop = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeout(() => {
				setCurrentIndex((prev) => (prev + 1) % images.length);
			}, 500); // Match this with CSS transition duration
		}, 3000); // Change image every 3 seconds

		return () => clearInterval(timer);
	}, []);

	return (
		<>
			<div className="relative w-full border-b-[1px] border-black pb-[100%]">
				{images.map((image, index) => (
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
							className="object-cover"
							sizes="100vw"
							priority={index === 0}
						/>
					</div>
				))}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
					{images.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`w-2 h-2 rounded-full transition-colors ${
								index === currentIndex ? "bg-[#FFFF00]" : "bg-white/50"
							}`}
						/>
					))}
				</div>
				<div className="outline outline-[1px] outline-black absolute font-semibold gap-1 pt-1 px-1 text-[#FF0000] bg-[#FFFF00] flex flex-row right-0 bottom-0">
					<div className="text-4xl">17</div>
					<div className="">50</div>
				</div>
			</div>
			<div className="p-4 space-y-4">
				<h2 className="text-xl/5 md:text-3xl font-medium text-balance">
					Edition 0: Confessions of Love
				</h2>
				<p
					id="body-text"
					className="font-instrument text-sm/5 md:text-base/5 xl:text-lg/7 indent-0 space-y-2"
				>
					Our beloved Edition 0! We gathered these pieces from our friends,
					former lovers, and childhood best friends. We wanted, not only to
					gather their thoughts on love, but to gather our loved ones together,
					to see their passions materialized, congealed, brought together in the
					union of a collective.
				</p>
				<a
					className="outline outline-[1px] outline-black block bg-[#FFFF00] py-2 px-4 max-w-fit"
					href="https://activechapter.bigcartel.com/product/edition-0-confessions-of-love"
					target="_blank"
					rel="noreferrer"
				>
					Buy Now
				</a>
			</div>
		</>
	);
};

export default Shop;
