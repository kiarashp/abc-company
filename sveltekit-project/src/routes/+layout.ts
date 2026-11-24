// Prerender = build every page into a ready HTML file at build time.
// Pages then load instantly and the server does almost no work.
// (The contact form's /api/send-mail still runs live; it is not a page.)
export const prerender = true;
