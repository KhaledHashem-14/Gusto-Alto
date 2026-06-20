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
  fontFamily:
    lang === "ar"
      ? '"Noto Kufi Arabic", sans-serif'
      : '"Cormorant Garamond", serif',
});

const fontBody = (lang) => ({
  fontFamily:
    lang === "ar"
      ? '"Noto Kufi Arabic", sans-serif'
      : '"Cormorant Garamond", serif',
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
        <div
          className="h-px w-60 mx-auto bg-[#ebbd7f]/60"
          style={{ margin: "10px auto" }}
        />
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
   FOOTER (REDESIGNED)
   ═══════════════════════════════════════════ */
function Footer({ lang }) {
  const isAr = lang === "ar";

  const INFO = {
    address: {
      en: "6th of October City, First District, Fourth Neighbourhood, Al Amal Commercial Center, behind Chef Al Sham Restaurant",
      ar: "٦ أكتوبر، الحي الأول، المجاورة الرابعة، سنتر الأمل التجاري، خلف مطعم شيف الشام",
    },
    mapUrl: "https://www.google.com/maps/place/%D8%AC%D9%88%D8%B3%D8%AA%D9%88+%D8%A7%D9%84%D8%AA%D9%88+-+Gusto+Alto%E2%80%AD/@29.971662,30.9555399,17z/data=!3m1!4b1!4m6!3m5!1s0x14585777557ba751:0x9b21e2c3668dc76d!8m2!3d29.971662!4d30.9555399!16s%2Fg%2F11mzvb39gl?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D",
    phone: "01274444204",
    facebook: "https://facebook.com/gustoalto",
    footerImage: "/images/logo.jpeg",
  };

  return (
    <footer
      className="flex flex-col items-center"
      style={{
        backgroundColor: COLORS.midnight,
        marginTop: "100px",
        paddingTop: "40px",
        paddingLeft: "24px",
        paddingRight: "24px",
        minHeight: "100dvh",
      }}
    >
      {/* ── Logo ── */}
      <p
        className="text-3xl font-bold tracking-widest uppercase"
        style={{ color: COLORS.gold, ...fontDisplay("en") }}
      >
        Gusto Alto
      </p>
      {/* ── Decorative line ── */}
      <div
        className="h-px w-60 bg-[#ebbd7f]/50"
        style={{ margin: "10px auto" }}
      />
      <p
        className="text-xl font-medium tracking-[0.1em] mt-2"
        style={{ color: COLORS.gold, ...fontDisplay("ar"), marginBottom: "25px" }}
      >
        جوستو التو
      </p>

      {/* ── Contact Info ── */}

      {/* Address */}
      <a
        href={INFO.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        style={{ color: "#e8d5b0", padding: "5px" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ minWidth: "16px" }}
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <p className="text-base leading-relaxed opacity-90" style={fontBody(lang)}>
          {INFO.address[lang]}
        </p>
      </a>

      {/* Phone */}
      <a
        href={`tel:${INFO.phone}`}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        style={{ color: "#e8d5b0", padding: "5px" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ minWidth: "16px" }}
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <p className="text-base opacity-90" style={fontBody("en")}>
          {INFO.phone}
        </p>
      </a>

      {/* Facebook */}
      <a
        href={INFO.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        style={{ color: "#e8d5b0", padding: "5px" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ minWidth: "16px" }}
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <p className="text-base opacity-90" style={fontBody("en")}>
          Facebook
        </p>
      </a>

      {/* ── Large Image ── */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          marginTop: "48px",
          marginBottom: "48px",
          maxWidth: "350px",
          width: "100%",
        }}
      >
        <img
          src={INFO.footerImage}
          alt={isAr ? "جوستو التو" : "Gusto Alto"}
          className="w-full h-auto object-cover"
          style={{ borderRadius: "16px" }}
        />
      </div>

      {/* ── Copyright ── */}
      <p
        className="text-xs opacity-60 font-medium uppercase tracking-widest"
        style={{
          color: COLORS.gold,
          ...fontBody(lang),
          marginBottom: "32px",
        }}
      >
        {isAr
          ? "© ٢٠٢٦ جوستو التو — جميع الحقوق محفوظة"
          : "© 2026 Gusto Alto — All Rights Reserved"}
      </p>

      {/* ── Fills remaining space at the bottom ── */}
      <div style={{ flex: 1 }} />
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
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─────────────────────────────────────────
     TAB CLICK — scroll to first item card
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

    scrollTimer.current = setTimeout(() => {
      isScrollingTo.current = false;
    }, 800);
  }, []);

  /* ─────────────────────────────────────────
     RENDER
     - flex-col + min-h-dvh keeps the footer
       at the bottom even with short content
     - Footer's flex:1 + minHeight fills the
       remaining space and provides scroll room
       for the last category (no ugly padding!)
  ───────────────────────────────────────── */
  return (
    <div
      className="mx-auto max-w-md flex flex-col"
      style={{ minHeight: "100dvh", backgroundColor: "#fff9f0ff" }}
    >
      <Header lang={lang} onToggleLang={toggleLang} />

      <CategoryTabs
        categories={menuData.categories}
        activeId={activeCategory}
        lang={lang}
        onSelect={handleTabSelect}
      />

      <main style={{ flex: "0 0 auto" }}>
        {menuData.categories.map((cat) => (
          <div key={cat.id}>
            <MenuSection category={cat} lang={lang} />
          </div>
        ))}
      </main>

      <Footer lang={lang} />
    </div>
  );
}