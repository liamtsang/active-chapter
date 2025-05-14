import Image from "next/image";

export const About = () => {
	return (
		<section className="space-y-8 p-4 pb-32">
			<h2 className="text-xl/5 md:text-3xl font-medium">Active Chapter</h2>
			<h3 className="text-sm/5 md:text-base/5 xl:text-lg/7 font-instrument font-medium italic">
				We are a publishing and art collective, and we like you and we love you
				and we need you.
			</h3>
			<div
				id="body-text"
				className="max-w-[65ch] font-instrument text-sm/5 md:text-base/5 xl:text-lg/7 indent-8 space-y-2"
			>
				<p>
					We believe in community through friendship, and knowledge through
					community. We publish words not only in print, but on everyday and
					fine art objects. We hope to proliferate theory, cultural mythologies,
					and the work of emerging/underrepresented writers––areas especially
					important to us as queer artists of color. We want words in your
					kitchen and your bathroom and your car (if you have one) and on your
					body and head and feet (if you have them).
				</p>
				<p>
					Active Chapter was founded in 2024 by artists Eka Savajol, Lucia
					Mumma, Max Chu, and XY Zhou. Our intern is Jojo Savajol. Web design by
					Liam Tsang.
				</p>
				<p>
					Our current project is In the Mood for Love, as a part of What Can We
					Do? artist grant received from Asian American Arts Alliance. We are
					working with people living in Chinatown, New York to collect their
					stories and perspectives themed around love. Stay tuned.
				</p>
				<p>
					Get in touch!{" "}
					<a
						className="underline"
						href="mailto:activechapterpublishing@gmail.com"
						target="_blank"
					>
						activechapterpublishing@gmail.com
					</a>
				</p>
			</div>
			<div>
				<h3 className="pb-2 text-sm/5 md:text-base/5 xl:text-lg/7 font-instrument font-medium italic">
					Markets & Stockists
				</h3>
				<ul className="text-sm/5 md:text-base/5 xl:text-lg/7">
					<li>2025-Present Dreamers Coffee House, New York, NY</li>
					<li>2025-Present Human Relations, Brooklyn, NY</li>
					<li>2025-Present Hive Mind Books, Brooklyn, NY</li>
					<li>2025 Everything Must Go , Rash, Brooklyn, NY</li>
					<li>2024 Trans Art Bazaar, Brooklyn, NY</li>
					<li>2024 Furuba Market, Brooklyn, NY</li>
					<li>2023 am:pm gallery, Brooklyn, NY</li>
				</ul>
			</div>
			<div>
				<h3 className="pb-2 text-sm/5 md:text-base/5 xl:text-lg/7 font-instrument font-medium italic">
					Grants & Awards
				</h3>
				<ul className="text-sm/5 md:text-base/5 xl:text-lg/7">
					<li>
						2025 What Can We Do? Artist Grant, Asian American Arts Alliance
					</li>
				</ul>
			</div>
			<Image
				alt="Photo of active chapter members"
				className="outline outline-black outline-[1px]"
				width={400}
				height={200}
				src="/about.jpeg"
			/>
		</section>
	);
};
