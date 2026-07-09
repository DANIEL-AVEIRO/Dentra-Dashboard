import client from "@/api/client";

const MAX_PAGES = 500;

/**
 * Fetch all rows matching current list filters (search, date, date_from, date_to, etc.).
 * Follows DRF pagination until no next page.
 */
export async function fetchAllFilteredRows(endpoint, listParams = {}) {
  const all = [];
  let nextUrl = `/${endpoint.replace(/^\//, "")}/`;
  let queryParams = { ...listParams, page_size: 500 };
  let useQueryParams = true;
  let pages = 0;

  while (nextUrl && pages < MAX_PAGES) {
    const { data } = useQueryParams
      ? await client.get(nextUrl, { params: queryParams })
      : await client.get(nextUrl);

    const batch = Array.isArray(data.results)
      ? data.results
      : Array.isArray(data)
        ? data
        : [];

    all.push(...batch);
    pages += 1;

    const next = data.next;
    if (!next) break;

    nextUrl = next;
    useQueryParams = false;
  }

  return all;
}
