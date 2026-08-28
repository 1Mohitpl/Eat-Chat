import { useState } from "react";
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
  headset:
    "M3 12a9 9 0 1 1 18 0M3 12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1M3 12a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 1 2 2 2 2 0 0 0 2 2",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  clock: "M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  check: "M20 6 9 17l-5-5",
  bolt: "M13 2 3 14h7l-1 8 11-12h-7l1-8Z",
  chevron: "m6 9 6 6 6-6",
  send: "m22 2-7 20-4-9-9-4Z M22 2 11 13",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
  users:
    "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
};

const CHANNELS = [
  {
    icon: ICON.headset,
    color: ACCENT,
    title: "Live Chat",
    desc: "Real humans, avg reply under 2 min.",
    meta: "24/7 · English & Hindi",
    action: "Start chatting",
    href: "#contact-form",
  },
  {
    icon: ICON.phone,
    color: "#2563eb",
    title: "Call Us",
    desc: "1800-200-1010 · toll-free.",
    meta: "Daily · 8 AM – midnight IST",
    action: "Call now",
    href: "tel:+9118002001010",
  },
  {
    icon: ICON.mail,
    color: "#7c3aed",
    title: "Email",
    desc: "care@beyuumi.com",
    meta: "Replies within 4 hours",
    action: "Write to us",
    href: "#contact-form",
  },
  {
    icon: ICON.pin,
    color: "#0d9488",
    title: "Visit HQ",
    desc: "WeWork Galaxy, Residency Road, Bengaluru 560025",
    meta: "Mon–Fri · 10 AM – 6 PM",
    action: "Get directions",
    href: "https://maps.google.com/?q=Residency+Road+Bengaluru",
  },
];

const STATS = [
  { value: "24/7", label: "Support coverage" },
  { value: "< 2 min", label: "Avg chat reply" },
  { value: "4.9★", label: "Support rating" },
];

const TOPICS = ["Order issue", "Feedback", "Partnership", "Something else"];

const PROMISES = [
  { icon: ICON.clock, text: "First response within 4 hours — usually much faster." },
  { icon: ICON.users, text: "No bots running you in circles. Real people, real fixes." },
  { icon: ICON.shield, text: "Your details stay private. We only use them to help you." },
];

const FAQS = [
  {
    q: "How long do refunds take?",
    a: "Instant refunds land back in your BeYuumi wallet immediately. Bank refunds via UPI take 2–4 hours; card refunds take 3–5 business days depending on your bank.",
  },
  {
    q: "My order is late — what should I do?",
    a: "Open Track Order from My Orders for a live status. If it's more than 15 minutes past the ETA, chat with us and we'll make it right, including a full refund if needed.",
  },
  {
    q: "Can I change my address after ordering?",
    a: "Yes, while the order is still being prepared. Use the chat and share your order ID plus the new address — our team will update it before dispatch.",
  },
  {
    q: "How do I partner my restaurant with BeYuumi?",
    a: "Pick 'Partnership' in the form below or email partners@beyuumi.com. Our onboarding crew replies within one business day with next steps.",
  },
];

const CHANNEL_CARD =
  "group relative rounded-2xl bg-white border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl career-fade";

/* ---------- floating food chips for the hero ---------- */

const FLOATERS = [
  { emoji: "🍕", cls: "top-[18%] left-[6%]", delay: "0s" },
  { emoji: "🛵", cls: "top-[24%] right-[10%]", delay: "0.8s" },
  { emoji: "🍜", cls: "bottom-[30%] left-[14%] hidden xl:grid", delay: "1.6s" },
  { emoji: "🍔", cls: "bottom-[26%] right-[18%] hidden xl:grid", delay: "2.4s" },
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

/* ---------- contact form ---------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
    <div className="mt-1.5">{children}</div>
    {error && (
      <span className="mt-1 block text-xs font-semibold" style={{ color: "#ef4444" }}>
        {error}
      </span>
    )}
  </label>
);

const inputCls = (bad) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/15 ${
    bad ? "border-red-400 animate-shake" : "border-slate-200"
  }`;

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [ticket, setTicket] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Please tell us your name.";
    if (!EMAIL_RE.test(form.email.trim())) errs.email = "That email doesn't look right.";
    if (form.message.trim().length < 10) errs.message = "Give us a bit more detail (10+ chars).";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    // ponytail: no backend yet — fake send so the UX is complete; wire to
    // POST /support-tickets when the API exists
    setSending(true);
    setTimeout(() => {
      setTicket(`BY-${Math.floor(1000 + Math.random() * 9000)}`);
      setSending(false);
    }, 900);
  };

  if (ticket) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <span
          className="mx-auto grid h-16 w-16 place-items-center rounded-full text-white"
          style={{ background: ACCENT, boxShadow: "0 10px 30px rgba(255,107,0,0.35)" }}
        >
          <Svg d={ICON.check} className="h-8 w-8" strokeWidth={3} />
        </span>
        <h3 className="font-display mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
          Message received!
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Ticket <span className="font-bold text-slate-700">#{ticket}</span> is with our care team.
          We&apos;ll reply to <span className="font-semibold">{form.email}</span> within 4 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setTicket(null);
            setForm({ name: "", email: "", topic: TOPICS[0], message: "" });
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-[#ff6b00] hover:text-[#ff6b00]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
    >
      <div className="space-y-5">
        <Field label="Your name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. Priya Sharma"
            className={inputCls(errors.name)}
          />
        </Field>

        <Field label="Email address" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            className={inputCls(errors.email)}
          />
        </Field>

        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            What&apos;s this about?
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {TOPICS.map((t) => {
              const activeTopic = form.topic === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, topic: t }))}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    activeTopic
                      ? "border-transparent text-white shadow-md scale-105"
                      : "border-slate-200 text-slate-600 hover:border-[#ff6b00]/50 hover:text-[#ff6b00]"
                  }`}
                  style={activeTopic ? { background: ACCENT } : undefined}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Message" error={errors.message}>
          <textarea
            rows={4}
            value={form.message}
            onChange={set("message")}
            placeholder="Tell us what happened — order ID helps us move faster."
            className={`${inputCls(errors.message)} resize-none`}
          />
        </Field>

        <button
          type="submit"
          disabled={sending}
          className="flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
          style={{ background: ACCENT, boxShadow: "0 8px 24px rgba(255,107,0,0.25)" }}
        >
          {sending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <Svg d={ICON.send} className="h-4 w-4" strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

/* ---------- FAQ ---------- */

const FaqRow = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-bold text-slate-900 sm:text-base">{faq.q}</span>
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform duration-300 ${
            open ? "rotate-180 text-white" : "bg-slate-100 text-slate-500"
          }`}
          style={open ? { background: ACCENT } : undefined}
        >
          <Svg d={ICON.chevron} className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </button>
      {open && (
        <p className="animate-fade-up px-5 pb-5 text-sm leading-relaxed text-slate-500">{faq.a}</p>
      )}
    </div>
  );
};

/* ---------- page ---------- */

const Contact = () => {
  const channelRef = useReveal(CHANNELS.length);
  const promiseRef = useReveal(PROMISES.length);
  const faqRef = useReveal(FAQS.length);

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-slate-900">
      {/* ============ HERO ============ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: NAVY,
          backgroundImage:
            "radial-gradient(55% 60% at 85% 15%, rgba(255,107,0,0.28), transparent 60%), radial-gradient(40% 50% at 8% 85%, rgba(37,99,235,0.22), transparent 60%)",
        }}
      >
        {FLOATERS.map((f) => (
          <Floater key={f.emoji} {...f} />
        ))}

        <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-20 text-center sm:pt-24">
          <span className="animate-fade-down inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300 backdrop-blur">
            <Svg d={ICON.bolt} className="h-3.5 w-3.5" /> We reply fast
          </span>
          <h1 className="font-display animate-fade-up mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Craving answers?{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              We&apos;re all ears.
            </span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Questions about an order, feedback, or a partnership idea — pick whichever channel suits
            you. A real human is always on the other side.
          </p>

          {/* stats */}
          <div className="animate-fade-up mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur">
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

      {/* ============ CHANNEL CARDS (overlapping hero) ============ */}
      <section className="relative mx-auto -mt-20 max-w-7xl px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c, i) => (
            <a
              key={c.title}
              href={c.href}
              ref={channelRef(i)}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className={`${CHANNEL_CARD} flex flex-col`}
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                style={{ background: c.color }}
              >
                <Svg d={c.icon} className="h-5 w-5" />
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-slate-900">{c.title}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-500">{c.desc}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Svg d={ICON.clock} className="h-3.5 w-3.5" /> {c.meta}
              </p>
              <span
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: c.color }}
              >
                {c.action}
                <Svg d={ICON.arrow} className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ============ FORM + PROMISES ============ */}
      <section id="contact-form" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
              Write to us
            </span>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Prefer typing over talking?
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-500">
              Drop your message here and our care team picks it up right away. The more detail you
              share, the faster we fix things.
            </p>

            <ul className="mt-8 space-y-4">
              {PROMISES.map((p, i) => (
                <li
                  key={i}
                  ref={promiseRef(i)}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md career-fade"
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                    style={{ background: `${ACCENT}1a`, color: ACCENT }}
                  >
                    <Svg d={p.icon} className="h-5 w-5" />
                  </span>
                  <p className="pt-1.5 text-sm leading-relaxed text-slate-600">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            Quick answers
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} ref={faqRef(i)} className="career-fade">
              <FaqRow faq={f} />
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Still stuck?{" "}
          <a
            href="#contact-form"
            className="font-bold underline decoration-2 underline-offset-4 transition-colors hover:text-[#ff6b00]"
            style={{ color: NAVY }}
          >
            Message us above
          </a>{" "}
          — we love a good puzzle.
        </p>
      </section>
    </div>
  );
};

export default Contact;
