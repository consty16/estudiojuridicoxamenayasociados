import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { 
  Scale, 
  FileText, 
  Car, 
  Heart, 
  ScrollText, 
  Calendar, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  MessageSquare, 
  Video,
  AlertCircle,
  ShieldCheck,
  Ban,
  Unlock,
  Building2,
  Home,
  Layers,
  Gavel,
  ShieldAlert,
  Lock,
  Coins
} from 'lucide-react';

// --- Utility ---
const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// --- Types ---
type ServiceType = 'Verbal' | 'Escrita' | 'Virtual';

interface BookingData {
  tipo: ServiceType | null;
  precio: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  area: string;
  descripcion: string;
  fecha: string | null;
  hora: string | null;
}

const supabase = createClient(
  'https://rhqdnhgyhvlvgcekauzh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJocWRuaGd5aHZsdmdjZWthdXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5Nzc2NTAsImV4cCI6MjA5NDU1MzY1MH0.Kzu8FQut_q49yyNPz1-ZKS7ajPJMIHRO-gBUZzV6CU4'
);

interface Review {
  id: number;
  nombre: string;
  estrellas: number;
  resena: string;
  created_at: string;
}

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-navy-dark/95 backdrop-blur-md px-6 md:px-12 py-3 flex justify-between items-center shadow-2xl">
    <button onClick={() => scrollTo('hero')} className="flex items-center">
      <img 
        src="/logo.png" 
        alt="Estudio Jurídico Xamena & Asociados" 
        className="h-12 md:h-16 w-auto object-contain scale-105"
        referrerPolicy="no-referrer"
      />
    </button>
    <ul className="hidden md:flex gap-8 items-center text-white/80">
      <li>
        <button onClick={() => scrollTo('precios')} className="text-[15px] font-normal uppercase tracking-wider hover:text-gold transition-colors">
          Honorarios
        </button>
      </li>
      <li>
        <button onClick={() => scrollTo('contacto')} className="text-[15px] font-normal uppercase tracking-wider hover:text-gold transition-colors">
          Nuestros Clientes
        </button>
      </li>
      <li>
        <button 
          onClick={() => scrollTo('turnos')}
          className="bg-[#e3dab5] text-navy-dark px-[17px] py-2 ml-0 text-[12px] uppercase tracking-wider rounded-sm font-bold hover:bg-gold-light transition-all"
        >
          Agendar Turno
        </button>
      </li>
    </ul>
  </nav>
);

const Hero = () => (
  <section id="hero" className="min-h-[85vh] bg-gradient-to-br from-navy-dark via-navy to-navy-mid flex items-center relative overflow-hidden pt-24 pb-10 md:pb-12">
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
    </div>
    
    <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center relative z-10">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-3 py-1 rounded-sm text-gold text-[10px] uppercase tracking-widest mb-6">
          <MapPin size={12} /> Tucumán · Argentina
        </div>
        <h1 className="font-serif text-5xl md:text-7xl font-normal text-[#e3dab5] leading-[1.1] mb-6">
          Asesoramiento<br />jurídico de<br />
          <span className="italic font-bold">confianza</span>
        </h1>
        <p className="text-white/70 text-lg font-light leading-relaxed mb-8 max-w-lg">
          En Xamena & Asociados brindamos soluciones legales precisas y personalizadas. 
          Defensa de sus derechos con experiencia, ética y compromiso.
        </p>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => scrollTo('turnos')} className="bg-[#e3dab5] text-navy-dark px-8 py-4 rounded-sm font-bold text-sm uppercase tracking-wider hover:bg-gold-light hover:-translate-y-1 transition-all flex items-center gap-2 shadow-lg shadow-gold/20">
            <Calendar size={18} /> Agendar Consulta
          </button>
          <button onClick={() => scrollTo('servicios')} className="bg-[#e3dab5] text-navy-dark px-8 py-4 rounded-sm font-bold text-sm uppercase tracking-wider hover:bg-gold-light hover:-translate-y-1 transition-all flex items-center gap-2 shadow-lg shadow-gold/20">
            Ver Servicios →
          </button>
        </div>
        
        <div className="mt-10 pt-6 border-t border-white/10 flex gap-10">
          <div><div className="font-serif text-3xl text-gold font-bold">16</div><div className="text-[10px] text-white/50 uppercase tracking-widest">Áreas de práctica</div></div>
          <div><div className="font-serif text-3xl text-gold font-bold">24h</div><div className="text-[10px] text-white/50 uppercase tracking-widest">Respuesta garantizada</div></div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="hidden md:flex justify-center"
      >
        <div className="w-96 h-96 bg-white/5 backdrop-blur-3xl rounded-[40px] rotate-12 flex items-center justify-center border border-white/10 relative">
          <div className="w-80 h-80 bg-gold/5 rounded-[30px] -rotate-12 absolute inset-0 m-auto border border-gold/10"></div>
          <Scale className="text-gold/30 w-40 h-40 -rotate-12" />
        </div>
      </motion.div>
    </div>
  </section>
);

const Services = () => {
  const list = [
    { id: 'penal', icon: <Scale size={28} />, title: 'Derecho Penal', desc: 'Defensa penal y representación en causas criminales.' },
    { id: 'civil', icon: <FileText size={28} />, title: 'Derecho Civil', desc: 'Contratos, responsabilidad civil y daños.' },
    { id: 'accidentes', icon: <Car size={28} />, title: 'Accidentes', desc: 'Reclamaciones por accidentes de tránsito y laborales.' },
    { id: 'familia', icon: <Heart size={28} />, title: 'Divorcios', desc: 'Divorcio vincular, custodia y alimentos.' },
    { id: 'sucesiones', icon: <ScrollText size={28} />, title: 'Sucesiones', desc: 'Declaratoria de herederos y testamentos.' },
    { id: 'veraz', icon: <ShieldCheck size={28} />, title: 'Afectación del Veraz', desc: 'Representación en la rectificación y limpieza de informes crediticios desactualizados.' },
    { id: 'multas', icon: <Ban size={28} />, title: 'Impugnación de Multas', desc: 'Eliminación y defensa contra actas de infracción y multas improcedentes.' },
    { id: 'lev-embargos', icon: <Unlock size={28} />, title: 'Levantamiento de Embargos', desc: 'Tramitación urgente para desafectar cuentas bancarias y bienes inmuebles bloqueados.' },
    { id: 'asesorias', icon: <Building2 size={28} />, title: 'Asesorías Empresariales', desc: 'Modelos corporativos preventivos, redacción de contratos y resolución institucional.' },
    { id: 'prescripcion', icon: <Home size={28} />, title: 'Prescripción Adquisitiva', desc: 'Regularización de dominio inmobiliario mediante posesión pacífica de largo plazo.' },
    { id: 'propiedad', icon: <Layers size={28} />, title: 'Propiedad Horizontal', desc: 'Gestión reglamentaria, deudas de expensas y disputas internas de consorcio.' },
    { id: 'medidas', icon: <Gavel size={28} />, title: 'Medidas Judiciales', desc: 'Precedentes procesales exigibles de carácter cautelar e inmediato.' },
    { id: 'allanamientos', icon: <ShieldAlert size={28} />, title: 'Allanamientos', desc: 'Defensa inmediata y control de legalidad en operativos policiales de registro.' },
    { id: 'lev-cautelar', icon: <Unlock size={28} />, title: 'Levantamiento de Cautelar', desc: 'Remoción de inhibiciones generales de bienes, afectaciones y trabas jurídicas.' },
    { id: 'embargos', icon: <Lock size={28} />, title: 'Embargos', desc: 'Medidas cautelares oportunas para el aseguramiento de créditos.' },
    { id: 'depositos', icon: <Coins size={28} />, title: 'Depósitos Judiciales', desc: 'Administración, cobro y custodia de remanentes liquidados en causas.' }
  ];

  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center gap-3 text-gold text-[11px] uppercase tracking-widest mb-4">
          <div className="w-8 h-px bg-gold"></div> Áreas de práctica
        </div>
        <h2 className="font-serif text-4xl md:text-5xl text-navy mb-6">Nuestros servicios jurídicos</h2>
        <p className="text-slate-500 max-w-xl mb-8 leading-loose">
          Contamos con especialistas en distintas ramas del derecho para ofrecerle la representación que su caso requiere en Tucumán.
        </p>

        <div className="mb-16 border-t border-b border-navy/10 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-4xl">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-gold mb-1">Especialistas del estudio</h4>
            <h3 className="font-serif text-2xl text-navy font-bold uppercase tracking-wide">Staff Profesional</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 md:gap-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#B39352] mb-1">Abogado</p>
              <p className="font-serif text-lg font-bold text-navy">Dr. Gustavo José Usandivaras</p>
                <a
                href="https://wa.me/5493813008877"
                target="_blank"
                className="text-gold-500 hover:underline"
                >
                📱 3813008877
                </a>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#B39352] mb-1">Abogado</p>
              <p className="font-serif text-lg font-bold text-navy">Dr. Santiago Luis Xamena</p>
               <a
               href="https://wa.me/5493815350413"
               target="_blank"
               className="text-gold-500 hover:underline"
               >
              📱 3815350413
              </a>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((s) => (
            <motion.div 
              key={s.id}
              whileHover={{ y: -5 }}
              className="bg-[#e3dab5] border border-border p-8 rounded-sm text-center group hover:border-navy transition-all relative overflow-hidden flex flex-col justify-between h-full"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <div>
                <div className="w-16 h-16 bg-navy text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold transition-colors">
                  {s.icon}
                </div>
                <h3 className="font-serif text-lg text-navy mb-3 font-bold">{s.title}</h3>
                <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Fees = () => (
  <section id="precios" className="py-24 bg-navy text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
    <div className="container mx-auto px-6 md:px-12 relative z-10">
      <div className="flex items-center gap-3 text-gold text-[11px] uppercase tracking-widest mb-4">
        <div className="w-8 h-px bg-gold"></div> Honorarios
      </div>
      <h2 className="font-serif text-4xl md:text-5xl mb-6">Tarifas de consulta</h2>
      <p className="text-white/60 max-w-xl mb-16">
        Honorarios sugeridos por el Colegio de Abogados de Tucumán, vigentes desde el 18 de abril de 2026.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { type: 'Verbal', icon: <MessageSquare />, price: '$ 335.500', desc: 'Atención presencial en nuestra oficina.' },
          { type: 'Escrita', icon: <FileText />, price: '$ 675.000', desc: 'Dictamen legal detallado por escrito.', featured: true },
          { type: 'Virtual', icon: <Video />, price: '$ 167.750', desc: 'Videollamada profesional segura.' },
        ].map((f, idx) => (
          <div key={idx} className={`p-10 rounded-sm border transition-all ${f.featured ? 'bg-gold/10 border-gold' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
            <div className="text-[#e3dab5] mb-6 text-3xl">{f.icon}</div>
            <h3 className="font-serif text-2xl mb-4 text-[#e3dab5]">{f.type}</h3>
            <p className="text-white/50 text-sm mb-8 leading-relaxed font-light">{f.desc}</p>
            <div className="font-serif text-4xl text-[#e3dab5] font-bold mb-2">{f.price}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest">Honorario Fijo</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Booking = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [data, setData] = useState<BookingData>({
    tipo: null, precio: '', nombre: '', apellido: '', telefono: '', email: '', area: '', descripcion: '', fecha: null, hora: null
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const services: {id: ServiceType, price: string, desc: string, icon: any}[] = [
    { id: 'Verbal', price: '$ 335.500', desc: 'Atención presencial en oficina.', icon: <MessageSquare size={32} /> },
    { id: 'Escrita', price: '$ 675.000', desc: 'Dictamen legal vía email.', icon: <FileText size={32} /> },
    { id: 'Virtual', price: '$ 167.750', desc: 'Videollamada profesional.', icon: <Video size={32} /> },
  ];

  const steps = [
    { id: 1, label: 'Tipo' },
    { id: 2, label: 'Área' },
    { id: 3, label: 'Fecha' },
    { id: 4, label: 'Pago' }
  ];

  const next = () => {
    if (step === 1 && !data.tipo) return;
    if (step === 2 && (!data.nombre || !data.apellido || !data.email || !data.area)) return;
    if (step === 3 && (!data.fecha || !data.hora)) return;
    setStep(s => s + 1);
  };
  const back = () => {
    setBookingError("");
    setStep(s => s - 1);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    return { days, offset };
  };

  const { days, offset } = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0,0,0,0);

  const formatMonth = (date: Date) => date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const renderCalendar = () => {
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(<div key={`empty-${i}`} className="h-10"></div>);
    for (let d = 1; d <= days; d++) {
      const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth()+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dt = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const isPast = dt < today;
      const isWeekend = dt.getDay() === 0 || dt.getDay() === 6;
      const isDisabled = isPast || isWeekend;
      const isSelected = data.fecha === dateString;
      cells.push(
        <button
          key={d}
          disabled={isDisabled}
          onClick={() => {
            setData({ ...data, fecha: dateString, hora: null });
            setBookingError("");
          }}
          className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center text-[13px] transition-all
            ${isDisabled ? 'text-slate-300 cursor-not-allowed' : 'text-navy hover:bg-navy/5 cursor-pointer'}
            ${isSelected ? 'bg-navy text-white font-bold' : ''}
          `}
        >
          {d}
        </button>
      );
    }
    return cells;
  };

  const handlePay = async () => {
    setLoading(true);
    setBookingError("");
    try {
      const response = await fetch("/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        setStep(5);
      } else if (response.status === 409) {
        setBookingError("El horario seleccionado ya se encuentra reservado. Por favor elija otro día u horario.");
      } else {
        setBookingError(result.error || "Error al procesar la reserva. Por favor, intente nuevamente.");
      }
    } catch (error) {
      console.error("Error en reserva:", error);
      setBookingError("Error de conexión al procesar la reserva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="turnos" className="py-24 bg-cream">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 text-gold text-[11px] uppercase tracking-widest mb-4">
            <div className="w-8 h-px bg-gold"></div> Reservas <div className="w-8 h-px bg-gold"></div>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-navy mb-4">Agendar una consulta</h2>
          <p className="text-slate-500">Elija su horario en el calendario y confirme su cita.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-sm border border-border shadow-2xl shadow-navy/5 overflow-hidden">
          <div className="bg-cream border-b border-border flex overflow-x-auto">
            {steps.map(s => (
              <div key={s.id} className={`flex-1 min-w-[100px] flex items-center gap-3 px-6 py-4 border-b-2 transition-all ${step === s.id ? 'border-gold text-navy font-bold text-center justify-center' : 'border-transparent text-slate-400'}`}>
                <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] ${step > s.id ? 'bg-gold text-navy-dark' : step === s.id ? 'bg-navy text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {step > s.id ? <Check size={10} /> : s.id}
                </div>
                <span className="uppercase text-[10px] tracking-widest hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="p-8 md:p-12 min-h-[480px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="p1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-serif text-2xl text-navy mb-8">¿Cómo desea realizar la consulta?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setData({ ...data, tipo: s.id, precio: s.price })}
                        className={`p-8 border-2 rounded-sm text-center transition-all flex flex-col items-center gap-4 group relative bg-[#e3dab5]
                          ${data.tipo === s.id ? 'border-navy-dark ring-2 ring-navy/20' : 'border-black/10 hover:border-navy-dark'}
                        `}
                      >
                        <div className="text-navy mb-2">{s.icon}</div>
                        <span className="font-serif text-lg text-navy font-bold">{s.id}</span>
                        <span className="text-navy font-extrabold text-xl">{s.price}</span>
                        <p className="text-navy/70 text-[12px] leading-relaxed">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="p2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-serif text-2xl text-navy mb-8">Sus datos y área legal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" value={data.nombre} onChange={e => setData({...data, nombre: e.target.value})} className="p-4 border border-border focus:border-navy outline-none" placeholder="Nombre" />
                    <input type="text" value={data.apellido} onChange={e => setData({...data, apellido: e.target.value})} className="p-4 border border-border focus:border-navy outline-none" placeholder="Apellido" />
                    <input type="tel" value={data.telefono} onChange={e => setData({...data, telefono: e.target.value})} className="p-4 border border-border focus:border-navy outline-none" placeholder="Teléfono" />
                    <input type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="p-4 border border-border focus:border-navy outline-none" placeholder="Email" />
                    <select value={data.area} onChange={e => setData({...data, area: e.target.value})} className="md:col-span-2 p-4 border border-border focus:border-navy outline-none bg-white">
                      <option value="">— Seleccionar Área —</option>
                      <option>Derecho Penal</option>
                      <option>Derecho Civil</option>
                      <option>Accidentes</option>
                      <option>Divorcios</option>
                      <option>Sucesiones</option>
                      <option>Medidas Judiciales</option>
                      <option>Allanamientos</option>
                      <option>Levantamiento de Cautelar</option>
                      <option>Embargos</option>
                      <option>Depósitos Judiciales</option>
                      <option>Afectación del Veraz</option>
                      <option>Impugnación de Multas</option>
                      <option>Levantamiento de Embargos</option>
                      <option>Asesorías Empresariales</option>
                      <option>Prescripción Adquisitiva</option>
                      <option>Propiedad Horizontal</option>
                    </select>
                    <textarea value={data.descripcion} onChange={e => setData({...data, descripcion: e.target.value})} className="md:col-span-2 p-4 border border-border focus:border-navy outline-none h-24" placeholder="Breve descripción..."></textarea>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="p3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-serif text-2xl text-navy mb-8">Día y horario</h3>
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="border border-border rounded-sm">
                      <div className="bg-navy text-white flex justify-between items-center p-4">
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth()-1)))}><ChevronLeft/></button>
                        <span className="font-serif capitalize">{formatMonth(currentMonth)}</span>
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth()+1)))}><ChevronRight/></button>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-7 text-[10px] text-slate-400 font-bold text-center mb-2">
                           {['L','M','M','J','V','S','D'].map((d,i)=><div key={i}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-y-2">{renderCalendar()}</div>
                      </div>
                    </div>
                    <div className={`space-y-4 ${!data.fecha ? 'opacity-20 pointer-events-none' : ''}`}>
                      <p className="text-navy font-bold text-sm">Horarios para el {data.fecha?.split('-').reverse().join('/')}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00'].map(t => (
                          <button key={t} onClick={()=>{
                            setData({...data, hora: t});
                            setBookingError("");
                          }} className={`p-3 border rounded-sm text-xs font-bold ${data.hora===t ? 'bg-gold border-gold text-navy-dark' : 'border-border hover:border-navy text-navy'}`}>{t} hs</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="p4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                  <h3 className="font-serif text-2xl text-navy mb-8">Confirmación</h3>
                  <div className="max-w-sm mx-auto bg-cream border border-border p-8 text-left space-y-4 mb-8 text-sm">
                    <div className="flex justify-between border-b pb-2"><span>Cliente:</span><span className="font-bold">{data.nombre} {data.apellido}</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Tipo:</span><span className="font-bold">{data.tipo}</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Fecha:</span><span className="font-bold font-serif">{data.fecha?.split('-').reverse().join('/')}</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Hora:</span><span className="font-bold font-serif">{data.hora} hs</span></div>
                    <div className="flex justify-between pt-2"><span className="font-bold text-navy">Total:</span><span className="text-gold text-2xl font-bold">{data.precio}</span></div>
                  </div>

                  {bookingError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-sm mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3 text-left"
                    >
                      <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                      <p className="text-red-800 text-[12px] font-medium leading-relaxed">
                        {bookingError}
                      </p>
                    </motion.div>
                  )}

                  <button onClick={handlePay} disabled={loading} className="bg-navy text-white px-12 py-4 rounded-sm font-bold hover:scale-105 transition-all shadow-xl shadow-navy/20 uppercase text-xs tracking-widest">
                    {loading ? 'Procesando...' : 'Reservar y obtener datos de transferencia'}
                  </button>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="p5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                   <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6"><Check size={32}/></div>
                   <h3 className="font-serif text-3xl text-navy mb-4">Reserva registrada correctamente</h3>
                   
                   <div className="max-w-md mx-auto bg-cream border border-border p-8 rounded-sm text-left mb-8 shadow-sm">
                     <p className="text-navy-dark text-sm mb-6 leading-relaxed">
                       Para confirmar su turno debe realizar la transferencia bancaria por el total de <strong>{data.precio}</strong>.
                     </p>
                     
                     <div className="space-y-4">
                       <div className="bg-white p-4 rounded-sm border border-border/50">
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Titular</p>
                         <p className="font-bold text-navy">Santiago Luis Xamena</p>
                       </div>
                       <div className="bg-white p-4 rounded-sm border border-border/50">
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Alias</p>
                         <p className="font-bold text-navy select-all">chanchi13.mp</p>
                       </div>
                       <div className="bg-white p-4 rounded-sm border border-border/50">
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">CVU</p>
                         <p className="font-mono text-navy text-xs select-all">0000003100096604181690</p>
                       </div>
                       <div className="bg-white p-4 rounded-sm border border-border/50">
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Método</p>
                         <p className="font-bold text-navy">Mercado Pago Transferencia</p>
                       </div>
                     </div>
                     
                     <div className="mt-6 border-t pt-4">
                       <p className="text-[11px] text-slate-500 italic"><strong>IMPORTANTE:</strong> Enviar comprobante por WhatsApp para validar la reserva.</p>
                     </div>
                   </div>

                   <div className="flex flex-col gap-4 items-center">
                     <a 
                       href={`https://wa.me/5493814216898?text=${encodeURIComponent("Hola, ya realicé la transferencia de mi consulta jurídica. Adjunto comprobante.")}`}
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="bg-[#25d366] text-white px-10 py-5 rounded-sm font-bold text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-green-500/20 hover:scale-105 transition-all w-full max-w-sm justify-center"
                     >
                       <MessageSquare size={20} /> Enviar comprobante
                     </a>
                     <button onClick={() => setStep(1)} className="text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-navy transition-colors">Volver al inicio</button>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step < 5 && (
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
                <button onClick={back} disabled={step===1} className={`text-[11px] font-bold uppercase ${step===1?'opacity-0':'text-slate-400 hover:text-navy'}`}>Volver</button>
                {step < 4 && <button onClick={next} className="bg-navy text-white px-10 py-3 rounded-sm text-[11px] font-bold uppercase hover:bg-navy-dark">Continuar</button>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [nombre, setNombre] = useState('');
  const [resena, setResena] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    obtenerResenas();

    let channel: any = null;
    try {
      channel = supabase
        .channel('reviews-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'reviews'
          },
          (payload) => {
            setReviews((prev) => [payload.new as Review, ...prev]);
          }
        )
        .subscribe();
    } catch (err: any) {
      console.warn('Realtime subscription not available:', err);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const obtenerResenas = async () => {
    setErrorStatus(null);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al obtener reseñas de Supabase:', error);
        setErrorStatus(error.message || 'Error desconocido al solicitar datos');
      } else if (data) {
        setReviews(data);
      }
    } catch (e: any) {
      console.error('Excepción al obtener reseñas:', e);
      setErrorStatus(e.message || 'Error de red o conexión bloqueada');
    }
  };

  const enviarResena = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nombre || !resena) {
      alert('Complete todos los campos');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('reviews').insert([
        {
          nombre,
          estrellas,
          resena
        }
      ]);

      setLoading(false);

      if (error) {
        console.error('Error al insertar reseña en Supabase:', error);
        alert(`Error al enviar reseña: ${error.message} (${error.details || 'sin detalles'})`);
        return;
      }

      setNombre('');
      setResena('');
      setEstrellas(5);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, 7000);

      obtenerResenas();
    } catch (e: any) {
      setLoading(false);
      console.error('Excepción al insertar reseña:', e);
      alert(`Error de conexión al enviar la reseña: ${e.message || 'Error desconocido'}`);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-cream">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16">
        
        <div>
          <div className="flex items-center gap-3 text-gold text-[11px] uppercase tracking-widest mb-4">
            <div className="w-8 h-px bg-gold"></div>
            Nuestros Clientes
          </div>

          <h2 className="font-serif text-4xl text-navy mb-12">
            Reseñas
          </h2>

          <form onSubmit={enviarResena} className="space-y-4 mb-12">
            <div className="grid grid-cols-1 gap-4">
              
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="p-4 border border-border focus:border-navy outline-none bg-white text-sm"
                placeholder="Su nombre completo"
              />

              <textarea
                required
                value={resena}
                onChange={(e) => setResena(e.target.value)}
                className="p-4 border border-border focus:border-navy outline-none bg-white text-sm h-32"
                placeholder="Escriba su reseña aquí..."
              />

              <div>
                <p className="text-[11px] uppercase tracking-widest text-navy mb-3 font-bold">
                  Calificación
                </p>

                <div className="flex gap-2">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setEstrellas(star)}
                      className={`text-3xl transition-all ${
                        star <= estrellas
                          ? 'text-gold scale-110'
                          : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-navy text-white px-8 py-3 rounded-sm font-bold text-[11px] uppercase tracking-widest hover:bg-navy-dark transition-all self-start"
              >
                {loading ? 'Publicando...' : 'Publicar Reseña'}
              </button>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden mt-2"
                  >
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-sm text-xs font-semibold flex items-center gap-2 shadow-sm">
                      <span className="text-emerald-600 font-bold text-base">✓</span> 
                      Reseña publicada exitosamente
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-navy text-white rounded-sm flex items-center justify-center flex-shrink-0">
                <MapPin size={20}/>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-navy mb-1">
                  Dirección
                </h4>

                <p className="text-slate-500 text-sm">
                  Entre Ríos 489. Planta Baja, Oficina 2 · Tucumán
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2">
          
          {errorStatus && (
            <div className="bg-amber-50/80 border border-amber-200 text-amber-900 p-4 rounded-sm text-xs leading-relaxed shadow-sm">
              <p className="font-bold text-amber-800 mb-1 flex items-center gap-1">
                ⚠️ Conexión de Alerta
              </p>
              <p className="mb-2">No se pudieron cargar todas las reseñas debido a un límite de red o bloqueo de dominio en su navegador ({errorStatus}).</p>
              <p className="opacity-75">
                <strong>Consejo de solución:</strong> Si utiliza protección estricta (como pestañas privadas, Brave Shields o extensiones como uBlock Origin / Privacy Badger), por favor configure una excepción para permitir la lectura segura de datos de la base de datos de <strong>Supabase</strong>.
              </p>
            </div>
          )}

          {reviews.length === 0 && !errorStatus && (
            <div className="bg-white border border-border p-8 rounded-sm text-center text-slate-400">
              Aún no hay reseñas publicadas.
            </div>
          )}

          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-border p-6 rounded-sm shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-navy text-lg">
                  {review.nombre}
                </h4>

                <div className="flex text-gold text-lg">
                  {'★'.repeat(review.estrellas)}
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                {review.resena}
              </p>

              <div className="mt-4 text-[10px] uppercase tracking-widest text-slate-400">
                {new Date(review.created_at).toLocaleDateString('es-AR')}
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-gold selection:text-navy-dark">
      <Navbar />
      <Hero />
      <Services />
      <Fees />
      <Booking />
      <Contact />
      <footer className="bg-navy-dark text-white/40 py-4 text-center border-t border-white/5">
        <div className="container mx-auto px-6 text-white font-bold flex flex-col items-center">
          <img 
            src="/logo.png" 
            alt="Estudio Jurídico Xamena & Asociados" 
            style={{ width: '220.045px', height: '74.9931px', paddingLeft: '0px', marginLeft: '0px' }}
            className="object-contain mb-2 select-none"
            referrerPolicy="no-referrer"
          />
          <p className="text-[9px] mt-1 opacity-50 uppercase tracking-widest font-normal">Desarrollado por C DESIGN IA & CLAUDE CODE - CODEX</p>
        </div>
      </footer>
      <a
        href="https://wa.me/5493815350413?text=Bienvenido,%20te%20comunicaste%20con%20el%20estudio%20juridico%20Xamena%20y%20asociados.%20¿como%20podemos%20ayudarte?"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
