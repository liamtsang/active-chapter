import { ShopItem } from "./ShopItem";

const edition0images = [
	{ src: "/coverPhoto.jpg", alt: "Cover" },
	{ src: "/tableOfContents.jpg", alt: "Table of contents" },
	{ src: "/spread1.jpg", alt: "Spread 1" },
	{ src: "/spread2.jpg", alt: "Spread 2" },
];

const top01images = [
	{ src: "/TOP01-01.png", alt: "Cover" },
	{ src: "/TOP01-02.png", alt: "Poster 1" },
	{ src: "/TOP01-03.png", alt: "POster 2" },
];

export const Shop = () => {
	return (
		<section className="max-w-[65ch] mx-auto space-y-12">
			<ShopItem
				props={{
					title: "Edition 0",
					description:
						"Our beloved Edition 0! We gathered these pieces from our friends, former lovers, and childhood best friends. We wanted, not only to gather their thoughts on love, but to gather our loved ones together, to see their passions materialized, congealed, brought together in the union of a collective.",
					items: edition0images,
					cta: "Buy Now",
					priceDollars: "17",
					priceCents: "50",
					url: "https://activechapter.bigcartel.com/product/edition-0-confessions-of-love",
				}}
			/>
			<ShopItem
				props={{
					title: "[Trans Opinions Periodically]",
					description:
						"TOP is a pamphlet for and by trans/nonbinary people, for us to share our troubles, fears, loves, hopelessness, despairs and to respond to trans-related news. (accepting submissions)",
					items: top01images,
					cta: "Donate / Download",
					priceDollars: "5",
					priceCents: "00",
					url: "https://activechapter.bigcartel.com/product/top-zine-edition-1-free",
				}}
			/>
		</section>
	);
};

// <a
// 	className="outline outline-[1px] outline-black block bg-[#FFFF00] py-2 px-4 max-w-fit"
// 	href="https://activechapter.bigcartel.com/product/edition-0-confessions-of-love"
// 	target="_blank"
// 	rel="noreferrer"
// >
// 	Buy Now
// </a>

export default Shop;
