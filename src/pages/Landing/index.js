import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Building2,
  CheckCircle2,
  ClipboardList,
  Download,
  Mail,
  MessageSquareMore,
  QrCode,
  ScanLine,
  ShieldCheck,
  Star,
  Layers3,
  Bug,
  Lightbulb,
} from "lucide-react";

const features = [
  {
    icon: Layers3,
    title: "Custom item templates",
    desc: "Create your own item properties so the system matches your workflow, whether you manage stock, assets, tools, parts, or supplies.",
  },
  {
    icon: Boxes,
    title: "Easy item setup",
    desc: "Add items quickly using your selected template without complicated configuration or rigid data structures.",
  },
  {
    icon: QrCode,
    title: "QR code for every item",
    desc: "Each item gets its own QR code, ready to download as PNG and print for labels, bins, shelves, packaging, or equipment.",
  },
  {
    icon: ClipboardList,
    title: "Track item logs",
    desc: "Keep a simple history of stock intake, usage, and quantity changes so every item has a clear activity record.",
  },
  {
    icon: Building2,
    title: "Manage multiple inventories",
    desc: "Handle different inventory spaces, warehouses, or business units from one system without switching tools.",
  },
  {
    icon: ShieldCheck,
    title: "No extra hardware required",
    desc: "Start with the devices you already have. Generate, print, and scan QR codes using standard tools.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your inventory template",
    desc: "Define the properties that matter to your workflow.",
  },
  {
    number: "02",
    title: "Add items",
    desc: "Create item records using your own structure.",
  },
  {
    number: "03",
    title: "Generate and print QR codes",
    desc: "Download QR codes as PNG and place them where needed.",
  },
  {
    number: "04",
    title: "Scan and update",
    desc: "Access items quickly and keep stock records current.",
  },
];

const screenshots = [
  {
    title: "See all items at a glance",
    desc: "A clean inventory view showing item quantities, categories, and quick access from one dashboard.",
    badge: "Home view",
  },
  {
    title: "Create items in seconds",
    desc: "Add new inventory records using your selected template and custom property structure.",
    badge: "Item setup",
  },
  {
    title: "Track stock activity with logs",
    desc: "Review item history such as stock intake, usage, and quantity changes over time.",
    badge: "Logs",
  },
  {
    title: "Generate QR codes instantly",
    desc: "Every item includes its own QR code, ready to download as PNG and print for labels or operations.",
    badge: "QR export",
  },
  {
    title: "Manage multiple inventories",
    desc: "Switch between inventory spaces or warehouse groups without changing systems.",
    badge: "Multi-inventory",
  },
  {
    title: "Build your own item structure",
    desc: "Create custom properties that fit your business instead of forcing your workflow into fixed fields.",
    badge: "Templates",
  },
];

const sampleCards = [
  { title: "Label Printer", tag: "Office Equipment", qty: "4" },
  { title: "Safety Gloves Box", tag: "Safety Supplies", qty: "28" },
  { title: "Shipping Labels Roll", tag: "Packaging Materials", qty: "15" },
  { title: "Barcode Scanner", tag: "IT Assets", qty: "6" },
  { title: "Storage Bin Large", tag: "Warehouse Supplies", qty: "22" },
  { title: "Cleaning Solution", tag: "Facility Supplies", qty: "11" },
];

const feedbackTypes = [
  { value: "comment", label: "Comment", icon: MessageSquareMore },
  { value: "bug", label: "Bug report", icon: Bug },
  { value: "feature", label: "Feature request", icon: Lightbulb },
];

export default function RekoditLandingPage() {
  const [form, setForm] = useState({
    email: "",
    rating: 5,
    type: "comment",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`REKODIT feedback — ${form.type}`);
    const body = encodeURIComponent(
      [
        `Email: ${form.email || "Not provided"}`,
        `Rating: ${form.rating}/5`,
        `Feedback type: ${form.type}`,
        "",
        "Message:",
        form.message || "No additional details provided.",
      ].join("\n")
    );
    return `mailto:eganxhart@gmail.com?subject=${subject}&body=${body}`;
  }, [form]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    window.location.href = mailtoHref;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-[#31FFD2]/12 blur-3xl" />
        <div className="absolute right-[-8rem] top-[16rem] h-96 w-96 rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_top,rgba(49,255,210,0.10),transparent_48%)]" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-12">
        <header className="mb-16 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#31FFD2] text-black shadow-lg shadow-[#31FFD2]/20">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-white/70">REKODIT</p>
              <p className="text-xs text-white/45">Flexible inventory, simplified</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#screenshots"
              className="hidden rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 md:inline-flex"
            >
              View demo screens
            </a>
            <a
              href="#feedback"
              className="rounded-full bg-[#31FFD2] px-4 py-2 text-sm font-semibold text-black transition hover:translate-y-[-1px]"
            >
              Get started
            </a>
          </div>
        </header>

        <section className="grid items-center gap-10 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"
            >
              <span className="h-2 w-2 rounded-full bg-[#31FFD2]" />
              Easy-to-set-up inventory management for any workflow
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05 }}
              className="mt-6 max-w-4xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl"
            >
              Simple inventory setup for any business.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-white/70"
            >
              Create custom item templates, manage multiple inventories, generate QR codes for
              every item, and track stock activity in one place. No extra hardware required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.15 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                href="#feedback"
                className="inline-flex items-center gap-2 rounded-full bg-[#31FFD2] px-6 py-3 text-sm font-semibold text-black transition hover:translate-y-[-1px]"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#screenshots"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                View demo screens
              </a>
            </motion.div>

            <div className="mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: "Setup model", value: "Custom templates" },
                { label: "Item access", value: "QR per item" },
                { label: "Deployment", value: "No extra hardware" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-2xl font-semibold text-[#31FFD2]">{stat.value}</div>
                  <div className="mt-1 text-sm text-white/55">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-[#31FFD2]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 shadow-2xl shadow-black/30">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#101010] p-4">
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">Product preview</p>
                    <p className="mt-1 text-lg font-semibold">Inventory view built for clarity</p>
                  </div>
                  <div className="rounded-full border border-[#31FFD2]/30 bg-[#31FFD2]/10 px-3 py-1 text-xs text-[#31FFD2]">
                    Live-ready concept
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Sample item list</span>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/60">Universal use</span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {sampleCards.map((card) => (
                        <div key={card.title} className="rounded-2xl border border-white/10 bg-[#f4f4f4] p-4 text-[#1b1b1b]">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-sm font-semibold leading-5">{card.title}</span>
                            <span className="rounded-xl bg-[#141414] px-2 py-1 text-xs font-semibold text-[#31FFD2]">
                              {card.qty}
                            </span>
                          </div>
                          <div className="mt-4 inline-flex rounded-full bg-[#31FFD2] px-3 py-1 text-xs font-semibold text-[#141414]">
                            {card.tag}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <QrCode className="h-5 w-5 text-[#31FFD2]" />
                      <div className="mt-3 text-sm font-medium">Download QR in PNG</div>
                      <div className="mt-1 text-xs leading-6 text-white/50">Print labels however you need.</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <ClipboardList className="h-5 w-5 text-[#31FFD2]" />
                      <div className="mt-3 text-sm font-medium">Track item activity</div>
                      <div className="mt-1 text-xs leading-6 text-white/50">Keep intake, usage, and updates visible.</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <Building2 className="h-5 w-5 text-[#31FFD2]" />
                      <div className="mt-3 text-sm font-medium">Run multiple inventories</div>
                      <div className="mt-1 text-xs leading-6 text-white/50">Separate spaces, one product.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="pb-20 lg:pb-28">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[#31FFD2]">Features</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Built for flexible inventory workflows.</h2>
            <p className="mt-4 text-white/65">
              REKODIT is designed for teams that need a simple way to organise items, define
              their own data fields, and connect physical labels to digital records through QR codes.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#31FFD2]/15 text-[#31FFD2]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="pb-20 lg:pb-28">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.25em] text-[#31FFD2]">How it works</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">From setup to tracking in minutes.</h2>
            </div>
            <p className="max-w-xl text-white/60">
              Create a template, add items, generate QR codes, and begin tracking stock activity without specialized hardware or complicated setup.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6"
              >
                <div className="text-sm font-semibold tracking-[0.2em] text-[#31FFD2]">{step.number}</div>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="screenshots" className="pb-20 lg:pb-28">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.25em] text-[#31FFD2]">Demo screens</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Real product views that support the workflow.</h2>
            </div>
            <p className="max-w-xl text-white/60">
              These sections are designed for your actual screenshots: item list, item creation, logs, QR code export, multi-inventory management, and custom properties.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {screenshots.map((shot, index) => (
              <motion.div
                key={shot.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5"
              >
                <div className="aspect-[4/3] border-b border-white/10 bg-[linear-gradient(135deg,rgba(49,255,210,0.16),rgba(255,255,255,0.02))] p-4">
                  <div className="flex h-full flex-col rounded-[1.35rem] border border-white/10 bg-[#0f0f0f]/80 p-4">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-20 rounded-full bg-white/10" />
                      <div className="h-3 w-12 rounded-full bg-[#31FFD2]/30" />
                    </div>
                    <div className="mt-4 grid flex-1 gap-3 grid-cols-[0.8fr_1.2fr]">
                      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="h-3 w-2/3 rounded-full bg-white/10" />
                        <div className="h-3 w-1/2 rounded-full bg-white/10" />
                        <div className="h-20 rounded-2xl bg-white/10" />
                      </div>
                      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="h-24 rounded-2xl bg-[#31FFD2]/10" />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-14 rounded-2xl bg-white/10" />
                          <div className="h-14 rounded-2xl bg-white/10" />
                        </div>
                        <div className="h-10 rounded-2xl bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                    {shot.badge}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{shot.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/60">{shot.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="pb-20 lg:pb-28">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Download,
                title: "PNG QR export",
                desc: "Download item QR codes in PNG format and print them as labels, tags, shelf markers, or equipment stickers.",
              },
              {
                icon: ScanLine,
                title: "Easy scan workflow",
                desc: "Connect physical items to digital records so users can reach the right item quickly and update it with less friction.",
              },
              {
                icon: CheckCircle2,
                title: "Fast to adopt",
                desc: "Built for teams that want something practical, lightweight, and easy to set up without operational overhead.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#31FFD2]/15 text-[#31FFD2]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="feedback" className="pb-16">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
              <p className="text-sm uppercase tracking-[0.25em] text-[#31FFD2]">Feedback</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Help improve REKODIT.</h2>
              <p className="mt-4 max-w-xl text-white/65">
                Send feedback, report issues, or suggest new features as the product continues to improve. The current implementation opens a structured email to your inbox.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Collects email, rating, and feedback category",
                  "Supports comments, bug reports, and feature requests",
                  "Simple starting point before adding a full submission backend",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3 text-sm text-white/70">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#31FFD2]" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-[#31FFD2]/20 bg-[#31FFD2]/8 p-5">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-[#31FFD2]" />
                  <div>
                    <p className="font-medium text-white">Destination email</p>
                    <p className="mt-1 text-sm text-white/60">eganxhart@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#101010] p-7 shadow-2xl shadow-black/30">
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#31FFD2]/40"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-white/80">Rating</label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => onChange("rating", value)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                          form.rating === value
                            ? "bg-[#31FFD2] text-black"
                            : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        <Star className="h-4 w-4" />
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-white/80">Feedback type</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {feedbackTypes.map((type) => {
                      const Icon = type.icon;
                      const active = form.type === type.value;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => onChange("type", type.value)}
                          className={`rounded-2xl border px-4 py-4 text-left transition ${
                            active
                              ? "border-[#31FFD2]/50 bg-[#31FFD2]/10"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${active ? "text-[#31FFD2]" : "text-white/60"}`} />
                          <div className="mt-3 text-sm font-medium">{type.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Message (optional)</label>
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={(e) => onChange("message", e.target.value)}
                    placeholder="Tell us what worked, what felt confusing, what broke, or what you want next."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#31FFD2]/40"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#31FFD2] px-5 py-3 text-sm font-semibold text-black transition hover:translate-y-[-1px]"
                >
                  Send feedback
                  <ArrowRight className="h-4 w-4" />
                </button>

                {submitted && (
                  <p className="rounded-2xl border border-[#31FFD2]/20 bg-[#31FFD2]/8 px-4 py-3 text-sm text-white/75">
                    Your email app should open with a prefilled feedback message.
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-white/40">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>REKODIT — simple inventory management with custom templates, QR access, and activity logs.</p>
            <p>Built for flexible business workflows.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
