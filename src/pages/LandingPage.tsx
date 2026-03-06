import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Layers,
  Menu,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/hooks/use-auth";
import heroImage from "@/assets/hero-editor.jpg";

type Language = "es" | "en";

const LANGUAGE_STORAGE_KEY = "funnelcod_lang";
const IMAGE_FALLBACK = "/placeholder.svg";
const AVATAR_FALLBACK = "/avatar-placeholder.svg";

const FEATURE_IMAGES = [
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1551281044-8b1a8f0f59bd?auto=format&fit=crop&w=1600&q=80",
];

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
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
    ["María Rojas", "Fundadora - Tienda de belleza", "@maria_codshop", "Pasé de mensajes por WhatsApp a un flujo ordenado. El formulario COD me trae datos completos y cierro más rápido.", "1.2 mil"],
    ["Daniel Pérez", "Media Buyer", "@dan_pedidos", "Con el editor drag and drop publico variaciones en minutos. Ya no dependo de terceros para lanzar campañas.", "986"],
    ["Valentina Cruz", "Ecommerce Manager", "@valen.store", "La vista móvil me ayudó mucho. Mis clientes entienden mejor la oferta y se redujeron los pedidos incompletos.", "1.8 mil"],
    ["Javier Soto", "Operaciones COD", "@javi_cod", "Ahora muevo estados de pedido desde un solo tablero y puedo priorizar llamadas de confirmación sin perder tiempo.", "764"],
    ["Andrea López", "Vendedora - Moda", "@andrea_ventas", "Duplicar funnels para nuevas promos me ahorra horas por semana. El flujo de compra se ve mucho más profesional.", "1.4 mil"],
    ["Luis Campos", "Growth Partner", "@luiscod.pe", "Probamos tres versiones del mismo producto y encontramos la ganadora en dos días. El cambio se reflejó en conversión.", "552"],
  ],
  en: [
    ["Maria Rojas", "Founder - Beauty Store", "@maria_codshop", "I moved from random chat orders to a structured COD flow. Now I receive complete customer details every day.", "1.2K"],
    ["Daniel Perez", "Media Buyer", "@dan_orders", "The drag-and-drop editor lets me launch new variants in minutes without waiting on developers.", "986"],
    ["Valentina Cruz", "Ecommerce Manager", "@valen.store", "Mobile preview made a big difference. Customers understand the offer faster and finish the form.", "1.8K"],
    ["Javier Soto", "COD Operations", "@javi_cod", "With clear order statuses I prioritize confirmations better and my daily operation is much cleaner.", "764"],
    ["Andrea Lopez", "Fashion Seller", "@andrea_sales", "Duplicating funnels for each campaign saved us hours. The checkout flow now looks much more premium.", "1.4K"],
    ["Luis Campos", "Growth Partner", "@luiscod.pe", "We tested three funnel versions and found the winning one in two days. Conversion improved immediately.", "552"],
  ],
} as const;
const PRICING = {
  es: [
    [
      "Gratis",
      "US$ 0",
      "/mes",
      "Solo puedes crear el funnel, pero no publicarlo.",
      "Empezar gratis",
      ["Creacion de funnels", "Editor drag and drop", "Formulario COD", "No permite publicar funnels"],
    ],
    [
      "Pro",
      "US$ 9.9",
      "/mes",
      "Puede publicar hasta 2 funnels.",
      "Elegir Pro",
      ["Todo lo de Gratis", "Publicacion de hasta 2 funnels", "Gestion de pedidos", "Soporte por email"],
      "Mas popular",
    ],
    [
      "Master",
      "US$ 50",
      "/mes",
      "Funnels ilimitados.",
      "Elegir Master",
      ["Todo lo de Pro", "Publicacion ilimitada", "Prioridad de soporte", "Escalado para equipos"],
    ],
  ],
  en: [
    [
      "Free",
      "US$ 0",
      "/mo",
      "Create funnels only, publishing is disabled.",
      "Start free",
      ["Funnel creation", "Drag and drop editor", "COD form", "No funnel publishing"],
    ],
    [
      "Pro",
      "US$ 9.9",
      "/mo",
      "Can publish up to 2 funnels.",
      "Choose Pro",
      ["Everything in Free", "Up to 2 published funnels", "Order tracking", "Email support"],
      "Most popular",
    ],
    [
      "Master",
      "US$ 50",
      "/mo",
      "Unlimited published funnels.",
      "Choose Master",
      ["Everything in Pro", "Unlimited publishing", "Priority support", "Built for growing teams"],
    ],
  ],
} as const;
const FAQ = {
  es: [
    ["¿Necesito saber diseño o programación?", "No. El editor es visual y directo."],
    ["¿Funciona bien en celular?", "Sí. Incluye vista móvil y diseño responsive real."],
    ["¿Dónde veo los pedidos?", "En la sección de órdenes con filtros por estado."],
    ["¿Puedo comenzar gratis?", "Sí, puedes lanzar tu primer funnel sin pagar."],
    ["¿Hay comisión por venta?", "No. El alcance actual no aplica comisiones por pedido."],
    ["¿Puedo duplicar funnels?", "Sí. Desde dashboard puedes duplicar funnels y editar rápido."],
    ["¿El flujo es solo COD?", "Sí. Esta versión está enfocada en captura y gestión de pedidos COD."],
    ["¿Sirve para Perú y Latam?", "Sí. La propuesta comercial y precios están pensados para ese mercado."],
  ],
  en: [
    ["Do I need coding skills?", "No. The editor is fully visual and straightforward."],
    ["Is it mobile friendly?", "Yes. It includes real responsive behavior for mobile and desktop."],
    ["Where can I see my orders?", "Inside the Orders section, with status filters."],
    ["Can I start for free?", "Yes, you can launch your first funnel without paying."],
    ["Do you charge commission per sale?", "No. Current scope does not include sales commissions."],
    ["Can I duplicate funnels?", "Yes. Dashboard includes funnel duplication and quick editing."],
    ["Is this focused on COD flow?", "Yes. This version focuses on COD order capture and management."],
    ["Is it suitable for Peru and Latam?", "Yes. Pricing and positioning are aligned with this market."],
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

function SmartImage({
  src,
  alt,
  className,
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setCurrentSrc(fallback)}
    />
  );
}

function InstagramCard({
  item,
}: {
  item: { name: string; role: string; user: string; text: string; likes: string; image: string };
}) {
  return (
    <article className="w-[285px] shrink-0 snap-start rounded-2xl bg-gradient-to-br from-fuchsia-500/60 via-amber-300/50 to-cyan-400/60 p-[1px]">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/95">
        <SmartImage
          src={item.image}
          fallback={AVATAR_FALLBACK}
          alt={item.name}
          className="h-56 w-full rounded-t-2xl object-cover"
        />
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-3">
            <SmartImage
              src={item.image}
              fallback={AVATAR_FALLBACK}
              alt={item.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-100">{item.name}</p>
              <p className="truncate text-[11px] text-cyan-300">{item.role}</p>
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
  const user = useAuthUser();
  const testimonialsRef = useRef<HTMLDivElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "es";
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "en" ? "en" : "es";
  });

  const t = TEXT[language];
  const dashboardTarget = user ? "/dashboard" : "/auth";
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

  const moveTestimonials = (direction: "left" | "right") => {
    const slider = testimonialsRef.current;
    if (!slider) return;
    slider.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
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
              onClick={() => navigate(dashboardTarget)}
            >
              {t.nav.signIn}
            </Button>
            <Button size="sm" className="btn-gradient" onClick={() => navigate(dashboardTarget)}>
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
              <Button size="sm" className="btn-gradient" onClick={() => navigate(dashboardTarget)}>
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

          <div className="relative mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-4xl text-center"
            >
              <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                {t.hero.badge}
              </span>
              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl xl:text-6xl">
                {t.hero.title}{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  {t.hero.highlight}
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                {t.hero.description}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  className="btn-gradient rounded-xl px-7 py-6 text-base font-semibold"
                  onClick={() => navigate(dashboardTarget)}
                >
                  {t.hero.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-slate-700 bg-slate-900/70 px-7 py-6 text-base text-slate-100 hover:bg-slate-800"
                  onClick={() => navigate(dashboardTarget)}
                >
                  {t.hero.cta2}
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-300">
                {t.hero.points.map((point) => (
                  <span key={point} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-cyan-300" />
                    {point}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="mx-auto mt-12 max-w-5xl"
            >
              <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-[0_30px_60px_-25px_rgba(14,165,233,0.55)]">
                <img src={heroImage} alt="Editor visual de FunnelCOD" className="h-full w-full object-cover" />
              </div>
            </motion.div>

            <div className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-3">
              {t.hero.stats.map(([value, label]) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-center">
                  <p className="text-xl font-bold text-cyan-300">{value}</p>
                  <p className="mt-1 text-xs text-slate-400">{label}</p>
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
              <p className="mt-3 text-sm text-slate-300">
                {language === "es" ? "Desliza o usa las flechas para navegar" : "Swipe or use arrows to navigate"}
              </p>
            </div>

            <div className="relative mt-8">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-slate-950 to-transparent md:block" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-slate-950 to-transparent md:block" />
              <div className="absolute right-2 top-[-3.25rem] hidden items-center gap-2 md:flex">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                  onClick={() => moveTestimonials("left")}
                  aria-label={language === "es" ? "Mover testimonios a la izquierda" : "Move testimonials left"}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                  onClick={() => moveTestimonials("right")}
                  aria-label={language === "es" ? "Mover testimonios a la derecha" : "Move testimonials right"}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div
                ref={testimonialsRef}
                className="overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
                aria-label={language === "es" ? "Carrusel de testimonios" : "Testimonials carousel"}
              >
                <div className="flex w-max min-w-full gap-4 pr-4">
                  {stories.map(([name, role, user, text, likes], index) => (
                    <InstagramCard
                      key={user}
                      item={{ name, role, user, text, likes, image: AVATARS[index % AVATARS.length] }}
                    />
                  ))}
                </div>
              </div>
            </div>
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
                      <SmartImage
                        src={FEATURE_IMAGES[index]}
                        fallback={IMAGE_FALLBACK}
                        alt={feature.alt}
                        className="h-64 w-full rounded-2xl border border-slate-700 object-cover md:h-80"
                      />
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

        <section id="pricing" className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-800 bg-slate-900/60 p-7 md:p-10">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300/90">{t.nav.pricing}</p>
              <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                {language === "es" ? "Planes pensados para Perú y Latam" : "Plans designed for Peru and Latam"}
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-slate-300">
                {language === "es"
                  ? "Precios regionales y alcance realista según las funciones actuales del producto."
                  : "Regional pricing and realistic scope based on the current product features."}
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {pricing.map(([name, price, period, detail, cta, points, badge], index) => (
                <article
                  key={name}
                  className={cn(
                    "rounded-3xl border p-5",
                    index === 1
                      ? "border-cyan-300/60 bg-slate-950 shadow-[0_14px_30px_-12px_rgba(34,211,238,0.55)]"
                      : "border-slate-700 bg-slate-950/60",
                  )}
                >
                  {badge && (
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">{badge}</p>
                  )}
                  <p className="text-lg font-semibold text-white">{name}</p>
                  <p className="mt-3 text-4xl font-black text-white">
                    {price}
                    <span className="ml-1 text-base font-medium text-slate-300">{period}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-400">{detail}</p>

                  <Button
                    className={cn(
                      "mt-4 w-full rounded-xl text-sm",
                      index === 1 ? "btn-gradient" : "border border-cyan-400/50 bg-transparent hover:bg-cyan-500/10",
                    )}
                    onClick={() => navigate(dashboardTarget)}
                  >
                    {cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <div className="mt-5 space-y-2.5">
                    {points.map((point) => (
                      <p key={point} className="flex items-start gap-2 text-sm text-slate-200">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                        <span>{point}</span>
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="faq" className="px-4 pb-24 pt-12 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300/90">{t.nav.faq}</p>
              <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                {language === "es" ? "Respuestas rapidas para empezar hoy" : "Quick answers before you start"}
              </h2>
            </div>

            <Accordion type="single" collapsible className="mx-auto mt-10 max-w-4xl space-y-3">
              {faq.map(([question, answer], index) => (
                <AccordionItem
                  key={question}
                  value={`faq-${index}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 data-[state=open]:border-cyan-400/50 data-[state=open]:bg-slate-900"
                >
                  <AccordionTrigger className="py-4 text-left text-base font-semibold text-white hover:no-underline">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-300">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
