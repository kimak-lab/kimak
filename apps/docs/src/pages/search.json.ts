import type { APIRoute } from "astro";
import { getCollection, render } from "astro:content";
import { flattenNav } from "../lib/nav";
import type { SearchEntry } from "../lib/search";

/** Static docs index, built from the content collection. Fetched lazily by the search dialog. */
export const GET: APIRoute = async () => {
  const order = flattenNav().map((item) => item.href);
  const docs = await getCollection("docs");
  const entries: SearchEntry[] = await Promise.all(
    docs.map(async (entry) => {
      const { headings } = await render(entry);
      return {
        href: `/docs/${entry.id}`,
        title: entry.data.title,
        section: entry.data.section,
        description: entry.data.description,
        headings: headings
          .filter((heading) => heading.depth === 2 || heading.depth === 3)
          .map((heading) => ({ text: heading.text, slug: heading.slug })),
      };
    }),
  );
  const rank = (href: string) => {
    const index = order.indexOf(href);
    return index < 0 ? order.length : index;
  };
  entries.sort((a, b) => rank(a.href) - rank(b.href));
  return new Response(JSON.stringify(entries), {
    headers: { "Content-Type": "application/json" },
  });
};
