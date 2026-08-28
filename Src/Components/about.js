import { Link, Outlet } from "react-router-dom";
import { useReveal } from "../../utils/reveal";
import aboutimg from "../imgs/about.jpg";

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
  bolt: "M13 2 3 14h7l-1 8 11-12h-7l1-8Z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  check: "M20 6 9 17l-5-5",
  users:
    "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  heart:
    "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.05 3 5.5l7 7Z",
  leaf: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10ZM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
  star: "m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z",
};

const STATS = [
  { value: "2M+", label: "Orders served" },
  { value: "10K+", label: "Restaurant partners" },
  { value: "5", label: "Cities & growing" },
  { value: "4.9★", label: "Avg app rating" },
];

const VALUES = [
  {
    icon: ICON.bolt,
    color: "#ff6b00",
    title: "Fresh & Fast",
    text: "Hot food, honest ETAs, and live tracking on every single order.",
  },
  {
    icon: ICON.heart,
    color: "#e11d48",
    title: "Fair to Restaurants",
    text: "Transparent commissions and real support for the kitchens we serve.",
  },
  {
    icon: ICON.leaf,
    color: "#16a34a",
    title: "Greener Plates",
    text: "Eco packaging and route-optimized deliveries that cut waste city by city.",
  },
  {
    icon: ICON.users,
    color: "#2563eb",
    title: "Community First",
    text: "Local delivery jobs, neighborhood favorites, and food drives when it matters.",
  },
];

const JOURNEY = [
  {
    year: "2023",
    title: "Two friends, one kitchen",
    text: "BeYuumi starts as a late-night craving and a laptop in a Bengaluru flat — connecting three home chefs to hungry neighbors.",
  },
  {
    year: "2024",
    title: "The 30-minute promise",
    text: "Second city launches, our own delivery fleet hits the road, and live order tracking ships to every user.",
  },
  {
    year: "2025",
    title: "2 million yuumi moments",
    text: "Five cities, ten thousand restaurant partners, and a support crew that answers in under two minutes.",
  },
  {
    year: "2026",
    title: "Going greener",
    text: "Eco packaging becomes default and smart routing cuts delivery miles across every city we serve.",
  },
];

/* ---------- floating food chips ---------- */

const FLOATERS = [
  { emoji: "🍛", cls: "top-[20%] left-[7%]", delay: "0s" },
  { emoji: "🥗", cls: "top-[28%] right-[9%]", delay: "1s" },
  { emoji: "🧑‍🍳", cls: "bottom-[32%] left-[15%] hidden xl:grid", delay: "2s" },
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

const About = () => {
  const storyRef = useReveal(2);
  const valueRef = useReveal(VALUES.length);
  const journeyRef = useReveal(JOURNEY.length);

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
            <Svg d={ICON.star} className="h-3.5 w-3.5" /> Our story
          </span>
          <h1 className="font-display animate-fade-up mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            More than meals,{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              we serve experiences.
            </span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            BeYuumi began with one belief: great food should arrive fast, fair, and full of joy —
            for the people ordering it, cooking it, and delivering it.
          </p>
          <div className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
              style={{ background: ACCENT }}
            >
              Join the team
              <Svg d={ICON.arrow} className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Talk to us
            </Link>
          </div>

          {/* stats */}
          <div className="animate-fade-up mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/5 px-4 py-5">
                <p className="font-display text-2xl font-extrabold text-orange-400 sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-300 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STORY ============ */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div ref={storyRef(0)} className="career-fade relative mx-auto w-full max-w-lg">
            <div
              className="absolute -inset-3 -z-10 rounded-[2rem]"
              style={{ background: `linear-gradient(135deg, ${ACCENT}33, transparent 70%)` }}
            />
            <img
              src={aboutimg}
              alt="The BeYuumi team sharing a meal"
              loading="lazy"
              className="w-full rounded-[2rem] object-cover shadow-xl ring-1 ring-slate-200"
            />
            {/* floating badge on photo */}
            <div className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-slate-100">
              <span
                className="grid h-10 w-10 place-items-center rounded-xl text-white"
                style={{ background: ACCENT }}
              >
                <Svg d={ICON.check} className="h-5 w-5" strokeWidth={3} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">98% on-time</p>
                <p className="text-xs text-slate-500">last 90 days</p>
              </div>
            </div>
          </div>

          <div ref={storyRef(1)} className="career-fade">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
              Why we exist
            </span>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Born from a craving. Built for every kitchen.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-500">
              In 2023, our founders waited 90 minutes for cold biryani and thought{" "}
              <em>“there has to be a better way.”</em> BeYuumi started that week with three home
              chefs and a spreadsheet — no dark patterns, no surprise fees, just good food moving
              quickly.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              Today we&apos;re thousands of orders a day, but the rule hasn&apos;t changed: if it
              isn&apos;t good enough for our own dinner, it doesn&apos;t leave the kitchen.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Live tracking on every order, no black boxes",
                "Restaurants paid in 24 hours, not 30 days",
                "Support humans, not bots — under 2 minutes",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-slate-600">
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
                    style={{ background: ACCENT }}
                  >
                    <Svg d={ICON.check} className="h-3 w-3" strokeWidth={3.5} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ VALUES ============ */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            What we stand for
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Four things we never compromise
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              ref={valueRef(i)}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl career-fade"
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                style={{ background: v.color }}
              >
                <Svg d={v.icon} className="h-5 w-5" />
              </span>
              <h3 className="font-display mt-4 text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ JOURNEY TIMELINE ============ */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            The road so far
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            From one flat to five cities
          </h2>
        </div>

        <ol className="relative mt-14 space-y-10 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-gradient-to-b before:from-[#ff6b00]/60 before:to-slate-200 sm:before:left-1/2 sm:before:-translate-x-px">
          {JOURNEY.map((j, i) => (
            <li
              key={j.year}
              ref={journeyRef(i)}
              className={`relative flex gap-6 pl-9 sm:w-1/2 sm:pl-0 career-fade ${
                i % 2 === 0
                  ? "sm:pr-12 sm:text-right"
                  : "sm:ml-auto sm:pl-12"
              }`}
            >
              {/* dot */}
              <span
                className={`absolute top-1 grid h-[23px] w-[23px] place-items-center rounded-full border-4 border-white shadow-md ${
                  i % 2 === 0 ? "left-0 sm:-right-[11.5px] sm:left-auto" : "left-0 sm:-left-[11.5px]"
                }`}
                style={{ background: i === JOURNEY.length - 1 ? ACCENT : "#fff" }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
              </span>
              <div className="w-full">
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-extrabold text-white"
                  style={{ background: NAVY }}
                >
                  {j.year}
                </span>
                <h3 className="font-display mt-2.5 text-lg font-bold">{j.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{j.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div
          className="relative overflow-hidden rounded-3xl px-6 py-14 text-center"
          style={{
            backgroundImage: `linear-gradient(120deg, ${ACCENT}, #f59e0b)`,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 hidden h-40 w-40 place-items-center rounded-full bg-white/15 text-7xl animate-float md:grid"
          >
            🍜
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-10 -left-6 hidden h-36 w-36 place-items-center rounded-full bg-black/10 text-6xl animate-bounce-soft md:grid"
          >
            🛵
          </span>
          <h2 className="font-display mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Hungry to shape the future of food?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85">
            We&apos;re hiring across engineering, design, and operations — come build the platform
            millions eat with.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold shadow-lg transition-transform hover:scale-105"
              style={{ color: ACCENT }}
            >
              See open roles
              <Svg d={ICON.arrow} className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Say hello
            </Link>
          </div>
        </div>
      </section>

      {/* nested route slot: /about/profile still renders here */}
      <Outlet />
    </div>
  );
};

export default About;
