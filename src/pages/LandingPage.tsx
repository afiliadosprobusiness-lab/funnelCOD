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
    <article className="w-[300px] shrink-0 snap-start rounded-3xl border border-slate-200 bg-white p-1 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)]">
      <div className="rounded-[1.35rem] border border-slate-100 bg-white">
        <SmartImage
          src={item.image}
          fallback={AVATAR_FALLBACK}
          alt={item.name}
          className="h-56 w-full rounded-t-[1.35rem] object-cover"
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
              <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
              <p className="truncate text-[11px] text-cyan-700">{item.role}</p>
              <p className="truncate text-xs text-slate-500">{item.user}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{item.text}</p>
          <div className="flex items-center justify-between text-slate-500">
            <span className="inline-flex items-center gap-1 text-xs">
              <Heart className="h-3.5 w-3.5 text-rose-500" /> {item.likes}
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
  const signInTarget = user ? "/dashboard" : "/auth";
  const startTarget = user ? "/dashboard" : "/auth?tab=register";
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
  const proofPills =
    language === "es"
      ? ["Equipos ecommerce", "Media buyers", "Tiendas COD", "Agencias performance"]
      : ["Ecommerce teams", "Media buyers", "COD stores", "Performance agencies"];
  const testimonialHint =
    language === "es" ? "Desliza o usa las flechas para navegar" : "Swipe or use arrows to navigate";
  const finalCtaTitle =
    language === "es" ? "¿Listo para lanzar tu primer funnel hoy?" : "Ready to launch your first funnel today?";
  const finalCtaDescription =
    language === "es"
      ? "Empieza gratis, publica rápido y centraliza tus pedidos COD en un solo panel."
      : "Start free, publish fast, and centralize your COD orders in one dashboard.";
  const heroImageAlt =
    language === "es"
      ? "Vista del editor visual de FunnelCOD"
      : "FunnelCOD visual editor interface preview";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f6f8fb] text-slate-900">
      <div className="pointer-events-none absolute inset-0 landing-grid-bg" />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_10px_24px_-14px_rgba(8,145,178,0.85)]">
              <Layers className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-sm font-bold tracking-tight text-slate-900 sm:text-base">FunnelCOD</span>
          </button>

          <div className="hidden items-center gap-6 lg:flex">
            {navItems.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
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
              className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 shadow-sm"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => navigate(signInTarget)}
            >
              {t.nav.signIn}
            </Button>
            <Button
              size="sm"
              className="border-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_14px_30px_-20px_rgba(2,132,199,0.8)] hover:from-cyan-500 hover:to-blue-500"
              onClick={() => navigate(startTarget)}
            >
              {t.nav.start} <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white/95 px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
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
                className="h-9 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
              <Button
                size="sm"
                className="border-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500"
                onClick={() => navigate(startTarget)}
              >
                {t.nav.start}
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="relative">
        <section className="px-4 pb-16 pt-28 sm:px-6 lg:pt-36">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="space-y-6"
            >
              <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700">
                {t.hero.badge}
              </span>
              <h1 className="font-display text-4xl font-extrabold leading-tight tracking-[-0.03em] text-slate-900 md:text-5xl xl:text-6xl">
                {t.hero.title}{" "}
                <span className="bg-gradient-to-r from-cyan-700 via-sky-600 to-blue-700 bg-clip-text text-transparent">
                  {t.hero.highlight}
                </span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">{t.hero.description}</p>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-xl border-0 bg-gradient-to-r from-cyan-600 to-blue-600 px-7 py-6 text-base font-semibold text-white shadow-[0_18px_32px_-22px_rgba(2,132,199,0.9)] hover:from-cyan-500 hover:to-blue-500"
                  onClick={() => navigate(startTarget)}
                >
                  {t.hero.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-slate-300 bg-white px-7 py-6 text-base text-slate-700 hover:bg-slate-50"
                  onClick={() => navigate(signInTarget)}
                >
                  {t.hero.cta2}
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                {t.hero.points.map((point) => (
                  <span key={point} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-cyan-700" />
                    {point}
                  </span>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {t.hero.stats.map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <p className="font-display text-2xl font-extrabold tracking-tight text-cyan-700">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2.1rem] bg-gradient-to-br from-cyan-400/20 via-sky-400/20 to-blue-500/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
                <img src={heroImage} alt={heroImageAlt} className="h-[430px] w-full rounded-[1.4rem] object-cover object-top" />
              </div>
              <div className="absolute -left-3 bottom-8 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl md:-left-8">
                <p className="font-display text-lg font-bold text-slate-900">+132%</p>
                <p className="text-xs text-slate-500">
                  {language === "es" ? "Mejora en conversión" : "Conversion uplift"}
                </p>
              </div>
              <div className="absolute -right-3 top-8 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 shadow-lg md:-right-7">
                <p className="font-display text-lg font-bold text-cyan-700">10 min</p>
                <p className="text-xs text-cyan-800">
                  {language === "es" ? "de idea a publicado" : "from idea to live"}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="mx-auto mt-10 max-w-6xl">
            <div className="flex flex-wrap items-center gap-2">
              {proofPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="px-4 py-20 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">{t.nav.testimonials}</p>
                <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  {language === "es" ? "Historias reales de tiendas que venden más" : "Real stories from stores selling more"}
                </h2>
                <p className="mt-3 text-sm text-slate-600">{testimonialHint}</p>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  onClick={() => moveTestimonials("left")}
                  aria-label={language === "es" ? "Mover testimonios a la izquierda" : "Move testimonials left"}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  onClick={() => moveTestimonials("right")}
                  aria-label={language === "es" ? "Mover testimonios a la derecha" : "Move testimonials right"}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative mt-8">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-20 bg-gradient-to-r from-[#f6f8fb] to-transparent md:block" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20 bg-gradient-to-l from-[#f6f8fb] to-transparent md:block" />

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

        <section id="features" className="px-4 py-20 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">{t.nav.features}</p>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {language === "es" ? "Todo lo que necesitas para vender mejor" : "Everything you need to sell better"}
              </h2>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-[0_18px_45px_-36px_rgba(15,23,42,0.45)]"
                >
                  <SmartImage
                    src={FEATURE_IMAGES[index]}
                    fallback={IMAGE_FALLBACK}
                    alt={feature.alt}
                    className="h-48 w-full object-cover"
                  />
                  <div className="space-y-4 p-6">
                    <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700">
                      {feature.tag}
                    </span>
                    <h3 className="font-display text-xl font-bold text-slate-900">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
                    <div className="space-y-2.5">
                      {feature.checks.map((item) => (
                        <p key={item} className="flex items-start gap-2 text-sm text-slate-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                          <span>{item}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_60px_-48px_rgba(15,23,42,0.5)] md:p-10">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">{t.nav.how}</p>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {language === "es" ? "Lanza tu funnel COD en 4 pasos simples" : "Launch your COD funnel in 4 simple steps"}
              </h2>
            </div>
            <div className="relative mt-10 grid gap-4 lg:grid-cols-4 lg:gap-6">
              {steps.map(([step, title, description], index) => (
                <div
                  key={step}
                  className={cn(
                    "rounded-2xl border p-5",
                    index % 2 === 0 ? "border-cyan-100 bg-cyan-50/60" : "border-blue-100 bg-blue-50/60",
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {stepLabel} {step}
                  </p>
                  <h3 className="font-display mt-2 text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-4 py-20 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 md:p-10">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">{t.nav.pricing}</p>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {language === "es" ? "Planes pensados para Perú y Latam" : "Plans designed for Peru and Latam"}
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-slate-600">
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
                      ? "border-cyan-200 bg-white shadow-[0_26px_48px_-38px_rgba(2,132,199,0.9)]"
                      : "border-slate-200 bg-white",
                  )}
                >
                  {badge && (
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">{badge}</p>
                  )}
                  <p className="font-display text-xl font-bold text-slate-900">{name}</p>
                  <p className="font-display mt-3 text-4xl font-black text-slate-900">
                    {price}
                    <span className="ml-1 text-base font-medium text-slate-500">{period}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{detail}</p>

                  <Button
                    className={cn(
                      "mt-4 w-full rounded-xl text-sm",
                      index === 1
                        ? "border-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500"
                        : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
                    )}
                    onClick={() => navigate(startTarget)}
                  >
                    {cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <div className="mt-5 space-y-2.5">
                    {points.map((point) => (
                      <p key={point} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
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
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">{t.nav.faq}</p>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {language === "es" ? "Respuestas rápidas para empezar hoy" : "Quick answers before you start"}
              </h2>
            </div>

            <Accordion type="single" collapsible className="mx-auto mt-10 max-w-4xl space-y-3">
              {faq.map(([question, answer], index) => (
                <AccordionItem
                  key={question}
                  value={`faq-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white px-5 data-[state=open]:border-cyan-300 data-[state=open]:bg-cyan-50/40"
                >
                  <AccordionTrigger className="py-4 text-left text-base font-semibold text-slate-900 hover:no-underline">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-600">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mx-auto mt-12 max-w-4xl rounded-[1.7rem] border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6 text-center shadow-[0_24px_45px_-38px_rgba(2,132,199,0.7)] md:p-8">
              <h3 className="font-display text-2xl font-bold text-slate-900">{finalCtaTitle}</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 md:text-base">{finalCtaDescription}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  className="rounded-xl border-0 bg-gradient-to-r from-cyan-600 to-blue-600 px-7 py-6 text-base font-semibold text-white hover:from-cyan-500 hover:to-blue-500"
                  onClick={() => navigate(startTarget)}
                >
                  {t.nav.start} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-slate-300 bg-white px-7 py-6 text-base text-slate-700 hover:bg-slate-50"
                  onClick={() => navigate(signInTarget)}
                >
                  {t.nav.signIn}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/70 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Layers className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-sm font-semibold text-slate-900">FunnelCOD</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} FunnelCOD. {rightsLabel}
          </p>
        </div>
      </footer>
    </div>
  );
}
