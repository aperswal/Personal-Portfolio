import {
  coverLetterParagraphs,
  coverLetterClosing,
  coverLetterPostscript,
} from "@/data/cover-letter";

export function CoverLetterContent() {
  return (
    <article className="p-lg font-display text-lg leading-[1.85] text-deep-brown md:p-xl md:text-xl">
      {coverLetterParagraphs.map((text, i) => (
        <p key={i} className={i === 0 ? undefined : "mt-lg"}>
          {text}
        </p>
      ))}

      <p className="mt-xl whitespace-pre-line">{coverLetterClosing}</p>

      <p className="mt-xl text-sm italic text-warm-gray">{coverLetterPostscript}</p>
    </article>
  );
}
