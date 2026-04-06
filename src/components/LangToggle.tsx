import { useEffect, useRef, useState } from "react";

import type { Lang } from "../types";

interface LangToggleProps {
  lang: Lang;
  onToggle: (value: Lang) => void;
}

const options: ReadonlyArray<{ value: Lang; label: string }> = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
];

export const LangToggle = ({ lang, onToggle }: LangToggleProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const defaultOption = options[0]!;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target;

      if (ref.current && targetNode instanceof Node && !ref.current.contains(targetNode)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = options.find((option) => option.value === lang) ?? defaultOption;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 rounded-full border border-white/50 bg-white/90 py-2.5 pr-3 pl-4 text-sm font-semibold text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white active:scale-95"
      >
        <svg
          className="h-4 w-4 shrink-0 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M3.6 9h16.8M3.6 15h16.8"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M12 3c-2.4 3-3.8 5.8-3.8 9s1.4 6 3.8 9M12 3c2.4 3 3.8 5.8 3.8 9s-1.4 6-3.8 9"
          />
        </svg>
        {current.label}
        <svg
          className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 min-w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onToggle(option.value);
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-gray-50 ${lang === option.value ? "bg-purple-50/60 text-purple-600" : "text-gray-700"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
