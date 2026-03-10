"use client";

import { usePathname, useRouter } from "next/navigation";

const locales = [
    { code: "en", label: "EN" },
    { code: "am", label: "አማ" },
];

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();

    // Derive the current locale from the first path segment
    const segments = pathname.split("/");
    const currentLocale = segments[1] === "am" ? "am" : "en";

    const switchLocale = (targetLocale: string) => {
        if (targetLocale === currentLocale) return;
        // Replace the locale segment (index 1) with the new locale
        segments[1] = targetLocale;
        router.push(segments.join("/"));
    };

    return (
        <div className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/60 p-1">
            {locales.map(({ code, label }) => (
                <button
                    key={code}
                    onClick={() => switchLocale(code)}
                    className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${currentLocale === code
                            ? "bg-violet-600 text-white shadow shadow-violet-500/30"
                            : "text-neutral-400 hover:text-white"
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
