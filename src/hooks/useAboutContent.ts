import useSWR from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch about content');
  }
  const data = await response.json() as { content: string };
  return data.content;
};

export function useAboutContent() {
  const { data, error, isLoading, mutate } = useSWR('/api/about', fetcher, {
    // Cache for 5 minutes on client side
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    // Keep cached data while revalidating
    keepPreviousData: true,
    // Fallback content while loading
    fallbackData: `<section class="space-y-8 p-4 pb-32">
      <h2 class="text-xl/5 md:text-3xl font-medium">Active Chapter</h2>
      <h3 class="text-sm/5 md:text-base/5 xl:text-lg/7 font-instrument font-medium italic">
        We are a publishing and art collective, and we like you and we love you
        and we need you.
      </h3>
      <div
        id="body-text"
        class="max-w-[65ch] font-instrument text-sm/5 md:text-base/5 xl:text-lg/7 indent-8 space-y-2"
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
            class="underline"
            href="mailto:activechapterpublishing@gmail.com"
            target="_blank"
          >
            activechapterpublishing@gmail.com
          </a>
        </p>
      </div>
      <div>
        <h3 class="pb-2 text-sm/5 md:text-base/5 xl:text-lg/7 font-instrument font-medium italic">
          Markets & Stockists
        </h3>
        <ul class="text-sm/5 md:text-base/5 xl:text-lg/7">
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
        <h3 class="pb-2 text-sm/5 md:text-base/5 xl:text-lg/7 font-instrument font-medium italic">
          Grants & Awards
        </h3>
        <ul class="text-sm/5 md:text-base/5 xl:text-lg/7">
          <li>
            2025 What Can We Do? Artist Grant, Asian American Arts Alliance
          </li>
        </ul>
      </div>
      <img
        alt="Photo of active chapter members"
        class="outline outline-black outline-[1px]"
        width="400"
        height="200"
        src="/about.jpeg"
        loading="lazy"
        decoding="async"
      />
    </section>`,
  });

  return {
    content: data,
    isLoading,
    error,
    mutate, // For manual cache invalidation
  };
}