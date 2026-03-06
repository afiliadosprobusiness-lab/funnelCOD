import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Heart,
  Layers,
  Menu,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-editor.jpg";

type Language = "es" | "en";

const LANGUAGE_STORAGE_KEY = "funnelcod_lang";

const FEATURE_IMAGES = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1551281044-8b1a8f0f59bd?auto=format&fit=crop&w=1400&q=80",
];

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80",
];

const TEXT = {
  es: {
    seoTitle: "FunnelCOD | Crea páginas que venden en minutos",
    seoDescription:
      "Crea páginas simples para vender contra entrega. Publica rápido, recibe pedidos y gestiona todo desde un solo lugar.",
    nav: {
      features: "Funciones",
      how: "Cómo funciona",
      testimonials: "Testimonios",
      pricing: "Precios",
      faq: "Preguntas",
      language: "Idioma",
      signIn: "Ingresar",
      start: "Comenzar gratis",
    },
    hero: {
      badge: "Especial para ventas contra entrega",
      title: "Crea páginas que venden todos los días",
      highlight: "sin complicarte",
      description:
        "Diseña tu oferta, publica tu enlace y recibe pedidos en minutos. Todo pensado para que tu cliente entienda y compre rápido.",
      cta: "Quiero empezar",
      cta2: "Ver panel",
      points: ["Sin tarjeta", "Listo para móvil", "Publicación con 1 clic"],
      stats: [
        ["3x", "Más pedidos en campañas activas"],
        ["10 min", "Para lanzar tu primera página"],
        ["24/7", "Recibiendo órdenes"],
      ],
    },
  },
  en: {
    seoTitle: "FunnelCOD | Build pages that sell in minutes",
    seoDescription:
      "Create simple pages for Cash on Delivery sales. Publish fast, collect orders, and manage everything in one place.",
    nav: {
      features: "Features",
      how: "How it works",
      testimonials: "Testimonials",
      pricing: "Pricing",
      faq: "FAQ",
      language: "Language",
      signIn: "Sign in",
      start: "Start free",
    },
    hero: {
      badge: "Built for Cash on Delivery sales",
      title: "Build pages that drive daily sales",
      highlight: "without complexity",
      description:
        "Design your offer, publish your link, and collect orders in minutes. Built so customers understand and buy faster.",
      cta: "Start now",
      cta2: "View dashboard",
      points: ["No credit card", "Mobile-ready", "1-click publish"],
      stats: [
        ["3x", "More orders in active campaigns"],
        ["10 min", "To launch your first page"],
        ["24/7", "Order collection"],
      ],
    },
  },
} as const;

const FEATURES = {
  es: [
    {
      tag: "Editor visual",
      title: "Arrastra, suelta y publica en minutos",
      description:
        "Construye tu página sin código. Cambia textos, imágenes y botones en una interfaz rápida.",
      checks: ["Bloques listos", "Vista móvil y escritorio", "Edición por clic"],
      alt: "Editor visual para crear funnels de venta",
    },
    {
      tag: "Formulario COD",
      title: "Captura pedidos completos",
      description:
        "Formulario simple con validación para evitar errores y pedidos incompletos.",
      checks: ["Nombre, ciudad y dirección", "Cantidad con total", "Validaciones claras"],
      alt: "Formulario de compra contra entrega",
    },
    {
      tag: "Tablero de órdenes",
      title: "Controla tus pedidos en un solo lugar",
      description:
        "Busca, filtra y cambia estados para operar rápido y con mayor orden.",
      checks: ["Estados por etapa", "Búsqueda por cliente", "Vista limpia"],
      alt: "Dashboard con pedidos y métricas",
    },
  ],
  en: [
    {
      tag: "Visual editor",
      title: "Drag, drop and publish in minutes",
      description:
        "Build your page without code. Update text, images and buttons in a fast workflow.",
      checks: ["Ready blocks", "Mobile and desktop preview", "Click-to-edit"],
      alt: "Visual editor for sales funnels",
    },
    {
      tag: "COD form",
      title: "Capture complete orders",
      description:
        "Simple form with validation to reduce mistakes and incomplete orders.",
      checks: ["Name, city and address", "Quantity with total", "Clear validation"],
      alt: "Cash on Delivery order form",
    },
    {
      tag: "Orders dashboard",
      title: "Manage orders from one place",
      description:
        "Search, filter and update statuses to run your operation with clarity.",
      checks: ["Status by stage", "Search by customer", "Clean interface"],
      alt: "Orders and sales dashboard",
    },
  ],
} as const;

const HOW_STEPS = {
  es: [
    ["01", "Crea tu funnel", "Elige un nombre y se generan tus páginas base."],
    ["02", "Personaliza tu oferta", "Edita textos, imágenes y precio en segundos."],
    ["03", "Publica tu enlace", "Actívalo con un clic y compártelo en campañas."],
    ["04", "Gestiona pedidos", "Controla cada orden desde tu panel."],
  ],
  en: [
    ["01", "Create your funnel", "Set a name and base pages are generated."],
    ["02", "Customize your offer", "Edit copy, images and pricing in seconds."],
    ["03", "Publish your link", "Go live in one click and share it anywhere."],
    ["04", "Manage orders", "Track every order inside your dashboard."],
  ],
} as const;

const STORIES = {
  es: [
    ["María Rojas", "@maria_codshop", "Subí mi página y al día siguiente ya tenía pedidos.", "1.2 mil"],
    ["Daniel Pérez", "@dan_pedidos", "Ahora sé qué oferta convierte mejor y dónde mejorar.", "986"],
    ["Valentina Cruz", "@valen.store", "La gente entiende rápido la oferta y compra más.", "1.8 mil"],
    ["Javier Soto", "@javi_cod", "Pasé de mensajes sueltos a pedidos bien organizados.", "764"],
  ],
  en: [
    ["Maria Rojas", "@maria_codshop", "I launched my page and got orders the next day.", "1.2K"],
    ["Daniel Perez", "@dan_orders", "Now I know which offer converts best.", "986"],
    ["Valentina Cruz", "@valen.store", "People understand the offer fast and buy more.", "1.8K"],
    ["Javier Soto", "@javi_cod", "I moved from random chats to structured orders.", "764"],
  ],
} as const;

const PRICING = {
  es: [
    ["Inicio", "Gratis", "Para validar tu primera oferta", ["1 funnel", "Editor completo", "Soporte por correo"]],
    ["Pro", "$29/mes", "Para campañas activas", ["Funnels ilimitados", "Gestión avanzada", "Soporte prioritario"]],
    ["Escala", "$79/mes", "Para equipos", ["Accesos por equipo", "Panel extendido", "Atención preferente"]],
  ],
  en: [
    ["Starter", "Free", "For your first offer", ["1 funnel", "Full editor", "Email support"]],
    ["Pro", "$29/mo", "For active campaigns", ["Unlimited funnels", "Advanced orders", "Priority support"]],
    ["Scale", "$79/mo", "For teams", ["Team access", "Extended panel", "Premium support"]],
  ],
} as const;

const FAQ = {
  es: [
    ["¿Necesito saber diseño o programación?", "No. El editor es visual y directo."],
    ["¿Funciona bien en celular?", "Sí. Incluye vista móvil y diseño responsive real."],
    ["¿Dónde veo los pedidos?", "En la sección de órdenes con filtros por estado."],
    ["¿Puedo comenzar gratis?", "Sí, puedes lanzar tu primer funnel sin pagar."],
  ],
  en: [
    ["Do I need coding skills?", "No. The editor is visual and straightforward."],
    ["Is it mobile friendly?", "Yes. It includes mobile preview and responsive layout."],
    ["Where do I see orders?", "In the Orders section with status filters."],
    ["Can I start for free?", "Yes, you can launch your first funnel at no cost."],
  ],
} as const;

function upsertMeta(attribute: "name" | "property", key: string, value: string) {
  let node = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.setAttribute("content", value);
}

function upsertCanonical(url: string) {
  let node = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!node) {
    node = document.createElement("link");
    node.rel = "canonical";
    document.head.appendChild(node);
  }
  node.href = url;
}

function InstagramCard({
  item,
}: {
  item: { name: string; user: string; text: string; likes: string; image: string };
}) {
  return (
    <article className="w-[280px] shrink-0 rounded-2xl bg-gradient-to-br from-fuchsia-500/60 via-amber-300/50 to-cyan-400/60 p-[1px]">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/95">
        <img src={item.image} alt={item.name} className="h-56 w-full rounded-t-2xl object-cover" />
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-3">
            <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-100">{item.name}</p>
              <p className="truncate text-xs text-slate-400">{item.user}</p>
            </div>
          </div>
          <p className="text-sm text-slate-200">{item.text}</p>
          <div className="flex items-center justify-between text-slate-400">
            <span className="inline-flex items-center gap-1 text-xs">
              <Heart className="h-3.5 w-3.5" /> {item.likes}
            </span>
            <span className="inline-flex items-center gap-2 text-xs">
              <MessageCircle className="h-3.5 w-3.5" />
              <Send className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "es";
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "en" ? "en" : "es";
  });

  const t = TEXT[language];
  const features = FEATURES[language];
  const steps = HOW_STEPS[language];
  const stories = STORIES[language];
  const pricing = PRICING[language];
  const faq = FAQ[language];
  const navItems = [
    ["features", t.nav.features],
    ["how-it-works", t.nav.how],
    ["testimonials", t.nav.testimonials],
    ["pricing", t.nav.pricing],
    ["faq", t.nav.faq],
  ] as const;

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    document.title = t.seoTitle;
    upsertMeta("name", "description", t.seoDescription);
    upsertMeta("property", "og:title", t.seoTitle);
    upsertMeta("property", "og:description", t.seoDescription);
    upsertMeta("property", "og:type", "website");
    upsertMeta(
      "property",
      "og:image",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    );
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", t.seoTitle);
    upsertMeta("name", "twitter:description", t.seoDescription);
    upsertMeta(
      "name",
      "twitter:image",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    );
    upsertCanonical(`${window.location.origin}/`);
  }, [t]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  const stepLabel = language === "es" ? "Paso" : "Step";
  const rightsLabel = language === "es" ? "Todos los derechos reservados." : "All rights reserved.";

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600">
              <Layers className="h-4 w-4 text-white" />
            </span>
            <span className="text-sm font-bold tracking-tight sm:text-base">FunnelCOD</span>
          </button>

          <div className="hidden items-center gap-6 lg:flex">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className="text-sm text-slate-300 transition-colors hover:text-cyan-300"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <label htmlFor="lang-switcher" className="sr-only">
              {t.nav.language}
            </label>
            <select
              id="lang-switcher"
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-2.5 text-sm text-slate-100"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-200 hover:bg-slate-800 hover:text-white"
              onClick={() => navigate("/dashboard")}
            >
              {t.nav.signIn}
            </Button>
            <Button size="sm" className="btn-gradient" onClick={() => navigate("/dashboard")}>
              {t.nav.start} <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-100 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t border-slate-800/80 bg-slate-950/95 px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-900"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <label htmlFor="lang-switcher-mobile" className="sr-only">
                {t.nav.language}
              </label>
              <select
                id="lang-switcher-mobile"
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                className="h-9 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 text-sm text-slate-100"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
              <Button size="sm" className="btn-gradient" onClick={() => navigate("/dashboard")}>
                {t.nav.start}
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:pt-36">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
          </div>
          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                {t.hero.badge}
              </span>
              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl xl:text-6xl">
                {t.hero.title}{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  {t.hero.highlight}
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">{t.hero.description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button size="lg" className="btn-gradient rounded-xl px-7 py-6 text-base font-semibold" onClick={() => navigate("/dashboard")}>
                  {t.hero.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-slate-700 bg-slate-900/70 px-7 py-6 text-base text-slate-100 hover:bg-slate-800"
                  onClick={() => navigate("/dashboard")}
                >
                  {t.hero.cta2}
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                {t.hero.points.map((point) => (
                  <span key={point} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-cyan-300" />
                    {point}
                  </span>
                ))}
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {t.hero.stats.map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                    <p className="text-xl font-bold text-cyan-300">{value}</p>
                    <p className="mt-1 text-xs text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1 }} className="relative">
              <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-[0_30px_60px_-25px_rgba(14,165,233,0.55)]">
                <img src={heroImage} alt="Editor visual de FunnelCOD" className="h-full w-full object-cover" />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300/90">{t.nav.features}</p>
              <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                {language === "es" ? "Todo lo que necesitas para vender mejor" : "Everything you need to sell better"}
              </h2>
            </div>
            <div className="space-y-10">
              {features.map((feature, index) => (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5 md:p-7"
                >
                  <div className="grid items-center gap-8 lg:grid-cols-2">
                    <div className={cn(index % 2 === 1 && "order-2 lg:order-1")}>
                      <img src={FEATURE_IMAGES[index]} alt={feature.alt} className="h-64 w-full rounded-2xl border border-slate-700 object-cover md:h-80" loading="lazy" />
                    </div>
                    <div className={cn(index % 2 === 1 && "order-1 lg:order-2", "space-y-4")}>
                      <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                        {feature.tag}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                      <p className="text-slate-300">{feature.description}</p>
                      <div className="space-y-2">
                        {feature.checks.map((item) => (
                          <p key={item} className="flex items-start gap-2 text-sm text-slate-200">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                            <span>{item}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-800 bg-gradient-to-r from-sky-200/15 via-slate-900 to-amber-200/20 p-7 md:p-10">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300/90">{t.nav.how}</p>
              <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                {language === "es" ? "Lanza tu funnel COD en 4 pasos simples" : "Launch your COD funnel in 4 simple steps"}
              </h2>
            </div>
            <div className="relative mt-14 hidden lg:block">
              <div className="absolute left-14 right-14 top-12 border-t-2 border-dashed border-slate-500/70" />
              <div className="grid grid-cols-4 gap-4">
                {steps.map(([step, title, description], index) => (
                  <div key={step} className="text-center">
                    <div
                      className={cn(
                        "mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-slate-200/60 shadow-lg",
                        [
                          "bg-[#dbeafe] text-slate-900",
                          "bg-[#bae6fd] text-slate-900",
                          "bg-[#fde68a] text-slate-900",
                          "bg-[#bbf7d0] text-slate-900",
                        ][index],
                      )}
                    >
                      <div>
                        <p className="text-sm">{stepLabel}</p>
                        <p className="text-3xl font-bold leading-none">{step}</p>
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                    <p className="mx-auto mt-2 max-w-[220px] text-sm text-slate-300">{description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 grid gap-4 lg:hidden">
              {steps.map(([step, title, description], index) => (
                <div key={step} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex h-11 w-11 items-center justify-center rounded-full font-bold",
                        [
                          "bg-[#dbeafe] text-slate-900",
                          "bg-[#bae6fd] text-slate-900",
                          "bg-[#fde68a] text-slate-900",
                          "bg-[#bbf7d0] text-slate-900",
                        ][index],
                      )}
                    >
                      {step}
                    </span>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300/90">{t.nav.testimonials}</p>
              <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                {language === "es" ? "Historias reales de tiendas que venden más" : "Real stories from stores selling more"}
              </h2>
            </div>
            <div className="mt-10 space-y-4">
              {[false, true].map((reverse) => (
                <div
                  key={String(reverse)}
                  className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
                >
                  <div
                    className={cn(
                      "flex w-max items-stretch gap-4 py-2",
                      reverse ? "animate-marquee-right" : "animate-marquee-left",
                    )}
                  >
                    {[...stories, ...stories].map(([name, user, text, likes], index) => (
                      <InstagramCard
                        key={`${user}-${index}`}
                        item={{ name, user, text, likes, image: AVATARS[index % AVATARS.length] }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-800 bg-slate-900/60 p-7 md:p-10">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300/90">{t.nav.pricing}</p>
              <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                {language === "es" ? "Empieza gratis y escala cuando vendas más" : "Start free and scale as you grow"}
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {pricing.map(([name, price, detail, points], index) => (
                <article
                  key={name}
                  className={cn(
                    "rounded-2xl border p-5",
                    index === 1
                      ? "border-cyan-300/60 bg-slate-950 shadow-[0_14px_30px_-12px_rgba(34,211,238,0.55)]"
                      : "border-slate-700 bg-slate-950/60",
                  )}
                >
                  <p className="text-sm font-semibold text-cyan-300">{name}</p>
                  <p className="mt-2 text-3xl font-black text-white">{price}</p>
                  <p className="mt-1 text-sm text-slate-400">{detail}</p>
                  <div className="mt-4 space-y-2">
                    {points.map((point) => (
                      <p key={point} className="flex gap-2 text-sm text-slate-200">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                        <span>{point}</span>
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                className="btn-gradient rounded-xl px-8 py-6 text-base font-semibold"
                onClick={() => navigate("/dashboard")}
              >
                {language === "es" ? "Crear mi cuenta gratis" : "Create my free account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section id="faq" className="px-4 pb-24 pt-12 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300/90">{t.nav.faq}</p>
              <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                {language === "es" ? "Respuestas rápidas para empezar hoy" : "Quick answers before you start"}
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {faq.map(([question, answer]) => (
                <article key={question} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <h3 className="text-base font-semibold text-white">{question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
              <Layers className="h-4 w-4 text-white" />
            </span>
            <span className="text-sm font-semibold text-slate-200">FunnelCOD</span>
          </div>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} FunnelCOD. {rightsLabel}
          </p>
        </div>
      </footer>
    </div>
  );
}
