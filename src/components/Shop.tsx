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

const itmflimages = [
  { src: "/itmfl_product1.png", alt: "Cover" },
  { src: "/itmfl_product2.png", alt: "Spread 1" },
  { src: "/itmfl_product3.png", alt: "Spread 2" },
];

const calendarimages = [
  { src: "/calendar1.webp", alt: "Cover" },
  { src: "/calendar2.webp", alt: "Spread 1" },
  { src: "/calendar3.webp", alt: "Spread 2" },
];

const edition1images = [
  { src: "/edition1-1.webp", alt: "Cover" },
  { src: "/edition1-2.webp", alt: "Spread 1" },
  { src: "/edition1-3.webp", alt: "Spread 2" },
  { src: "/edition1-4.webp", alt: "Spread 2" },
];

export const Shop = () => {
  return (
    <section className="max-w-[65ch] mx-auto space-y-12">
      <ShopItem
        props={{
          title: "Edition 1: Perverts",
          description:
            "Peeking through your window, rotting in a bedroom teeming with clutter, rubbing each other by the pier, undressing onstage, watching mukbangs under the covers, hanging out your back pocket—perverts are all around us. Perverts are among us. Perverts are us. We are obsessive, maladjusted, hungry. <br><br> But who gets called a pervert? How has this term been used to other and criminalize people? How can we reclaim it? Or should we reclaim it? What are the ethics of perversion? <br><br> In our second journal, Edition 1: Perverts, we bring together a collection of essays, poems, short fiction, drama, and visual art that grapple with what perversion is, and through the lens of two characters, Libertine and Receiver, explore what it means to be a pervert.",
          items: edition1images,
          cta: "Buy Now",
          priceDollars: "20",
          priceCents: "00",
          url: "https://activechapter.bigcartel.com/product/edition-1-perverts",
        }}
      />
      <ShopItem
        props={{
          title: "When A Spotted Horse Is Not A Horse",
          description:
            "Set in a fictional medieval kingdom, stable-boy Salt Lick and horse doctor Remedy use magic to become Princess Lenora’s noble steed in a monumental joust against their fearsome rival, Seth. Things quickly become more complicated than they seem when they encounter the sweet young Hopscotch, Seth’s unwilling steed.",
          items: calendarimages,
          cta: "Buy Now",
          priceDollars: "25",
          priceCents: "00",
          url: "https://activechapter.bigcartel.com/product/2026-calendar-when-a-spotted-horse-is-not-a-horse",
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
      <ShopItem
        props={{
          title:
            "In the Mood For Love: an anthology of love stories from Chinatown",
          description:
            "<i>In the Mood for Love</i> is a collection of art and writing about love by elders and teens in Chinatown. Through weekly workshops led by members of Active Chapter, elders and teens shared their feelings about friendship, romance, and family through collage, drawing, writing, and oral stories.",
          items: itmflimages,
          cta: "Buy Now",
          soldOut: true,
          priceDollars: "12",
          priceCents: "00",
          url: "https://activechapter.bigcartel.com/product/in-the-mood-for-love-an-anthology-of-love-stories-from-chinatown",
        }}
      />
      <ShopItem
        props={{
          title: "Edition 0",
          description:
            "Our beloved Edition 0! We gathered these pieces from our friends, former lovers, and childhood best friends. We wanted, not only to gather their thoughts on love, but to gather our loved ones together, to see their passions materialized, congealed, brought together in the union of a collective.",
          items: edition0images,
          cta: "Buy Now",
          soldOut: true,
          priceDollars: "17",
          priceCents: "50",
          url: "https://activechapter.bigcartel.com/product/edition-0-confessions-of-love",
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
