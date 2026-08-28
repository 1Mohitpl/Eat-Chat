import React, { useMemo, useState } from "react";
import { useReveal } from "../../utils/reveal";

const ACCENT = "#ff6b00";
const NAVY = "#0f172a";

const Svg = ({ d, className = "", strokeWidth = 2 }) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const ICON = {
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6M13 21l4-18",
  design: "M12 19l7-7a2.13 2.13 0 0 0-3-3l-7 7-1 4 4-1Z M5 19l4-1m-3-3 3-3 4 4",
  megaphone: "M3 11l18-5v12L3 13v-2Z M7 14v4a2 2 0 0 0 2 2h.01",
  headset:
    "M3 12a9 9 0 1 1 18 0M21 12a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2 2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-6M3 12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6",
  bolt: "M13 2 3 14h7l-1 8 11-12h-7l1-8Z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  clock: "M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  check: "M20 6 9 17l-5-5",
  sparkles:
    "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3ZM19 15l.9 2.4L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.6L19 15Z",
};

const DEPARTMENTS = [
  { key: "all", label: "All Roles", color: "#0f172a", icon: null },
  { key: "Engineering", label: "Engineering", color: "#2563eb", icon: ICON.code },
  { key: "Design", label: "Design", color: "#7c3aed", icon: ICON.design },
  { key: "Marketing", label: "Marketing", color: "#ea580c", icon: ICON.megaphone },
  { key: "Customer Success", label: "Customer Success", color: "#0d9488", icon: ICON.headset },
];

const JOBS = [
  { title: "Frontend Developer", dept: "Engineering", location: "Remote", type: "Full-time", salary: "₹18–28 LPA", isNew: true, desc: "Build delightful, pixel-perfect food-ordering experiences with React." },
  { title: "Backend Developer", dept: "Engineering", location: "Remote", type: "Full-time", salary: "₹20–32 LPA", desc: "Scale our order pipeline and meal-delivery APIs to millions of users." },
  { title: "Product Designer", dept: "Design", location: "Hybrid", type: "Full-time", salary: "₹16–26 LPA", isNew: true, desc: "Craft intuitive interfaces and design systems that make food feel personal." },
  { title: "Brand Designer", dept: "Design", location: "Remote", type: "Full-time", salary: "₹12–20 LPA", desc: "Own the BeYuumi identity across campaigns, menus, and merch." },
  { title: "Marketing Specialist", dept: "Marketing", location: "Onsite", type: "Full-time", salary: "₹10–16 LPA", desc: "Drive growth campaigns, partnerships, and cuisine-first storytelling." },
  { title: "Growth Manager", dept: "Marketing", location: "Remote", type: "Full-time", salary: "₹14–22 LPA", desc: "Own acquisition loops and restaurant onboarding across new cities." },
  { title: "Customer Success Manager", dept: "Customer Success", location: "Hybrid", type: "Full-time", salary: "₹8–14 LPA", desc: "Be the warm human voice behind 2M+ happy orders every week." },
  { title: "Support Lead", dept: "Customer Success", location: "Onsite", type: "Full-time", salary: "₹12–18 LPA", desc: "Build and lead a delightful support team obsessed with resolution." },
];

/* bento perks — emoji-first like modern careers pages */
const BENTO = [
  {
    big: true,
    emoji: "🍜",
    title: "Free meals, every day",
    text: "Lunch is on us — order anything from the BeYuumi app and eat with the team.",
    color: "#fff7ed",
  },
  { emoji: "💪", title: "Health cover", text: "Full family insurance from day one.", color: "#eff6ff" },
  { emoji: "📚", title: "₹1L learning budget", text: "Courses, books, conferences — your call.", color: "#f5f3ff" },
  { emoji: "🏖️", title: "Flexible PTO", text: "Rest when you need it. We mean it.", color: "#ecfdf5" },
  {
    wide: true,
    emoji: "🚀",
    title: "ESOPs for everyone",
    text: "Every full-time BeYuumian owns a slice of the company we're building together.",
    color: "#fffbeb",
  },
];

const PROCESS = [
  { step: "01", title: "Apply in minutes", text: "One short form — no cover-letter theatre." },
  { step: "02", title: "Friendly chat", text: "30-min call about you, not trick puzzles." },
  { step: "03", title: "Real task", text: "A small paid exercise that mirrors the actual job." },
  { step: "04", title: "Offer & welcome", text: "Decision within 48 hours. Lunch is on us." },
];

const PERKS_TICKER = [
  "🍜 Free meals daily",
  "💪 Full health cover",
  "📚 ₹1L learning budget",
  "🏖️ Flexible PTO",
  "🚀 ESOPs for all",
  "🏠 Remote-friendly",
  "🧠 Hack weeks",
  "🐶 Pet-friendly office",
];

/* ---------- floating food chips ---------- */

const FLOATERS = [
  { emoji: "🍕", cls: "top-[18%] left-[5%]", delay: "0s" },
  { emoji: "🛵", cls: "top-[30%] right-[7%]", delay: "0.9s" },
  { emoji: "🍩", cls: "bottom-[34%] left-[13%] hidden xl:grid", delay: "1.8s" },
  { emoji: "🌮", cls: "bottom-[24%] right-[16%] hidden xl:grid", delay: "2.6s" },
];

const Floater = ({ emoji, cls, delay }) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute hidden h-14 w-14 place-items-center rounded-2xl bg-white/10 text-2xl ring-1 ring-white/15 backdrop-blur animate-float lg:grid ${cls}`}
    style={{ animationDelay: delay }}
  >
    {emoji}
  </span>
);

/* ---------- perks marquee ---------- */

const PerksTicker = () => (
  <div className="relative border-t border-white/10 bg-white/5 py-4 backdrop-blur">
    <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
      {[...PERKS_TICKER, ...PERKS_TICKER].map((p, i) => (
        <span key={i} className="text-sm font-semibold text-slate-200">
          {p}
          <span className="ml-10 text-orange-400">✦</span>
        </span>
      ))}
    </div>
  </div>
);

/* ---------- job card ---------- */

const JobCard = ({ job }) => {
  const dept = DEPARTMENTS.find((d) => d.key === job.dept);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl sm:p-6">
      {/* dept-colored edge glow on hover */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
        style={{ background: dept.color }}
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            style={{ background: dept.color }}
          >
            <Svg d={dept.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display truncate text-lg font-bold leading-tight text-slate-900">
                {job.title}
              </h3>
              {job.isNew && (
                <span
                  className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white animate-bounce-soft"
                  style={{ background: ACCENT }}
                >
                  <Svg d={ICON.sparkles} className="h-3 w-3" /> New
                </span>
              )}
            </div>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{job.desc}</p>
          </div>
        </div>

        <button
          onClick={() => alert(`Applied to ${job.title} — we'll be in touch!`)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
          style={{ background: ACCENT }}
          aria-label={`Apply to ${job.title}`}
        >
          Apply
          <Svg
            d={ICON.arrow}
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
          style={{ backgroundColor: `${dept.color}1a`, color: dept.color }}
        >
          {job.dept}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
          <Svg d={ICON.pin} className="h-3.5 w-3.5" /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
          <Svg d={ICON.clock} className="h-3.5 w-3.5" /> {job.type}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tabular-nums text-emerald-700">
          {job.salary}
        </span>
      </div>
    </div>
  );
};

/* ---------- page ---------- */

const Careers = () => {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return JOBS.filter((j) => {
      const matchDept = dept === "all" || j.dept === dept;
      const matchQuery =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.dept.toLowerCase().includes(q) ||
        j.desc.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q);
      return matchDept && matchQuery;
    });
  }, [query, dept]);

  const setBentoRef = useReveal(BENTO.length);
  const setStepRef = useReveal(PROCESS.length);
  const setRoleRef = useReveal(filtered.length || 1);

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-slate-900">
      {/* ============ HERO ============ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: NAVY,
          backgroundImage:
            "radial-gradient(55% 60% at 82% 12%, rgba(255,107,0,0.3), transparent 60%), radial-gradient(40% 50% at 8% 88%, rgba(124,58,237,0.22), transparent 60%)",
        }}
      >
        {FLOATERS.map((f) => (
          <Floater key={f.emoji} {...f} />
        ))}

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 text-center sm:pt-28">
          <span className="animate-fade-down inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300 backdrop-blur">
            <Svg d={ICON.bolt} className="h-3.5 w-3.5" /> 8 open roles · 5 cities
          </span>
          <h1 className="font-display animate-fade-up mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Do the best work of your life.{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Then eat well.
            </span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Join the food-tech crew making great meals effortless for millions — your work here is
            tasted, shipped, and loved.
          </p>
          <div className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: ACCENT }}
            >
              See open roles
              <Svg d={ICON.arrow} className="h-4 w-4" />
            </button>
            <a
              href="#life"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Life at BeYuumi
            </a>
          </div>
        </div>

        <PerksTicker />
      </section>

      {/* ============ PERKS BENTO ============ */}
      <section id="life" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            Why BeYuumi
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Perks that actually matter
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            No ping-pong-table clichés. The things that make work (and lunch) better every day.
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[minmax(140px,auto)] grid-cols-2 gap-4 lg:grid-cols-4">
          {BENTO.map((b, i) => (
            <div
              key={b.title}
              ref={setBentoRef(i)}
              className={`group relative overflow-hidden rounded-3xl p-6 ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl career-fade ${
                b.big ? "col-span-2 row-span-2" : b.wide ? "col-span-2" : ""
              }`}
              style={{ backgroundColor: b.color }}
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute -bottom-4 -right-2 select-none opacity-80 transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-6 ${
                  b.big ? "text-[110px]" : "text-[64px]"
                }`}
              >
                {b.emoji}
              </span>
              <h3
                className={`font-display relative z-10 font-extrabold tracking-tight text-slate-900 ${
                  b.big ? "text-2xl sm:text-3xl" : "text-lg"
                }`}
              >
                {b.title}
              </h3>
              <p
                className={`relative z-10 mt-2 leading-relaxed text-slate-600 ${
                  b.big ? "max-w-xs text-base" : "text-sm"
                }`}
              >
                {b.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ HIRING PROCESS ============ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
              How hiring works
            </span>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Four steps. Under two weeks.
            </h2>
          </div>

          <ol className="relative mt-14 grid gap-8 lg:grid-cols-4 lg:gap-6">
            {/* connector line (desktop) */}
            <span
              aria-hidden
              className="absolute left-0 right-0 top-7 hidden h-0.5 bg-gradient-to-r from-[#ff6b00]/60 via-slate-200 to-slate-200 lg:block"
            />
            {PROCESS.map((p, i) => (
              <li key={p.step} ref={setStepRef(i)} className="relative career-fade">
                <span
                  className="font-display relative z-10 grid h-14 w-14 place-items-center rounded-2xl text-lg font-extrabold text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT}, #fb923c)`,
                    boxShadow: "0 8px 20px rgba(255,107,0,0.3)",
                  }}
                >
                  {p.step}
                </span>
                <h3 className="font-display mt-4 text-lg font-bold">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ OPEN ROLES ============ */}
      <section id="open-roles" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                Open positions
              </span>
              <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Find your seat at the table
              </h2>
            </div>
            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Svg d={ICON.search} className="h-4 w-4" />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, team, or city…"
                aria-label="Search roles"
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/15"
              />
            </div>
          </div>

          {/* Department filter tabs */}
          <div className="mt-7 flex flex-wrap gap-2">
            {DEPARTMENTS.map((d) => (
              <button
                key={d.key}
                onClick={() => setDept(d.key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                  dept === d.key
                    ? "text-white shadow-md"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
                style={dept === d.key ? { backgroundColor: d.color === "#0f172a" ? NAVY : d.color } : undefined}
              >
                {d.icon && <Svg d={d.icon} className="h-3.5 w-3.5" />}
                {d.label}
              </button>
            ))}
          </div>

          {/* Job cards */}
          <div className="mt-8 space-y-4">
            {filtered.map((job, idx) => (
              <div key={idx} ref={setRoleRef(idx)} className="career-fade">
                <JobCard job={job} />
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="animate-fade-up rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <span
                  className="mx-auto grid h-12 w-12 place-items-center rounded-full text-white"
                  style={{ backgroundColor: NAVY }}
                >
                  <Svg d={ICON.search} className="h-5 w-5" />
                </span>
                <h3 className="font-display mt-4 text-lg font-bold text-slate-900">
                  No roles match that filter
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try clearing your search — or say hi anyway, we keep great people in mind.
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setDept("all");
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
                  style={{ backgroundColor: ACCENT }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ APPLICATION CTA ============ */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12" style={{ backgroundColor: NAVY }}>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 80% at 85% 20%, rgba(255,107,0,0.35), transparent 60%), radial-gradient(40% 70% at 10% 100%, rgba(124,58,237,0.25), transparent 60%)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-4 -top-6 hidden h-36 w-36 place-items-center rounded-3xl bg-white/10 text-6xl ring-1 ring-white/15 backdrop-blur animate-float md:grid"
          >
            🧑‍🍳
          </span>
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Don&apos;t see your role?
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-300">
                We always want to meet great people. Send your resume and we&apos;ll keep you in
                mind for the next big opening.
              </p>
            </div>
            <a
              href="mailto:careers@beyumm.com"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-xl transition-transform hover:scale-105"
              style={{ backgroundColor: ACCENT }}
            >
              <Svg d={ICON.mail} className="h-4 w-4" />
              careers@beyumm.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
