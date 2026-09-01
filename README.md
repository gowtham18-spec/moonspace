# LunarLink Journeys

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import Head from 'next/head';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Text, Sphere, Box, Trail, Float, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
Rocket, Calendar, ShieldCheck, Star, MapPin, ChevronRight, Menu, X,
Globe, Moon as MoonIcon, Clock, CreditCard, CheckCircle, Users,
Camera, Hotel, Sparkles, ArrowRight, Shield, Zap, Radio,
ChevronDown, Instagram, Twitter, Linkedin, Mail, Phone
} from 'lucide-react';
import * as THREE from 'three';

// --- 3D Components ---

const StarField = ({ count = 5000 }) => {
const ref = useRef(null);

const particles = useMemo(() => {
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
positions[i * 3] = (Math.random() - 0.5) * 200;
positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

const color = new THREE.Color();  
  color.setHSL(Math.random() * 0.2 + 0.5, 0.8, Math.random() * 0.5 + 0.5);  
  colors[i * 3] = color.r;  
  colors[i * 3 + 1] = color.g;  
  colors[i * 3 + 2] = color.b;  
}  
return { positions, colors };

}, [count]);

useFrame(({ clock }) => {
if (ref.current) {
ref.current.rotation.y = clock.getElapsedTime() * 0.02;
ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
}
});

return (

);
};

const Earth = () => {
const meshRef = useRef(null);
const [hovered, setHovered] = useState(false);

const texture = useMemo(() => {
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 256;
const ctx = canvas.getContext('2d')!;
const gradient = ctx.createLinearGradient(0, 0, 512, 256);
gradient.addColorStop(0, '#1e3a8a');
gradient.addColorStop(0.5, '#3b82f6');
gradient.addColorStop(1, '#1e40af');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 512, 256);
// Add continents
ctx.fillStyle = '#10b981';
for (let i = 0; i < 20; i++) {
ctx.beginPath();
ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 40 + 20, 0, Math.PI * 2);
ctx.fill();
}
const texture = new THREE.CanvasTexture(canvas);
return texture;
}, []);

useFrame(({ clock }) => {
if (meshRef.current) {
meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
}
});

return (
 setHovered(true)} onPointerOut={() => setHovered(false)}>

{hovered && (




Earth Spaceport




)}
{/* Atmosphere glow */}

);
};

const Moon3D = ({ onLocationClick }: { onLocationClick?: (loc: string) => void }) => {
const meshRef = useRef(null);
const [hoveredPoint, setHoveredPoint] = useState(null);

const texture = useMemo(() => {
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 256;
const ctx = canvas.getContext('2d')!;
ctx.fillStyle = '#94a3b8';
ctx.fillRect(0, 0, 512, 256);
// Add craters
ctx.fillStyle = '#64748b';
for (let i = 0; i < 50; i++) {
ctx.beginPath();
ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 15 + 5, 0, Math.PI * 2);
ctx.fill();
}
return new THREE.CanvasTexture(canvas);
}, []);

useFrame(() => {
if (meshRef.current) {
meshRef.current.rotation.y += 0.002;
}
});

const locations = [
{ position: [1.2, 0.5, 1.8], label: "Apollo 11 Site", color: "#f59e0b" },
{ position: [-1.5, 0.8, 1.2], label: "Lunar Hotel", color: "#06b6d4" },
{ position: [0.8, -1.2, 1.5], label: "Dark Side Observatory", color: "#8b5cf6" },
{ position: [-0.5, 1.5, 0.8], label: "Artemis Base", color: "#ec4899" },
];

return (


{/* Glow effect */}  
    
      
      
    

  {locations.map((loc, i) => (  
      
        
         setHoveredPoint(i)}  
          onPointerOut={() => setHoveredPoint(null)}  
          onClick={() => onLocationClick?.(loc.label)}  
        >  
            
            
          
          
            
            
          
        {hoveredPoint === i && (  
            
            

  
              {loc.label}  
            

  
            
        )}  
        
      
  ))}  
    
    
    
    


);
};

const SpaceShuttle = () => {
const groupRef = useRef(null);

useFrame(({ clock }) => {
if (groupRef.current) {
groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
}
});

return (

{/* Main body /}

{/ Windows /}

{/ Wings /}

{/ Engine glow */}

);
};

// --- UI Components ---

const Section = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) => (

  

  
    {children}  
  

  
);  const GlassCard = ({ children, className = "", hover = false }: { children: React.ReactNode, className?: string, hover?: boolean }) => (

  

  
    {children}  
  

  
);  const NeonButton = ({ children, onClick, primary = false, className = "", icon: Icon }: { children: React.ReactNode, onClick?: () => void, primary?: boolean, className?: string, icon?: any }) => (
 

{children}  
{Icon && }  
{primary && (  
  

  
)}


);

const SectionTitle = ({ title, highlight, subtitle }: { title: string, highlight: string, subtitle?: string }) => (

  

  
      
      {subtitle}  
      
      
      {title} {highlight}  
      
      
  

  
);  // --- Main Page Component ---

export default function LunarLink() {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [bookingStep, setBookingStep] = useState(1);
const [bookingData, setBookingData] = useState({
date: '',
package: 'standard',
passengers: 1,
name: '',
email: ''
});
const [selectedLocation, setSelectedLocation] = useState(null);
const [activeFaq, setActiveFaq] = useState(null);

const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

const scrollToSection = (id: string) => {
setIsMenuOpen(false);
const element = document.getElementById(id);
element?.scrollIntoView({ behavior: 'smooth' });
};

const navItems = [
{ label: 'Technology', id: 'technology' },
{ label: 'Journey', id: 'journey' },
{ label: 'Activities', id: 'activities' },
{ label: 'Explore', id: 'explore' },
{ label: 'Safety', id: 'safety' },
{ label: 'Book Now', id: 'booking', primary: true }
];

return (







{/* Progress Bar */}  
    

  {/* Navigation */}  
    
    

  
      

  
         scrollToSection('hero')}  
          whileHover={{ scale: 1.02 }}  
        >  
          

  
            

  
            

  
                
            

  
          

  
          

  
              
              LUNARLINK  
              
            Transport Systems  
          

  
          
          
        

  
          {navItems.map((item) => (  
             scrollToSection(item.id)}  
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${  
                item.primary   
                  ? 'bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30'   
                  : 'text-slate-300 hover:text-cyan-400 hover:bg-white/5'  
              }`}  
            >  
              {item.label}  
              
          ))}  
        

  

         setIsMenuOpen(!isMenuOpen)}   
          className="lg:hidden p-2 text-white hover:text-cyan-400 transition-colors"  
        >  
          {isMenuOpen ?  : }  
          
      

  
    

  

    {/* Mobile Menu */}  
      
      {isMenuOpen && (  
          
          

  
            {navItems.map((item, idx) => (  
               scrollToSection(item.id)}  
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all ${  
                  item.primary   
                    ? 'bg-cyan-500 text-black'   
                    : 'text-slate-300 hover:text-cyan-400 hover:bg-white/5'  
                }`}  
              >  
                {item.label}  
                
            ))}  
          

  
          
      )}  
      
  

  

  {/* Hero Section */}  
  

  
    

  
      

  
          
          
          
          
          
      

  
    

  
      
    

  
        
        

  
            
              
              
            
          NOW BOARDING: FLIGHT LL-2026  
        

  
          
        

  
          The First 
  
            
            Passenger Transport  
            
          
  
          Earth to Moon  
        

  
          
        

  
          Experience the future of travel with LunarLink.   
           4-hour direct flights from Earth Spaceport to the Lunar Surface.  
        

  
          
        

  
           scrollToSection('booking')} icon={Rocket}>  
            Book Moon Trip  
            
           scrollToSection('technology')} icon={ChevronRight}>  
            Explore Mission  
            
        

  

          
          

  
              
            4h Transit  
          

  
          

  
          

  
              
            99.9% Safety  
          

  
          

  
          

  
              
            500+ Travelers  
          

  
          
        
    

  

    {/* Scroll Indicator */}  
      
      Scroll  
        
      
  

  

  {/* Technology Section */}  
  

  
    

  
        
        
      

  
          
            
            

  
              

  
                  
              

  
              

  
                

Earth Spaceport

  
                

  
                  Located in geostationary orbit at 35,786 km altitude. Features zero-gravity terminals,   
                  luxury lounges, and our patented magnetic launch rails for silent, emission-free departures.  
                

  
              

  
            

  
            

            
            

  
              

  
                  
              

  
              

  
                

Fusion Drive Shuttles

  
                

  
                  Our 4th-generation shuttles utilize compact fusion reactors achieving 0.3G continuous acceleration.   
                  Magnetic confinement technology reduces travel time to just 3.8 hours.  
                

  
              

  
            

  
            

            
            

  
              

  
                  
              

  
              

  
                

Lunar Orbital Station

  
                

  
                  The Gateway to the Moon. Features rotating gravity rings, observation decks,   
                  and direct shuttle connections to surface habitats every 30 minutes.  
                

  
              

  
            

  
            
          

          
          

  
            
            

  
            

  
              

  
                

  
                

  
                    
                

  
              

  
              

  
                

SYSTEM STATUS

  
                

ALL SYSTEMS NOMINAL

  
              

  
              

  
                {[  
                  { label: 'Velocity', value: '28,000', unit: 'km/h' },  
                  { label: 'Altitude', value: '384,400', unit: 'km' },  
                  { label: 'ETA', value: '3.8', unit: 'hrs' }  
                ].map((stat, i) => (  
                  

  
                    

{stat.value}

  
                    

{stat.label}

  
                    

{stat.unit}

  
                  

  
                ))}  
              

  
            

  
            
          
      

  
    

  
  

  

  {/* Journey Timeline */}  
  

  
    

  
        

      

  
        

  
          
        

  
          {[  
            {   
              step: "01",   
              title: "Earth Spaceport",   
              desc: "Arrive at our orbital terminal. Final safety briefing, suit fitting, and zero-gravity orientation in our luxury lounges.",  
              icon: ,  
              color: "cyan"  
            },  
            {   
              step: "02",   
              title: "Boarding",   
              desc: "Enter the Lunar Shuttle via the transparent docking tube. Secure yourself in your personalized acceleration pod.",  
              icon: ,  
              color: "blue"  
            },  
            {   
              step: "03",   
              title: "Launch & Travel",   
              desc: "Experience 3G acceleration as we break orbit. Watch Earth recede through panoramic smart-glass windows.",  
              icon: ,  
              color: "purple"  
            },  
            {   
              step: "04",   
              title: "Lunar Approach",   
              desc: "Witness the dark side of the Moon before descending. AI-guided precision landing at Armstrong Landing Zone.",  
              icon: ,  
              color: "pink"  
            },  
            {   
              step: "05",   
              title: "Surface Exploration",   
              desc: "Step onto the lunar surface. Visit observation domes, experience 1/6th gravity, and begin your adventure.",  
              icon: ,  
              color: "orange"  
            }  
          ].map((item, idx) => (  
              
              

  
                  
                  

  
                    {item.step}  
                    

  
                      {item.icon}  
                    

  
                  

  
                  

{item.title}

  
                  

{item.desc}

  
                  
              

  
                
              

  
                {item.step}  
              

  
                
              

  
              
          ))}  
        

  
      

  
    

  
  

  

  {/* Activities Section */}  
  

  
    

  
        
        
      

  
        {[  
          {   
            title: "Low Gravity Walking",   
            desc: "Experience 1/6th Earth gravity in our safely enclosed lunar parks.",  
            icon: ,  
            color: "from-cyan-500 to-blue-600"  
          },  
          {   
            title: "Earth Observatory",   
            desc: "Witness the Blue Marble rising over the lunar horizon in 4K clarity.",  
            icon: ,  
            color: "from-blue-500 to-purple-600"  
          },  
          {   
            title: "Lunar Hotel Stay",   
            desc: "Luxury accommodations with Earth-view suites and gourmet dining.",  
            icon: ,  
            color: "from-purple-500 to-pink-600"  
          },  
          {   
            title: "Space Photography",   
            desc: "Professional photo sessions on the surface with Earth as backdrop.",  
            icon: ,  
            color: "from-pink-500 to-orange-600"  
          }  
        ].map((activity, idx) => (  
            
              
              

  
                

  
                  

  
                    {activity.icon}  
                  

  
                

  
              

  
              

{activity.title}

  
              

{activity.desc}

  
              
            
        ))}  
      

  
    

  
  

  

  {/* Interactive 3D Moon */}  
  

  
    

  
      

  
          
          
          
          
          
          
      

  
    

  
      
    

  
      

  
          
            
            

  
                 
              Explore the Surface  
            

  
            

  
              Rotate and zoom the Moon model. Hover over the glowing markers to discover   
              tourist attractions. Click to select your destination.  
            

  
              
            {selectedLocation && (  
                
                

SELECTED DESTINATION

  
                

{selectedLocation}

  
                
            )}  

            

  
              

Key Locations

  
              {[  
                { color: "#f59e0b", label: "Apollo 11 Site" },  
                { color: "#06b6d4", label: "Lunar Hotel" },  
                { color: "#8b5cf6", label: "Dark Side Observatory" },  
                { color: "#ec4899", label: "Artemis Base" }  
              ].map((loc, i) => (  
                

  
                    
                  {loc.label}  
                

  
              ))}  
            

  

            

  
               scrollToSection('booking')}>  
                Book This Tour  
                
            

  
            
          
      

  
    

  
  

  

  {/* Booking System */}  
  

  
    

  
        

        
        {/* Progress Steps */}  
        

  
          

  
          

  
          {[1, 2, 3].map((step) => (  
            

  
              

= step   
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'   
                  : 'bg-slate-800 text-slate-500 border border-slate-700'  
              }`}>  
                {bookingStep > step ?  : step}  
              

  
              = step ? 'text-cyan-400' : 'text-slate-600'  
              }`}>  
                {step === 1 ? 'Details' : step === 2 ? 'Package' : 'Confirm'}  
                
            

  
          ))}  
        

  

        {/* Form Content */}  
        

  
            
            {bookingStep === 1 && (  
                
                

  
                  

  
                    Full Name  
                     setBookingData({...bookingData, name: e.target.value})}  
                    />  
                  

  
                  

  
                    Email Address  
                    @example.com"  
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"  
                      value={bookingData.email}  
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}  
                    />  
                    
                  

                

  
                  

  
                    Departure Date  
                     setBookingData({...bookingData, date: e.target.value})}  
                    />  
                  

  
                  

  
                    Passengers  
                    

  
                      {[1, 2, 3, 4].map(num => (  
                         setBookingData({...bookingData, passengers: num})}  
                          className={`flex-1 h-14 rounded-xl font-bold text-lg transition-all ${  
                            bookingData.passengers === num   
                              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'   
                              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-500'  
                          }`}  
                        >  
                          {num}  
                          
                      ))}  
                    

  
                  

  
                

  

                

  
                   setBookingStep(2)}   
                    icon={ArrowRight}  
                    className={(!bookingData.name || !bookingData.email) ? 'opacity-50 cursor-not-allowed' : ''}  
                  >  
                    Continue  
                    
                

  
                
            )}  

            {bookingStep === 2 && (  
                
                

  
                  {[  
                    {   
                      id: 'standard',   
                      name: 'Standard Pod',   
                      price: '$250,000',   
                      features: ['Window View', 'Basic Rations', 'Shared Lounge', 'Standard Seat'],  
                      color: 'cyan'  
                    },  
                    {   
                      id: 'luxury',   
                      name: 'Luxury Suite',   
                      price: '$450,000',   
                      features: ['Panoramic Window', 'Gourmet Dining', 'Private Cabin', 'Zero-G Spa', 'Priority Boarding'],  
                      color: 'purple',  
                      popular: true  
                    },  
                    {   
                      id: 'vip',   
                      name: 'Pioneer Class',   
                      price: '$1,200,000',   
                      features: ['Command Deck View', 'Personal Butler', 'Surface EVA Suit', 'Private Airlock', 'Lifetime Membership'],  
                      color: 'pink'  
                    }  
                  ].map((pkg) => (  
                    

 setBookingData({...bookingData, package: pkg.id})}  
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${  
                        bookingData.package === pkg.id   
                          ? `border-${pkg.color}-500 bg-${pkg.color}-500/10 shadow-lg`   
                          : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'  
                      }`}  
                    >  
                      {pkg.popular && (  
                        

  
                          MOST POPULAR  
                        

  
                      )}  
                      

  
                        

  
                          

{pkg.name}

  
                          

Per person

  
                        

  
                        {pkg.price}  
                      

  
                      

  
                        {pkg.features.map((f, i) => (  
                            
                              
                            {f}  
                            
                        ))}  
                      

  
                    

  
                  ))}  
                

  
                

  
                   setBookingStep(1)} className="text-slate-400 hover:text-white font-medium px-6">Back  
                   setBookingStep(3)} icon={ArrowRight}>Review  
                

  
                
            )}  

            {bookingStep === 3 && (  
                
                

  
                  

Booking Summary

  
                  

  
                    

  
                      Passenger  
                      {bookingData.name}  
                    

  
                    

  
                      Date  
                      {bookingData.date || 'Not selected'}  
                    

  
                    

  
                      Passengers  
                      {bookingData.passengers}  
                    

  
                    

  
                      Class  
                      {bookingData.package}  
                    

  
                  

  
                  

  
                    Total Amount  
                      
                      ${bookingData.package === 'standard' ? '250,000' : bookingData.package === 'luxury' ? '450,000' : '1,200,000'}  
                      
                  

  
                

  

                

  
                    
                  

Your booking is protected by our comprehensive travel insurance. By confirming, you agree to the Lunar Travel Terms & Conditions and Safety Protocols.

  
                

  

                

  
                   setBookingStep(2)} className="text-slate-400 hover:text-white font-medium px-6">Back  
                   {  
                      alert(`Booking Confirmed!\n\nThank you ${bookingData.name} for choosing LunarLink.\n\nYour journey to the Moon is scheduled. Check your email (${bookingData.email}) for boarding passes and pre-flight instructions.\n\nSee you in space! 🚀`);  
                      setBookingStep(1);  
                      setBookingData({ date: '', package: 'standard', passengers: 1, name: '', email: '' });  
                    }}   
                    icon={CreditCard}  
                  >  
                    Confirm & Pay  
                    
                

  
                
            )}  
            
          
        
      
    

  {/* Safety & Technology */}  
  

  
    

  
        

      

  
        {[  
          {   
            title: "AI Navigation",   
            desc: "Quantum-computing assisted trajectory planning with 99.99% accuracy. Real-time course corrections using deep space sensor arrays.",  
            icon: ,  
            stat: "99.99%",  
            statLabel: "Accuracy"  
          },  
          {   
            title: "Radiation Shielding",   
            desc: "Triple-layer electromagnetic barriers and hydrogen-rich composite hulls protect passengers from cosmic radiation and solar flares.",  
            icon: ,  
            stat: "0%",  
            statLabel: "Exposure"  
          },  
          {   
            title: "Emergency Systems",   
            desc: "Multi-stage escape pods with autonomous re-entry capability. Direct link to 3 orbital rescue stations and Earth-based command.",  
            icon: ,  
            stat: "<2min",  
            statLabel: "Response"  
          }  
        ].map((item, idx) => (  
            
              
              

  
                

  
                  {item.icon}  
                

  
                

  
                  

{item.stat}

  
                  

{item.statLabel}

  
                

  
              

  
              

{item.title}

  
              

{item.desc}

  
              
            
        ))}  
      

  

      {/* Testimonials */}

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://moonspace.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ea066b38-4ee7-43e9-9616-2e01d2a37632).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
