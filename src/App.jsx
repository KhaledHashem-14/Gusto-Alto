import { useState, useEffect, useRef, useCallback } from "react";
import menuData from "./data/menuData.json";

/* ═══════════════════════════════════════════
   BRAND PALETTE
   ═══════════════════════════════════════════ */
const COLORS = {
  midnight: "#0c1330",
  gold: "#ebbd7f",
  espresso: "#4a1a0c",
};

/* ═══════════════════════════════════════════
   FIX 3: Font helpers — instead of relying on
   Tailwind's font-serif/font-sans (which resolve
   to default stacks), use inline style to pull
   the correct CSS variable per language.
   ═══════════════════════════════════════════ */
const fontDisplay = (lang) => ({
  fontFamily: lang === "ar" ? "var(--font-ar)" : "var(--font-en)",
});

const fontBody = (lang) => ({
  fontFamily: lang === "ar" ? "var(--font-ar)" : "var(--font-en)",
});

/* ═══════════════════════════════════════════
   HEADER COMPONENT
   ═══════════════════════════════════════════ */
function Header({ lang, onToggleLang }) {
  const isAr = lang === "ar";

  return (
    <header className="relative pb-12 flex flex-col items-center" style={{ padding: "35px", backgroundColor: COLORS.midnight }}>
      {/* Language Toggle in Corner */}
      <button
        onClick={onToggleLang}
        className="absolute top-0 end-0 transition-colors p-2 flex items-center justify-center z-50"
        aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
      >
        <span className="text-lg font-medium tracking-widest" style={{ padding: "10px", color: COLORS.gold, ...fontBody(lang) }}>
          {isAr ? "EN" : "ع"}
        </span>
      </button>

      {/* Brand Identity */}
      <div className="text-center mt-4">
        <h1
          className="text-3xl font-bold tracking-widest uppercase"
          style={{ color: COLORS.gold, ...fontDisplay("en") }} /* brand name always EN font */
        >
          Gusto Alto
        </h1>
        <div className="mt-6 h-[1px] w-55 mx-auto bg-gold/40" style={{ margin: "5px" }}></div>
        <p
          className="mt-3 text-xl font-medium tracking-[0.1em]"
          style={{ color: COLORS.gold, ...fontDisplay("ar") }} /* Arabic subtitle always AR font */
        >
          جوستو التو
        </p>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════
   CATEGORY TAB BAR
   ═══════════════════════════════════════════ */
function CategoryTabs({ categories, activeId, lang, onSelect }) {
  const scrollRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    if (activeTabRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const tab = activeTabRef.current;
      const scrollLeft =
        tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <nav
      className="sticky top-0 z-40 backdrop-blur-md border-b border-stone-200/50 mx-[-2rem] px-8 mb-12"
      style={{ boxShadow: "0 2px 5px rgba(12,19,48,0.18)" }}
    >
      <div
        ref={scrollRef}
        className="hide-scrollbar flex gap-8 overflow-x-auto"
        role="tablist"
        style={{
          backgroundColor: COLORS.gold,
          padding: "5px",
          boxShadow: "inset 0 0 0 1px rgba(235,189,127,0.18), 0 8px 24px rgba(12,19,48,0.18)",
        }}
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              ref={isActive ? activeTabRef : null}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(cat.id)}
              className="relative shrink-0 text-[14px] uppercase tracking-[0.15em] transition-colors duration-300 pb-2"
              style={{
                color: isActive ? COLORS.midnight : COLORS.espresso,
                fontWeight: isActive ? 700 : 500,
                ...fontBody(lang), /* FIX 3 applied */
              }}
            >
              {cat.name[lang]}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                  style={{ backgroundColor: COLORS.midnight }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   MENU ITEM CARD
   ═══════════════════════════════════════════ */
function MenuItem({ item, lang, index }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isAr = lang === "ar";

  return (
    <div style={{ padding: "3px 10px" }}>
      <article
        className="animate-fade-in-up flex gap-6 py-7 border-b border-stone-100 last:border-b-0"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {/* Image Container */}
        <div className="relative w-28 h-28 shrink-0 overflow-hidden rounded-2xl bg-stone-50 border border-stone-200/60">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-shimmer bg-stone-100" />
          )}
          <img
            src={item.imageUrl}
            alt={item.name[lang]}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-700 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center min-w-0 py-2">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3
                  className="font-bold text-xl leading-tight tracking-wide text-[#0c1330]"
                  style={fontDisplay(lang)} /* FIX 3 applied */
                >
                  {item.name[lang]}
                </h3>
                {item.popular && (
                  <span
                    className="px-1.5 py-[1px] border text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
                    style={{
                      borderColor: COLORS.gold,
                      color: COLORS.gold,
                      borderRadius: "6px",
                      ...fontBody(lang),
                    }}
                  >
                    {isAr ? "مميز" : "Popular"}
                  </span>
                )}
              </div>
              <p
                className="mt-2 text-stone-500 font-normal text-sm leading-relaxed max-w-[95%]"
                style={fontBody(lang)} /* FIX 3 applied */
              >
                {item.description[lang]}
              </p>
            </div>
            <p
              className="font-bold text-lg shrink-0 text-[#4a1a0c] pt-1 min-w-[75px] text-right"
              style={fontBody(lang)}
            >
              {item.price}{" "}
              <span className="text-[10px] font-semibold opacity-50 uppercase tracking-widest block text-end mt-0.5">
                {isAr ? "جنيه" : "EGP"}
              </span>
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MENU SECTION
   ═══════════════════════════════════════════ */
function MenuSection({ category, lang }) {
  return (
    <section
      id={`section-${category.id}`}
      aria-labelledby={`heading-${category.id}`}
      className="mb-20 scroll-mt-28"
    >
      <h2
        id={`heading-${category.id}`}
        className="text-sm font-bold tracking-[0.25em] uppercase mb-8 opacity-80 text-[#0c1330]"
        style={{ padding: "5px", ...fontDisplay(lang) }} /* FIX 3 applied */
      >
        {category.name[lang]}
      </h2>
      <div className="flex flex-col">
        {category.items.map((item, idx) => (
          <MenuItem key={item.id} item={item} lang={lang} index={idx} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
function Footer({ lang }) {
  const isAr = lang === "ar";
  return (
    <footer className="pb-12 pt-12 text-center border-t border-stone-200/60 mt-10">
      <p
        className="text-base font-bold tracking-[0.2em] uppercase text-[#0c1330]"
        style={fontDisplay("en")} /* brand name always EN font */
      >
        Gusto Alto
      </p>
      <p className="mt-3 text-xs text-stone-400 font-medium uppercase tracking-widest" style={fontBody(lang)}>
        {isAr
          ? "© ٢٠٢٦ جميع الحقوق محفوظة"
          : "© 2026 All Rights Reserved"}
      </p>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════ */
export default function App() {
  const [lang, setLang] = useState("ar");
  const [activeCategory, setActiveCategory] = useState(
    menuData.categories[0].id,
  );

  const isAr = lang === "ar";

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  useEffect(() => {
    const sections = menuData.categories.map((cat) =>
      document.getElementById(`section-${cat.id}`),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const id = visible[0].target.id.replace("section-", "");
          setActiveCategory(id);
        }
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: [0, 0.2, 0.5, 0.8],
      },
    );

    sections.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleTabSelect = useCallback((catId) => {
    setActiveCategory(catId);
    const el = document.getElementById(`section-${catId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? "rtl" : "ltr";
  }, [lang, isAr]);

  return (
    <div className="mx-auto max-w-md min-h-dvh px-8 py-12" style={{ backgroundColor: "#fff9f0ff" }}>
      <Header lang={lang} onToggleLang={toggleLang} />

      <CategoryTabs
        categories={menuData.categories}
        activeId={activeCategory}
        lang={lang}
        onSelect={handleTabSelect}
      />

      <main>
        {menuData.categories.map((cat) => (
          <MenuSection key={cat.id} category={cat} lang={lang} />
        ))}
      </main>

      <Footer lang={lang} />
    </div>
  );
}