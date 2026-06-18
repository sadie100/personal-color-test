import { translations } from "../i18n/translations";
import type { Lang } from "../types";

interface FooterProps {
  lang: Lang;
}

export const Footer = ({ lang }: FooterProps) => {
  const t = translations[lang].footer;

  return (
    <footer className="border-t border-hairline py-8 text-xs text-ink-3">
      <div className="page-container space-y-2 px-4">
        <p>{t.disclaimer}</p>
        <p>{t.privacy}</p>
        <p>{t.theory}</p>
        <p>
          {t.contact.label}:{" "}
          <a
            href={`mailto:${t.contact.email}`}
            className="underline hover:text-ink-2"
          >
            {t.contact.email}
          </a>
        </p>
        <p>{t.copyright}</p>
      </div>
    </footer>
  );
};
