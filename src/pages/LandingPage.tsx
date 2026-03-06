import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers, ArrowRight, Check, Zap, BarChart3, Smartphone, Globe,
  ShoppingCart, CreditCard, MousePointer, Layout, Timer, Package,
  Star, Users, TrendingUp, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-editor.jpg';

const features = [
  {
    icon: MousePointer,
    label: 'Drag & Drop Builder',
    title: 'Build COD funnels faster!',
    description: 'Our funnel builder makes it easy to create product pages, order forms, and thank you pages. Use the drag-and-drop editor with pre-built components.',
    checks: ['Easy-to-use builder', 'Ready-to-use elements', 'Mobile responsive'],
  },
  {
    icon: CreditCard,
    label: 'Cash on Delivery',
    title: 'Optimized COD order forms',
    description: 'Collect orders with Cash on Delivery. Dynamic price calculation, quantity selectors, and order validation built-in.',
    checks: ['Smart order forms', 'Dynamic pricing', 'Order validation'],
  },
  {
    icon: BarChart3,
    label: 'Orders Dashboard',
    title: 'Track every order in real-time',
    description: 'View and manage all your COD orders from a single dashboard. Update status, filter orders, and track performance.',
    checks: ['Real-time order tracking', 'Status management', 'Search & filter'],
  },
  {
    icon: Globe,
    label: 'One-click Publish',
    title: 'Publish and share instantly',
    description: 'Publish your funnels with one click and share the link. Your pages load fast and look great on every device.',
    checks: ['Custom funnel URLs', 'Fast page speed', 'Mobile-optimized'],
  },
];

const stats = [
  { value: '10K+', label: 'Funnels Created', icon: Layers },
  { value: '$5M+', label: 'Revenue Processed', icon: TrendingUp },
  { value: '50K+', label: 'Orders Collected', icon: Package },
  { value: '2K+', label: 'Active Users', icon: Users },
];

const testimonials = [
  {
    name: 'Ahmed K.',
    role: 'COD Seller',
    text: 'COD Funnel Builder is the easiest tool I\'ve used for creating product landing pages. My conversion rate doubled!',
    avatar: 'A',
  },
  {
    name: 'Sarah M.',
    role: 'eCommerce Manager',
    text: 'Finally a funnel builder focused on Cash on Delivery. The order form is exactly what we needed.',
    avatar: 'S',
  },
  {
    name: 'Omar R.',
    role: 'Dropshipper',
    text: 'I switched from Shopify to this for my COD funnels. Setup took 10 minutes and orders started flowing in.',
    avatar: 'O',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Layers className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">COD Funnel Builder</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>Sign In</Button>
            <Button size="sm" className="btn-gradient" onClick={() => navigate('/dashboard')}>
              Try for free <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight"
          >
            Create high-converting{' '}
            <span className="text-primary">COD sales funnels</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Build high-performance Cash on Delivery funnels to increase your conversion rates,
            collect orders, and scale your eCommerce business.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <Button
              size="lg"
              className="btn-gradient text-base px-8 py-6 rounded-xl font-semibold"
              onClick={() => navigate('/dashboard')}
            >
              Start building for free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            {['Free to start', 'No credit card', 'Cancel anytime'].map(text => (
              <span key={text} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" />
                {text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-5xl mx-auto mt-16"
        >
          <div className="rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/10">
            <img
              src={heroImage}
              alt="COD Funnel Builder editor interface"
              className="w-full"
              loading="lazy"
            />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              The only platform you need to build<br />
              and scale your COD funnels.
            </h2>
          </div>

          <div className="space-y-24">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 }}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
              >
                <div className="flex-1 space-y-5">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 rounded-full px-3 py-1">
                    <feature.icon className="w-4 h-4" />
                    {feature.label}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  <div className="space-y-2.5">
                    {feature.checks.map(c => (
                      <div key={c} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="bg-secondary rounded-2xl h-64 lg:h-80 flex items-center justify-center">
                    <feature.icon className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-secondary/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16">
            Launch your COD funnel in 3 simple steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create Your Funnel', desc: 'Choose a name and set up your product details. We auto-generate product, order, and thank you pages.' },
              { step: '2', title: 'Customize Pages', desc: 'Use the visual editor to add headlines, images, countdown timers, and your COD order form.' },
              { step: '3', title: 'Publish & Collect Orders', desc: 'Hit publish and share your funnel URL. Orders flow into your dashboard instantly.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-elevated p-8 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-5">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Trusted by thousands of<br />COD sellers worldwide.
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-secondary/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Loved by COD sellers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-elevated p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to build your first COD funnel?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Start building for free. No credit card required.
          </p>
          <Button
            size="lg"
            className="btn-gradient text-base px-8 py-6 rounded-xl font-semibold"
            onClick={() => navigate('/dashboard')}
          >
            Get started for free <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            {['Free to start', 'No credit card', 'Cancel anytime'].map(text => (
              <span key={text} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Layers className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">COD Funnel Builder</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} COD Funnel Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
