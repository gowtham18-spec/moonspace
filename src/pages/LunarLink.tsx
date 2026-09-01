import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Rocket, Calendar, ShieldCheck, Star, MapPin, ChevronRight, Menu, X,
  Globe, Clock, CreditCard, CheckCircle, Users,
  Camera, Hotel, Sparkles, ArrowRight, Shield, Zap, Radio,
  ChevronDown
} from 'lucide-react';
import HeroScene from '@/components/3d/HeroScene';
import MoonScene from '@/components/3d/MoonScene';
import CosmicBackground from '@/components/CosmicBackground';


// --- UI Primitives ---

const GlassCard = ({ children, className = "", hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
  <motion.div
    whileHover={hover ? { y: -5, scale: 1.02 } : {}}
    className={`glass-card ${hover ? 'glass-card-hover' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

const NeonButton = ({ children, onClick, primary = false, className = "", icon: Icon }: {
  children: React.ReactNode; onClick?: () => void; primary?: boolean; className?: string; icon?: React.ElementType;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`${primary ? 'neon-button-primary' : 'neon-button-secondary'} flex items-center gap-2 ${className}`}
  >
    {children}
    {Icon && <Icon className="w-5 h-5" />}
  </motion.button>
);

const SectionTitle = ({ title, highlight, subtitle }: { title: string; highlight: string; subtitle?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center mb-16"
  >
    {subtitle && <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">{subtitle}</p>}
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display">
      {title} <span className="text-gradient-primary">{highlight}</span>
    </h2>
  </motion.div>
);

// --- Main Component ---

const MoonSpaceSystem = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '', package: 'standard', passengers: 1, name: '', email: ''
  });
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Technology', id: 'technology' },
    { label: 'Journey', id: 'journey' },
    { label: 'Activities', id: 'activities' },
    { label: 'Explore', id: 'explore' },
    { label: 'Safety', id: 'safety' },
    { label: 'Book Now', id: 'booking', primary: true },
  ];

  const techCards = [
    { icon: <Globe className="w-8 h-8 text-primary" />, title: "Earth Spaceport", desc: "Located in geostationary orbit at 35,786 km altitude. Features zero-gravity terminals, luxury lounges, and our patented magnetic launch rails for silent, emission-free departures." },
    { icon: <Rocket className="w-8 h-8 text-secondary" />, title: "Fusion Drive Shuttles", desc: "Our 4th-generation shuttles utilize compact fusion reactors achieving 0.3G continuous acceleration. Magnetic confinement technology reduces travel time to just 3.8 hours." },
    { icon: <Star className="w-8 h-8 text-accent" />, title: "Lunar Orbital Station", desc: "The Gateway to the Moon. Features rotating gravity rings, observation decks, and direct shuttle connections to surface habitats every 30 minutes." },
  ];

  const journeySteps = [
    { step: "01", title: "Earth Spaceport", desc: "Arrive at our orbital terminal. Final safety briefing, suit fitting, and zero-gravity orientation in our luxury lounges.", icon: <MapPin className="w-6 h-6" />, color: "text-primary" },
    { step: "02", title: "Boarding", desc: "Enter the Lunar Shuttle via the transparent docking tube. Secure yourself in your personalized acceleration pod.", icon: <Rocket className="w-6 h-6" />, color: "text-secondary" },
    { step: "03", title: "Launch & Travel", desc: "Experience 3G acceleration as we break orbit. Watch Earth recede through panoramic smart-glass windows.", icon: <Zap className="w-6 h-6" />, color: "text-glow-purple" },
    { step: "04", title: "Lunar Approach", desc: "Witness the dark side of the Moon before descending. AI-guided precision landing at Armstrong Landing Zone.", icon: <Globe className="w-6 h-6" />, color: "text-accent" },
    { step: "05", title: "Surface Exploration", desc: "Step onto the lunar surface. Visit observation domes, experience 1/6th gravity, and begin your adventure.", icon: <Sparkles className="w-6 h-6" />, color: "text-glow-amber" },
  ];

  const activities = [
    { title: "Low Gravity Walking", desc: "Experience 1/6th Earth gravity in our safely enclosed lunar parks.", icon: <Users className="w-8 h-8" />, gradient: "from-primary to-secondary" },
    { title: "Earth Observatory", desc: "Witness the Blue Marble rising over the lunar horizon in 4K clarity.", icon: <Globe className="w-8 h-8" />, gradient: "from-secondary to-glow-purple" },
    { title: "Lunar Hotel Stay", desc: "Luxury accommodations with Earth-view suites and gourmet dining.", icon: <Hotel className="w-8 h-8" />, gradient: "from-glow-purple to-accent" },
    { title: "Space Photography", desc: "Professional photo sessions on the surface with Earth as backdrop.", icon: <Camera className="w-8 h-8" />, gradient: "from-accent to-glow-amber" },
  ];

  const safetyItems = [
    { title: "AI Navigation", desc: "Quantum-computing assisted trajectory planning with 99.99% accuracy. Real-time course corrections using deep space sensor arrays.", icon: <Zap className="w-8 h-8 text-primary" />, stat: "99.99%", statLabel: "Accuracy" },
    { title: "Radiation Shielding", desc: "Triple-layer electromagnetic barriers and hydrogen-rich composite hulls protect passengers from cosmic radiation and solar flares.", icon: <Shield className="w-8 h-8 text-secondary" />, stat: "0%", statLabel: "Exposure" },
    { title: "Emergency Systems", desc: "Multi-stage escape pods with autonomous re-entry capability. Direct link to 3 orbital rescue stations and Earth-based command.", icon: <Radio className="w-8 h-8 text-accent" />, stat: "<2min", statLabel: "Response" },
  ];

  const packages = [
    { id: 'standard', name: 'Standard Pod', price: '$250,000', features: ['Window View', 'Basic Rations', 'Shared Lounge', 'Standard Seat'], color: 'primary' },
    { id: 'luxury', name: 'Luxury Suite', price: '$450,000', features: ['Panoramic Window', 'Gourmet Dining', 'Private Cabin', 'Zero-G Spa', 'Priority Boarding'], color: 'secondary', popular: true },
    { id: 'vip', name: 'Pioneer Class', price: '$1,200,000', features: ['Command Deck View', 'Personal Butler', 'Surface EVA Suit', 'Private Airlock', 'Lifetime Membership'], color: 'accent' },
  ];

  return (
    <div className="relative bg-background text-foreground overflow-x-hidden">
      <CosmicBackground />
      {/* Progress Bar */}

      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-[60] origin-left" style={{ scaleX }} />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <motion.button onClick={() => scrollToSection('hero')} whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-left">
              <div className="font-display font-bold text-sm text-foreground">MOON SPACE</div>
              <div className="text-[10px] text-muted-foreground tracking-widest">System</div>
            </div>
          </motion.button>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  item.primary
                    ? 'bg-primary text-primary-foreground hover:opacity-90 hover:shadow-lg hover:shadow-primary/30'
                    : 'text-muted-foreground hover:text-primary hover:bg-muted/30'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-foreground hover:text-primary transition-colors">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      item.primary
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-primary hover:bg-muted/30'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" />
              <span className="text-sm text-muted-foreground font-display tracking-wider">NOW BOARDING: FLIGHT LL-2026</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-display leading-[0.95] mb-6"
          >
            The First{' '}
            <span className="text-gradient-primary block sm:inline">Passenger Transport</span>{' '}
            Earth to Moon
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Experience the future of travel with Moon Space System. 4-hour direct flights from Earth Spaceport to the Lunar Surface.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex flex-wrap gap-4 justify-center mb-12">
            <NeonButton primary onClick={() => scrollToSection('booking')} icon={Rocket}>Book Moon Trip</NeonButton>
            <NeonButton onClick={() => scrollToSection('technology')} icon={ChevronRight}>Explore Mission</NeonButton>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="flex justify-center gap-8 md:gap-12">
            {[
              { icon: <Clock className="w-5 h-5 text-primary" />, label: "4h Transit" },
              { icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, label: "99.9% Safety" },
              { icon: <Users className="w-5 h-5 text-secondary" />, label: "500+ Travelers" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                {stat.icon}
                <span>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground text-xs"
        >
          Scroll
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="Our Fleet" title="Cutting-Edge" highlight="Technology" />
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              {techCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <GlassCard hover className="p-6 flex gap-5">
                    <div className="shrink-0 w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-foreground mb-2">{card.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse-glow" />
                  <span className="text-xs font-display tracking-widest text-muted-foreground">SYSTEM STATUS</span>
                  <span className="ml-auto text-xs text-emerald-500 font-semibold">ALL SYSTEMS NOMINAL</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Velocity', value: '28,000', unit: 'km/h' },
                    { label: 'Altitude', value: '384,400', unit: 'km' },
                    { label: 'ETA', value: '3.8', unit: 'hrs' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 rounded-xl bg-muted/30">
                      <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                      <div className="text-[10px] text-primary">{stat.unit}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section id="journey" className="section-padding bg-muted/10">
        <div className="max-w-4xl mx-auto">
          <SectionTitle subtitle="Your Trip" title="The" highlight="Journey" />
          <div className="relative">
            <div className="timeline-line hidden md:block" />
            <div className="space-y-12">
              {journeySteps.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="hidden md:flex flex-col items-center shrink-0">
                    <span className={`text-xs font-display font-bold ${item.color}`}>{item.step}</span>
                    <div className={`w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mt-2 ${item.color}`}>
                      {item.icon}
                    </div>
                  </div>
                  <GlassCard hover className="p-6 flex-1">
                    <div className="flex items-center gap-2 md:hidden mb-2">
                      <span className={`text-xs font-display font-bold ${item.color}`}>{item.step}</span>
                      <div className={item.color}>{item.icon}</div>
                    </div>
                    <h3 className="text-lg font-display font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section id="activities" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="On The Moon" title="Lunar" highlight="Activities" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard hover className="p-6 text-center h-full">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${activity.gradient} flex items-center justify-center mb-5 text-foreground`}>
                    {activity.icon}
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-2">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground">{activity.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Moon Explorer */}
      <section id="explore" className="section-padding bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="Interactive" title="Explore The" highlight="Surface" />
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden border border-border/50">
              <div className="moon-aura pointer-events-none absolute inset-0 z-[1]" />
              <MoonScene onLocationClick={setSelectedLocation} />

            </div>

            <div className="space-y-6">
              <GlassCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-display font-bold text-foreground">Explore the Surface</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Rotate and zoom the Moon model. Hover over the glowing markers to discover tourist attractions. Click to select your destination.
                </p>

                {selectedLocation && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-3 mb-4">
                    <span className="text-[10px] text-muted-foreground tracking-widest">SELECTED DESTINATION</span>
                    <p className="font-display font-bold text-primary">{selectedLocation}</p>
                  </motion.div>
                )}

                <div className="space-y-3">
                  <p className="text-xs font-display tracking-widest text-muted-foreground">Key Locations</p>
                  {[
                    { color: "#f59e0b", label: "Apollo 11 Site" },
                    { color: "#06b6d4", label: "Lunar Hotel" },
                    { color: "#8b5cf6", label: "Dark Side Observatory" },
                    { color: "#ec4899", label: "Artemis Base" },
                  ].map((loc, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: loc.color }} />
                      {loc.label}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <NeonButton primary onClick={() => scrollToSection('booking')}>Book This Tour</NeonButton>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="section-padding">
        <div className="max-w-3xl mx-auto">
          <SectionTitle subtitle="Reserve Your Seat" title="Book Your" highlight="Journey" />

          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  bookingStep >= step
                    ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}>
                  {bookingStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                <span className={`text-sm hidden sm:inline ${bookingStep >= step ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step === 1 ? 'Details' : step === 2 ? 'Package' : 'Confirm'}
                </span>
                {step < 3 && <div className={`w-12 h-px ${bookingStep > step ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            ))}
          </div>

          <GlassCard className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {bookingStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                      <input
                        type="text"
                        placeholder="Commander Name"
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Departure Date</label>
                      <input
                        type="date"
                        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Passengers</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            onClick={() => setBookingData({ ...bookingData, passengers: num })}
                            className={`flex-1 h-14 rounded-xl font-bold text-lg transition-all ${
                              bookingData.passengers === num
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                : 'bg-muted/30 text-muted-foreground border border-border hover:border-muted-foreground/50'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <NeonButton
                      primary
                      onClick={() => setBookingStep(2)}
                      icon={ArrowRight}
                      className={(!bookingData.name || !bookingData.email) ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      Continue
                    </NeonButton>
                  </div>
                </motion.div>
              )}

              {bookingStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => setBookingData({ ...bookingData, package: pkg.id })}
                        className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                          bookingData.package === pkg.id
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-border bg-muted/20 hover:border-muted-foreground/50'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-[10px] font-bold px-3 py-1 rounded-full">
                            MOST POPULAR
                          </div>
                        )}
                        <div className="mb-4">
                          <h4 className="font-display font-bold text-foreground">{pkg.name}</h4>
                          <span className="text-xs text-muted-foreground">Per person</span>
                          <div className="text-2xl font-display font-bold text-primary mt-1">{pkg.price}</div>
                        </div>
                        <div className="space-y-2">
                          {pkg.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-4">
                    <button onClick={() => setBookingStep(1)} className="text-muted-foreground hover:text-foreground font-medium px-6">Back</button>
                    <NeonButton primary onClick={() => setBookingStep(3)} icon={ArrowRight}>Review</NeonButton>
                  </div>
                </motion.div>
              )}

              {bookingStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <GlassCard className="p-6">
                    <h3 className="font-display font-bold text-foreground mb-4">Booking Summary</h3>
                    <div className="space-y-3 text-sm">
                      {[
                        ['Passenger', bookingData.name],
                        ['Date', bookingData.date || 'Not selected'],
                        ['Passengers', String(bookingData.passengers)],
                        ['Class', bookingData.package],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-foreground font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="text-2xl font-display font-bold text-primary">
                        ${bookingData.package === 'standard' ? '250,000' : bookingData.package === 'luxury' ? '450,000' : '1,200,000'}
                      </span>
                    </div>
                  </GlassCard>

                  <div className="flex items-start gap-3 text-xs text-muted-foreground">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p>Your booking is protected by our comprehensive travel insurance. By confirming, you agree to the Lunar Travel Terms & Conditions and Safety Protocols.</p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button onClick={() => setBookingStep(2)} className="text-muted-foreground hover:text-foreground font-medium px-6">Back</button>
                    <NeonButton
                      primary
                      onClick={() => {
                        alert(`Booking Confirmed!\n\nThank you ${bookingData.name} for choosing Moon Space System.\n\nYour journey to the Moon is scheduled. Check your email (${bookingData.email}) for boarding passes and pre-flight instructions.\n\nSee you in space! 🚀`);
                        setBookingStep(1);
                        setBookingData({ date: '', package: 'standard', passengers: 1, name: '', email: '' });
                      }}
                      icon={CreditCard}
                    >
                      Confirm & Pay
                    </NeonButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>
      </section>

      {/* Safety */}
      <section id="safety" className="section-padding bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="Your Protection" title="Safety &" highlight="Technology" />
          <div className="grid md:grid-cols-3 gap-6">
            {safetyItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard hover className="p-6 h-full">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-display font-bold text-foreground">{item.stat}</div>
                      <div className="text-xs text-muted-foreground">{item.statLabel}</div>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Rocket className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">MOON SPACE</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Moon Space System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MoonSpaceSystem;
