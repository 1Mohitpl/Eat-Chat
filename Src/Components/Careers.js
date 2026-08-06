import React, { useEffect, useMemo, useRef, useState } from "react";

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
  headset: "M3 12a9 9 0 1 1 18 0M3 12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1M3 12a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 1 2 2 2 2 0 0 0 2 2",
  bolt: "M13 2 3 14h7l-1 8 11-12h-7l1-8Z",
  gift: "M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z",
  growth: "M3 3v18h18M7 15l4-4 3 3 5-6",
  users: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z",
  clock: "M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  check: "M20 6 9 17l-5-5",
  insta: "M4 4h16M4 20h16M4 4v16M20 4v16",
  twitter: "M4 4l16 16M4 20L20 4",
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20",
  linkedin: "M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-10h4v2a4 4 0 0 1 3.5-2zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
};

const DEPARTMENTS = [
  { key: "all", label: "All Roles", color: "#0f172a", icon: null },
  { key: "Engineering", label: "Engineering", color: "#2563eb", icon: ICON.code },
  { key: "Design", label: "Design", color: "#7c3aed", icon: ICON.design },
  { key: "Marketing", label: "Marketing", color: "#ea580c", icon: ICON.megaphone },
  { key: "Customer Success", label: "Customer Success", color: "#0d9488", icon: ICON.headset },
];

const JOBS = [
  { title: "Frontend Developer", dept: "Engineering", location: "Remote", type: "Full-time", desc: "Build delightful, pixel-perfect food-ordering experiences with React." },
  { title: "Backend Developer", dept: "Engineering", location: "Remote", type: "Full-time", desc: "Scale our order pipeline and meal-delivery APIs to millions of users." },
  { title: "Product Designer", dept: "Design", location: "Hybrid", type: "Full-time", desc: "Craft intuitive interfaces and design systems that make food feel personal." },
  { title: "Brand Designer", dept: "Design", location: "Remote", type: "Full-time", desc: "Own the BeYuumi identity across campaigns, menus, and merch." },
  { title: "Marketing Specialist", dept: "Marketing", location: "Onsite", type: "Full-time", desc: "Drive growth campaigns, partnerships, and cuisine-first storytelling." },
  { title: "Growth Manager", dept: "Marketing", location: "Remote", type: "Full-time", desc: "Own acquisition loops and restaurant onboarding across new cities." },
  { title: "Customer Success Manager", dept: "Customer Success", location: "Hybrid", type: "Full-time", desc: "Be the warm human voice behind 2M+ happy orders every week." },
  { title: "Support Lead", dept: "Customer Success", location: "Onsite", type: "Full-time", desc: "Build and lead a delightful support team obsessed with resolution." },
];

const VALUE_CARDS = [
  { icon: ICON.bolt, color: "#ff6b00", title: "Fast-Growing Startup", text: "Ship daily, iterate fast, and watch your work reach millions of users." },
  { icon: ICON.gift, color: "#7c3aed", title: "Great Benefits", text: "Health cover, meal credits, learning budget, and flexible time off." },
  { icon: ICON.code, color: "#2563eb", title: "Learning & Growth", text: "Mentors, hack weeks, and a clear path to take ownership early." },
  { icon: ICON.users, color: "#0d9488", title: "Diverse Team", text: "A culture that welcomes every background, voice, and idea." },
];

const STATS = [
  { value: "50+", label: "Team Members" },
  { value: "5", label: "Cities" },
  { value: "2M+", label: "Users Served" },
  { value: "Remote", label: "Friendly" },
];

const SOCIALS = [
  { name: "Instagram", icon: ICON.users, href: "#" },
  { name: "Twitter", icon: ICON.twitter, href: "#" },
  { name: "LinkedIn", icon: ICON.globe, href: "#" },
];

const FOOTER_LINKS = {
  Company: ["About", "Careers", "Press", "Blog"],
  Careers: ["Open Roles", "Life at BeYuumi", "Internships", "Hiring Guide"],
  Support: ["Help Center", "Contact", "FAQs", "Partner With Us"],
  Legal: ["Privacy", "Terms", "Cookies", "Security"],
};

/* Smooth scroll-in on mount */
const useReveal = (count) => {
  const refs = useRef([]);
  useEffect(() => {
    refs.current.slice(0, count).forEach((el) => {
      if (!el) return;
      const onMount = requestAnimationFrame(() => el.classList.add("career-in"));
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("career-in");
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.12 }
      );
      observer.observe(el);
      return () => {
        cancelAnimationFrame(onMount);
        observer.disconnect();
      };
    });
  }, [count]);

  return (i) => (el) => {
    refs.current[i] = el;
  };
};

/* -------- sub components -------- */

const JobCard = ({ job }) => {
  const dept = DEPARTMENTS.find((d) => d.key === job.dept);
  return (
    <div className="group relative rounded-2xl bg-white border border-slate-200 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#ff6b00]/30 career-fade">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white shrink-0"
            style={{ backgroundColor: dept.color }}
          >
            <Svg d={dept.icon} className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{job.title}</h3>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">{job.description}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
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
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">Apply in under 3 minutes</span>
        <button
          onClick={() => alert(`Applied to ${job.title} — we'll be in touch!`)}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{ backgroundColor: ACCENT }}
        >
          Apply Now
          <Svg d={ICON.arrow} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

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
        j.description.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q);
      return matchDept && matchQuery;
    });
  }, [query, dept]);

  const visibleCount = useMemo(() => {
    let n = JOBS.length;
    if (dept !== "all") n = JOBS.filter((j) => j.dept === dept).length;
    if (query.trim()) n = filtered.length;
    return n;
  }, [dept, query, filtered]);

  const setRoleRef = useReveal(filtered.length || 1);
  const setValueRef = useReveal(VALUE_CARDS.length);

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-slate-900">
      {/* ============ HERO ============ */}
      <section
        className="relative overflow-hidden bg-[#0f172a]"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 80% 10%, rgba(255,107,0,0.25), transparent 60%), radial-gradient(40% 50% at 10% 90%, rgba(16,122,139,0.2), transparent 60%)",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div className="career-fade">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300">
              <Svg d={ICON.bolt} className="h-3.5 w-3.5" /> We&apos;re hiring
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Join Our Team at <span className="text-orange-400">BeYuumi!</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              We&apos;re building the food-tech company that makes great meals effortless
              for millions. If you want your work to be tasted, shipped, and loved — come build with us.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: ACCENT }}
              >
                See Open Roles
                <Svg d={ICON.arrow} className="h-4 w-4" />
              </button>
              <a
                href="#culture"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                Why BeYuumi?
              </a>
            </div>
          </div>

          {/* Hero illustration */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl bg-white/5 p-1.5 ring-1 ring-white/10">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-[#0f172a] p-8">
                <div
                  className="rounded-2xl bg-white p-6 shadow-2xl"
                  style={{ backgroundColor: "white" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                      <Svg d={ICON.gift} className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Header ×2 onboarding sprint</p>
                      <p className="text-xs text-slate-500">Friday standup · 10:00 AM</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {[
                      { icon: ICON.bolt, t: "Launch city #6 this month", c: "#ff6b00" },
                      { icon: ICON.design, t: "New menu concept review", c: "#7c3aed" },
                      { icon: ICON.megaphone, t: "+Troll races campaign", c: "#ea580c" },
                    ].map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                      >
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                          style={{ backgroundColor: r.c }}
                        >
                          <Svg d={r.icon} className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium text-slate-700">{r.t}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <span className="text-xs font-medium text-slate-500">Team lunch 🍜 at 1pm</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Svg d={ICON.check} className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 py-6 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center py-4 text-center lg:py-2 lg:text-left lg:items-start lg:pl-8 lg:border-l lg:border-white/10 first:lg:border-l-0"
              >
                <span className="text-2xl font-extrabold text-orange-400 sm:text-3xl">{s.value}</span>
                <span className="mt-1 text-sm font-medium text-slate-300">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CULTURE / VALUE CARDS ============ */}
      <section id="culture" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">Why join</span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            A culture built to feed your ambition
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            We obsess over the details — from your first meal credit to your first big launch.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_CARDS.map((v, i) => (
            <div
              key={i}
              ref={setValueRef(i)}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl career-fade"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: v.color }}
              >
                <Svg d={v.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ OPEN ROLES ============ */}
      <section id="open-roles" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-xs text-xs font-semibold uppercase tracking-wider text-orange-600">Careers</span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Open positions</h2>
              <p className="mt-2 text-[16px] font-semibold text-slate-500">
                {visibleCount} open position{visibleCount === 1 ? "" : "s"}
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Svg d={ICON.search} className="h-4 w-4" />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, team, or city…"
                  className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-[#ff6b00] focus:ring-2 focus:ring-orange-100 sm:w-72"
                />
              </div>
            </div>
          </div>

          {/* Department filter tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {DEPARTMENTS.map((d) => (
              <button
                key={d.key}
                onClick={() => setDept(d.key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  dept === d.key
                    ? "bg-[#0f172a] text-white shadow"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {d.icon && <Svg d={d.icon} className="h-3.5 w-3.5" />}
                {d.label}
              </button>
            ))}
          </div>

          {/* Job cards */}
          <div className="mt-8 space-y-4">
            {filtered.map((job, idx) => (
              <div key={idx} ref={setRoleRef(idx)}>
                <JobCard job={job} />
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                <span
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: NAVY }}
                >
                  <Svg d={ICON.search} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">No roles match that filter</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try clearing your search, or hit the culture section and say hi anyway.
                </p>
                <button
                  onClick={() => { setQuery(""); setDept("all"); }}
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
      <section className="mx-auto max-w-7xl px-6 pb-6 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-[#0f172a] p-8 sm:p-12">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 80% at 85% 20%, rgba(255,107,0,0.35), transparent 60%), radial-gradient(40% 70% at 10% 100%, rgba(16,185,139,0.2), transparent 60%)",
            }}
          />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                Don&apos;t see your role?
              </h3>
              <p className="mt-3 text-base text-slate-300">
                We always want to meet great people. Send us your resume and we&apos;ll
                keep you in mind for the next big opening.
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

      {/* ============ FOOTER ============ */}
      <footer className="mt-4 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Svg d={ICON.bolt} className="h-5 w-5" />
                </span>
                <span className="text-xl font-extrabold text-slate-900">BeYuumi</span>
              </div>
              <p className="mt-4 max-w-xs text-sm text-slate-500">
                Food, delivered with care. Built by a hungry, happy team across five cities.
              </p>
              <div className="mt-5 flex gap-2.5">
                {SOCIALS.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    aria-label={s.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-orange-500 hover:text-orange-500"
                  >
                    <Svg d={s.icon} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">{group}</h4>
                <ul className="mt-4 space-y-2.5">
                  {links.map((l, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 transition-colors hover:text-orange-600"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} BeYuumi Technologies Pvt. Ltd. All rights reserved.
            </p>
            <p className="text-sm text-slate-400">
              Made with <span className="text-orange-500">♥</span> by the BeYuumi team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Careers;