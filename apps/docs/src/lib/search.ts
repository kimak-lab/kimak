/** Shape of `/search.json`, the static docs index used by the search dialog. */

export interface SearchHeading {
  text: string;
  slug: string;
}

export interface SearchEntry {
  href: string;
  title: string;
  section: string;
  description: string;
  headings: SearchHeading[];
}
