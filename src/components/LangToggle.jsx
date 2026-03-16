import { useState, useRef, useEffect } from "react";

const options = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
];

export const LangToggle = ({ lang, onToggle }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = options.find((o) => o.value === lang);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-semibold pl-4 pr-3 py-2.5 rounded-full shadow-lg border border-white/50 hover:bg-white transition-all active:scale-95"
      >
        <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.6 9h16.8M3.6 15h16.8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3c-2.4 3-3.8 5.8-3.8 9s1.4 6 3.8 9M12 3c2.4 3 3.8 5.8 3.8 9s-1.4 6-3.8 9" />
        </svg>
        {current.label}
        <svg
          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-full">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onToggle(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50
                ${lang === opt.value ? "text-purple-600 bg-purple-50/60" : "text-gray-700"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
