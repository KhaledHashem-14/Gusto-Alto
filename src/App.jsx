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

const fontDisplay = (lang) => ({
  fontFamily: lang === "ar" ? '"Noto Kufi Arabic", sans-serif' : '"Cormorant Garamond", serif',
});

const fontBody = (lang) => ({
  fontFamily: lang === "ar" ? '"Noto Kufi Arabic", sans-serif' : '"Cormorant Garamond", serif',
});

/* ═══════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════ */
function Header({ lang, onToggleLang }) {
  const isAr = lang === "ar";
  return (
    <header
      className="relative flex flex-col items-center"
      style={{ padding: "35px", backgroundColor: COLORS.midnight }}
    >
      <button
        onClick={onToggleLang}
        className="absolute top-0 end-0 transition-colors p-2 flex items-center justify-center z-50"
        aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
      >
        <span
          className="text-lg font-medium tracking-widest"
          style={{ padding: "10px", color: COLORS.gold, ...fontBody(lang) }}
        >
          {isAr ? "EN" : "ع"}
        </span>
      </button>

      <div className="text-center mt-4">
        <h1
          className="text-3xl font-bold tracking-widest uppercase"
          style={{ color: COLORS.gold, ...fontDisplay("en") }}
        >
          Gusto Alto
        </h1>
        <div className="h-px w-12 mx-auto bg-[#ebbd7f]/60" style={{ margin: "10px auto" }} />
        <p
          className="text-xl font-medium tracking-[0.1em]"
          style={{ color: COLORS.gold, ...fontDisplay("ar") }}
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

  const centerActiveTab = useCallback(() => {
    if (activeTabRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const tab = activeTabRef.current;
      const scrollLeft =
        tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  // Center active tab whenever it changes (scroll-driven or click-driven)
  useEffect(() => {
    setTimeout(centerActiveTab, 50);
  }, [activeId, centerActiveTab]);

  const handleSelect = useCallback(
    (catId) => {
      onSelect(catId);
      setTimeout(centerActiveTab, 50);
    },
    [onSelect, centerActiveTab]
  );

  return (
    <nav
      className="sticky top-0 z-40 mx-[-2rem]"
      style={{ boxShadow: "0 2px 5px rgba(12,19,48,0.18)" }}
    >
      <div
        ref={scrollRef}
        className="hide-scrollbar flex gap-8 overflow-x-auto"
        role="tablist"
        style={{
          backgroundColor: COLORS.gold,
          padding: "10px 16px",
          boxShadow:
            "inset 0 0 0 1px rgba(235,189,127,0.18), 0 8px 24px rgba(12,19,48,0.18)",
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
              onClick={() => handleSelect(cat.id)}
              className="relative shrink-0 text-[14px] uppercase tracking-[0.15em] transition-colors duration-200 pb-2 whitespace-nowrap"
              style={{
                color: isActive ? COLORS.midnight : COLORS.espresso,
                fontWeight: isActive ? 700 : 500,
                ...fontBody(lang),
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
        <div className="relative w-28 h-28 shrink-0 overflow-hidden rounded-2xl bg-stone-50 border border-stone-200/60">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-shimmer bg-stone-100" />
          )}
          <img
            src={item.imageUrl}
            alt={item.name[lang]}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-700 ${imgLoaded ? "opacity-100" : "opacity-0"
              }`}
          />
        </div>

        <div className="flex flex-1 flex-col justify-center min-w-0 py-2">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3
                  className="font-bold text-xl leading-tight tracking-wide text-[#0c1330]"
                  style={fontDisplay(lang)}
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
                style={fontBody(lang)}
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
    >
      <h2
        id={`heading-${category.id}`}
        className="text-sm font-bold tracking-[0.25em] uppercase opacity-80 text-[#0c1330]"
        style={{ padding: "32px 5px 24px", ...fontDisplay(lang) }}
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
    <footer className="pt-12 pb-12 text-center border-t border-stone-200/60">
      <p
        className="text-base font-bold tracking-[0.2em] uppercase text-[#0c1330]"
        style={fontDisplay("en")}
      >
        Gusto Alto
      </p>
      <p
        className="mt-3 text-xs text-stone-400 font-medium uppercase tracking-widest"
        style={fontBody(lang)}
      >
        {isAr ? "© ٢٠٢٦ جميع الحقوق محفوظة" : "© 2026 All Rights Reserved"}
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
    menuData.categories[0].id
  );
  const isScrollingTo = useRef(false);
  const scrollTimer = useRef(null);

  const isAr = lang === "ar";

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? "rtl" : "ltr";
  }, [lang, isAr]);

  /* ─────────────────────────────────────────
     SCROLLSPY
     On every scroll event, find the last
     category heading whose top has passed
     the bottom edge of the sticky navbar.
  ───────────────────────────────────────── */
  useEffect(() => {
    const NAV_HEIGHT = 48;

    const onScroll = () => {
      if (isScrollingTo.current) return;

      let currentId = menuData.categories[0].id;

      for (const cat of menuData.categories) {
        const el = document.getElementById(`heading-${cat.id}`);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= NAV_HEIGHT + 1) {
          currentId = cat.id;
        }
      }

      setActiveCategory(currentId);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set correct state on mount

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─────────────────────────────────────────
     TAB CLICK — scroll to first item card
     Suppresses scrollspy during animation
     so the active tab doesn't flicker.
  ───────────────────────────────────────── */
  const handleTabSelect = useCallback((catId) => {
    setActiveCategory(catId);

    const section = document.getElementById(`section-${catId}`);
    if (!section) return;

    const firstItem = section.querySelector("article");
    const target = firstItem || section;
    const NAV_HEIGHT = 48;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 8;

    isScrollingTo.current = true;
    clearTimeout(scrollTimer.current);
    window.scrollTo({ top: targetTop, behavior: "smooth" });

    // Re-enable scrollspy after smooth scroll settles
    scrollTimer.current = setTimeout(() => {
      isScrollingTo.current = false;
    }, 800);
  }, []);

  /* ─────────────────────────────────────────
     LAST CATEGORY PADDING
     Pads the last category so its heading
     can scroll all the way to the top.
  ───────────────────────────────────────── */
  const lastCategoryPadding = "calc(100dvh - 48px)";

  return (
    <div
      className="mx-auto max-w-md min-h-dvh px-8"
      style={{ backgroundColor: "#fff9f0ff" }}
    >
      <Header lang={lang} onToggleLang={toggleLang} />

      <CategoryTabs
        categories={menuData.categories}
        activeId={activeCategory}
        lang={lang}
        onSelect={handleTabSelect}
      />

      <main>
        {menuData.categories.map((cat, idx) => {
          const isLast = idx === menuData.categories.length - 1;
          return (
            <div
              key={cat.id}
              style={isLast ? { paddingBottom: lastCategoryPadding } : undefined}
            >
              <MenuSection category={cat} lang={lang} />
            </div>
          );
        })}
      </main>

      <Footer lang={lang} />
    </div>
  );
}