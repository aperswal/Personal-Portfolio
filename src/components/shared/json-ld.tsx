interface JsonLdSchema {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

interface JsonLdProps {
  data: JsonLdSchema;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
