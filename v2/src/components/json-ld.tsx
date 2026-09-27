/**
 * Renders schema.org structured data as a JSON-LD script tag.
 *
 * `<` is escaped so no string in the data can close the script element early.
 * The data here is our own constants, but the escape costs nothing and makes
 * the component safe to reuse for anything.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
