/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Heart, 
  Calendar, 
  Image as ImageIcon, 
  Mail, 
  MapPin, 
  Gift, 
  ChevronDown, 
  Copy, 
  Check,
  Church,
  PartyPopper,
  HomeIcon,
  Bold
} from 'lucide-react';
import song from './song.mp3';

// --- Constants & Assets ---
const WEDDING_DATE = new Date('2026-10-20T09:00:00');

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = targetDate.getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const IMAGES = {
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqs5zgkAdEDsDHfE7iEPHossGK23S6n6J0UzFsnFd7W6_QPOA1qKaTM06i2NLWIOU55rIh_0qNnvrzEFL9dEgPHj4Ab2oRDlEF9idNbvJFJV1HSA8JjxwGjgELpotK-5GTtIbTNbXwlgEtqn33_VWmj2CJnuZZZb0FLVx6BAHOq_vKwAWLa4jeQSlTPn9xtgFHYt8jhDzLXJ3hANbVeqlGg0oN4DBZirS7i1XDV9Af3TM6U7Ic4sWPvAHfsVa3wXTFDcp9a8gxPdU",
  clara: "https://lh3.googleusercontent.com/aida-public/AB6AXuDL2ONpi-z4IKBKxWakCqb8YdvULDD51HF0CrE_m-GW_6jVklloVJ0fvaynTmRzSRPu7hIfAPJfg0GCf8bkZ_PgHJhQnsXSUkULhIBuAXODNOmhPIS0o2uu8U80UQghzFAN_4tJQVJ-S_jqRsZEQItEXXFROB0BSiKxVyfgiuJK5XdRHLZ3Ak5EiVF0K4g3mcpTsHAH0Hw0hWC0eKsHwBbceXn2TcajvmrAsCPfGGo2cxdlhGPDKgBbC7TrmrBjwaBNrQj9bNtf10U",
  elias: "https://lh3.googleusercontent.com/aida-public/AB6AXuDau4jUDgZMNKwLtQVlaaRFyMwSgUspm15kE_-j_WEBxC3ox-k5OzHvCrTt47prdUcOOvrkCQft_LHqdvu2L5pgMuUocd4OrCiG8GDa3PZCmS98GPZi_IVVIbOEegweyzpZGi3Qfii3Q_Wek7LSkZN2URbSpdZEtNqAzzLLWpiNjkbCYEOtA8xWpo4ui9oipQZc4LuIiyueQ0c_N4HAUXCNTEqKYqfrHGIEpUi_J7GcyWc3jWa2egAxVOm2kkj3eSY1-qj0fK5Raas",
  journey: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDM3zBHjDuhOXGEU0yr5fUc1FnGnpebYRYo0WTW32QYuf99DcKh8kby9x3N1QaG7ih5Y1jkjOeP68dHamyM1MI4ez1arD6po7USJ8vRRjW4oURLK9In4rKopyNQk7I5jt9S3MHbpJ6Jg6O5M50irHifE6kxlZqNGcNlH1fh_HXz79ahsU7OeZ_eet6P0HeAv3Lkq_n912-RC3JsnHr8tcXfhA1dCuulr5ZOzFeZv3jfPZmd-iB20JQlXGNHPZcUCWlt1QlTWJbxm08",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBadBzr_19WoT6CcJskQ4hhNbQu_2t_7ADEqzIinJ6hsCphI12tVmri9bScSCrCKuv4nHqoiL24WHMpIEhXWDPSIlJE9WkaH4aR8s0-VRKHMDPnhtBIc0dqrXJL-c_RfCkvgqZ3z1XvwUT3xlIVSYtFhtfod3ZS0GgJehp2UG2-aSe12lQddB6pv--khOlY0sQU1IMBYPmxxNpmJPmtlWgBt3ambYjBQXe3SWGmLnNvt1FTeFPVO17fkYYCe7jkd4PCUajRV-uVqBM",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAjDh6Z5W2IIWoLyB_sziT4skfTRuIWyG9ANqIIB-FQ6Z0wP5fiH5xVLF1q38_0GxixICgkOZShX2qpJAaryVh071-3HvXUu6owRhLK2zQ5TX2Pidj7CS3VqFKxyRBUAaEyeAPRX13hhMzr_YI3x0HuEDEPWz75lIulQE9yH9rfTo5eszgsEjs9yWAYf52dZ5TzGL8fSHWYYVN4lF0px4sIbf7UR8nIzwiElWvfP3GSNHUq9Ggg5p-sJ_BBwsHJJYrgsnUCkXEkqyQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBVPUj1F0Z4fd3FyL5GfgRWWsfMHXdNY7yln_gHOVknA9FXKz_CqSP10f5JoSZ3gtFG1OmZvif4R1FSbcxhhjXNwYhyMmgZafad1S_tlkzy_BfYKewslX-zP6rKpWRnhp9ogb339ChaceTASaz3-oUhb1Tt7l57n94AKDPSVOBn8427bCxPtEyXfMgoeGPnVFWZpQhS8fwODYdP3QC1MXYTkarCuyxKv5e79vi2tdjjMP8Zf8xwa7M7KHEq-erooxFyxPRMmZzDC0A",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAt98RS9YRuT2tKOFIO56cw-j2N8cS6Z-OuP60Bi9KQX3wn98iXzNpjS2aoaXpxJomAo4aZM14KkXK4ZY4o2plN7WXPOzu0v52YtwIskWjhonxeibR-48kfKGPY2mF8J0ko6-xmq8RweR2-3C9xJiXNWzw_tCj6q3G54LLq3pc1UJChvEjuhVM2kIcMEyeHyqQ4KA3JhyahvlILMzWjF57ZJVa2KW7BNhxeSGJ215eNy1RbzC1nok7tj84wY1B5fsHKQg1gCUNEnHM",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA-JU3Vaf3Ih6LGAZZitlQKwkA6xkmazLDghKShE7qZqvs0whS6GRoFSpIFu8y68bmeTPeBsXRheK6voKxmpHLvvPKNml33GHJmEourlgmf0QWGVa4rHEM-DMz4gU_XQ0z-hhVzfn-miq4XxzF1dvp7LovyY5PWoa7q3TvXCe1ST1lPwHcMX9z9ty_Pit3U9RoRGnzoHlT3yek71UxTZvtDigPiF78XtS6AI9LIi11Fc0kF8hEF5n4aKgkmW8hdOQnMFaIUVE8ycfQ"
  ],
  akad: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqAKfkxKVS2_JPB7vykax3ylTx7unets4tZ46_ZGZicM3mIu0RjEoh75B8BoFchlANkVfExtE0uM0PZi56sCGyONfK-eHmP2xTTbK0d9vAjaqFiYWVWLesG0yQ6uV9ogPifbHSiFKZr7BQbrjwOXZSlEilsWFzDxzONNj80-Rbu4KrOJTEIBu0qo8PWS4Wsix4htOdkZ2GaWwqj_S3R6Jv32pC2fvNrw4Cd_AJhCYcoFz5Y-jdRdt67L2kuX63ixTDLLCoKdvWSI8",
  resepsi: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ4YiPPTp6Tsd4BbI5XZo_eB1LNAUPyU06hh1iL1JIZugpMeRZ-5bdlqpWjyEgi3J3NmN7rOLftld3OfBGX--R4rewSrutjusSyR7o-xbcnx_WnEAu-IqyaC54ozQgQUAxfIF0vwrXI4a1jG0oMX88T-QSk0R5xkfongRoKNSB_cFA086S4hm5x5dWwtEHmW2JQTfHu13WZraVINRhXD6tfZcvLztb-cjZPxdzk23PLGyQ0caX3oPkw88MKrJLxqgvrcD7o7tVsZg",
  map: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoDKBnIlmKTGB-GTj2eogTwsAAcUcWvJwu9RbFyVBecUPdFNOUYOJG8oVTILc0xvmFTarZehN62gSyti_fvGrfrjP7aeKFJQxFFly3GXVaSymuGIM8RXAvQkvhJ1xQPIZ3PXCLZ5oz_zqK3EWIhBuaNF9i0IR_O6Tj0yKVY98BrvvRoVBb23tuEDPFQfQTdV1ffE0nTUFfEROlLkkemG-kpmpe00Ka57bevdyEP7dsD1GqqpVHBz8xb5TnpVyC15wS3F5yTEa5KSI",
  flourish: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ7dtITvrmAqSOMTrPrGvZLzesgfqRCwHVULN0ByXo0B_m5axUjmA_zEdQrjud_C1CD25hXEX21OtonwWAYHX1--_iRmQzRIvc9akw-2-HnqBuhBOBjpdrrEanbEGMuu-RVm7KAJAxs0iMWeSWPYUdIBTK6W60cBejsgmJcL8BA8-HTL30PE1n9eTIYRNdtH9CCpwOF3zZ9dEaAgIlR6TIeaTYrS5cT34okuO67YTtV_dN8x8ze2jAAJvhBwRDrf3zxC0lHh9YO-I"
};

const STREET_VIEW_URL = 'https://www.google.com/maps/embed?pb=!4v1779045813382!6m8!1m7!1syO45pioB4D_DIrt83N5yaQ!2m2!1d-7.798259013961403!2d113.33984550379!3f84.36468!4f0!5f0.7820865974627469';
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/3DTdkrnYEGEGEU2k8';

// --- Helper Components ---

const SectionTitle = ({ overline, title, description, icon: Icon }: any) => (
  <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ duration: 0.55 }} className="text-center mb-12 flex flex-col items-center">
    {overline && <span className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-sage mb-2 uppercase">{overline}</span>}
    <h2 className="text-3xl sm:text-4xl md:text-5xl text-burgundy mb-4">{title}</h2>
    <div className="ornamental-divider w-48 mb-6">
      <span className="text-sage/40">
        {Icon ? <Icon size={20} /> : <Heart size={20} fill="currentColor" />}
      </span>
    </div>
    {description && <p className="text-charcoal/70 max-w-lg mx-auto italic">{description}</p>}
  </motion.div>
);

const CountdownItem = ({ label, value }: { label: string, value: number }) => (
  <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 border border-charcoal/10 min-w-[70px] sm:min-w-[80px]">
    <span className="block text-xl sm:text-2xl md:text-3xl font-serif text-burgundy">{value.toString().padStart(2, '0')}</span>
    <span className="block text-[8px] sm:text-[10px] font-semibold tracking-widest text-charcoal/60 uppercase">{label}</span>
  </div>
);

// --- Sections ---

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(WEDDING_DATE));
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(calculateTimeLeft(WEDDING_DATE));
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    setActiveTab('home');
  }, []);

  useEffect(() => {
    setIsMusicPlaying(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isMusicPlaying) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, [isMusicPlaying]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scrollToJoinUs = () => {
    document.getElementById('join-us')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden">
      <audio ref={audioRef} src={song} loop preload="auto" autoPlay playsInline />

      {/* Top Navbar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-gradient-to-b from-champagne/80 to-transparent backdrop-blur-[2px]">
        <div className="text-lg sm:text-xl font-serif tracking-widest text-burgundy">Zahra & Akbar</div>
        <button 
          onClick={() => setIsMusicPlaying((current) => !current)}
          aria-label={isMusicPlaying ? 'Matikan musik' : 'Nyalakan musik'}
          type="button"
          className={`group relative grid place-items-center rounded-full border border-white/50 px-3 py-3 text-burgundy shadow-[0_12px_30px_rgba(99,13,22,0.18)] backdrop-blur-md transition-all duration-300 overflow-hidden ${isMusicPlaying ? 'bg-gradient-to-br from-white/95 via-champagne/85 to-sage/20 ring-2 ring-white/70' : 'bg-gradient-to-br from-white/70 via-white/45 to-white/20 hover:from-white/85 hover:to-sage/10'}`}
        >
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_55%)] opacity-90" />
          <span className={`absolute inset-x-2 bottom-1 h-px rounded-full ${isMusicPlaying ? 'bg-burgundy/25' : 'bg-charcoal/10'}`} />
          <Music size={20} className={`relative z-10 transition-all duration-300 ${isMusicPlaying ? 'text-burgundy drop-shadow-[0_0_10px_rgba(99,13,22,0.35)]' : 'text-charcoal/45 group-hover:text-burgundy'}`} />
          <span className={`relative z-10 mt-1 text-[8px] font-semibold tracking-[0.25em] uppercase ${isMusicPlaying ? 'text-burgundy/70' : 'text-charcoal/45'}`}>{isMusicPlaying ? 'On' : 'Off'}</span>
        </button>
      </header>

      {/* Hero Section */}
      <motion.section id="home" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: 0.8 }} className="relative h-screen w-full flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full bg-cover bg-center opacity-40 grayscale-[20%]" 
            style={{ backgroundImage: `url(${IMAGES.hero})` }}
          />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-xs sm:text-sm font-semibold tracking-[0.4em] text-charcoal/60 mb-4 uppercase"
          >
            Pernikahan
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl sm:text-6xl md:text-8xl text-burgundy mb-6"
          >
            Zahra & Akbar
          </motion.h1>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-8 sm:w-12 bg-charcoal/20"></div>
            <Heart size={20} className="text-sage" fill="currentColor" />
            <div className="h-px w-8 sm:w-12 bg-charcoal/20"></div>
          </div>

          <p className="text-xl sm:text-2xl font-serif text-charcoal/100 italic mb-10">Minggu, 17 Oktober 2027</p>
          
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm sm:max-w-md mx-auto mb-10">
            <CountdownItem label="Hari" value={timeLeft.days} />
            <CountdownItem label="Jam" value={timeLeft.hours} />
            <CountdownItem label="Menit" value={timeLeft.minutes} />
            <CountdownItem label="Detik" value={timeLeft.seconds} />
          </div>

          <button type="button" onClick={scrollToJoinUs} className="bg-burgundy text-white px-8 py-3 tracking-widest text-xs font-semibold hover:bg-burgundy/90 transition-all uppercase shadow-lg shadow-burgundy/10">
            KEHADIRAN
          </button>
        </div>

        <div className="absolute bottom-10 animate-bounce text-charcoal/40">
          <ChevronDown size={32} />
        </div>
      </motion.section>

      {/* Couple Section */}
      <motion.section id="couple" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: 0.75 }} className="py-20 px-6 max-w-5xl mx-auto">
        <SectionTitle 
          overline="Bertemu Pasangan" 
          title="Pasangan Bahagia"
          description="Dua jiwa dengan satu pemikiran, dua hati yang berdetak sebagai satu."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.12 }}
            className="bg-white border border-charcoal/5 p-8 flex flex-col items-center text-center shadow-sm"
          >
            <div className="w-full aspect-[4/5] overflow-hidden mb-6 group relative">
              <img src={IMAGES.clara} alt="Clara" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 border-[12px] border-white/10 pointer-events-none"></div>
            </div>
            <h3 className="text-3xl text-burgundy mb-2 italic">Zahra Ifakornelia</h3>
            <span className="text-[10px] font-semibold tracking-[0.3em] text-sage mb-6">THE BRIDE</span>
            <p className="text-charcoal/70 text-sm leading-relaxed max-w-xs">
              Putri dari Bpk. Nanang Ishariyanto & Ibu. Dina Siana Indri Astutik
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.12 }}
            className="bg-white border border-charcoal/5 p-8 flex flex-col items-center text-center shadow-sm md:mt-24"
          >
            <div className="w-full aspect-[4/5] overflow-hidden mb-6 group relative">
              <img src={IMAGES.elias} alt="Elias" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 border-[12px] border-white/10 pointer-events-none"></div>
            </div>
            <h3 className="text-2xl sm:text-3xl text-burgundy mb-2 italic whitespace-nowrap leading-tight">R. Rojab Maulana Akbar</h3>
            <span className="text-[10px] font-semibold tracking-[0.3em] text-sage mb-6">THE GROOM</span>
            <p className="text-charcoal/70 text-sm leading-relaxed max-w-xs">
              Putra dari Bpk. RB. Abdul Hadi & Ibu Husnul Hotimah
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Events Section */}
      <motion.section id="event" className="py-20 px-6 bg-surface-container-low/30 overflow-hidden" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: 0.75 }}>
        <SectionTitle 
          overline="Anda Diundang"
          title="Acara Pernikahan"
          icon={Calendar}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Akad Nikah */}
          <motion.div 
            initial={{ opacity: 0, x: -50, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-white p-8 border border-charcoal/5 shadow-md flex flex-col items-center text-center relative overflow-hidden"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="absolute top-0 left-0 w-12 h-12 border-t border-l border-sage m-4"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-sage m-4"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ delay: 0.2, duration: 0.55 }}
            >
              <Church className="text-burgundy mb-4" size={40} />
            </motion.div>
            <h3 className="text-2xl text-burgundy mb-4 italic">Akad Nikah</h3>
            <p className="text-sm text-charcoal/60 mb-8 max-w-xs italic">Tempat di mana kami bertukar janji pernikahan di hadapan Allah SWT dan Keluarga.</p>
            
            <div className="space-y-6 mb-8 w-full">
              <div>
                <span className="text-[10px] font-semibold text-sage tracking-widest block mb-1">TANGGAL & WAKTU</span>
                <p className="font-semibold">Sabtu, 12 Agustus 2024</p>
                <p className="text-sm">08:00 AM – 10:00 AM</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-sage tracking-widest block mb-1">LOKASI</span>
                <p className="font-semibold">Grand Ballroom, Amanjiwo</p>
                <p className="text-xs text-charcoal/60 px-4">Majaksingi, Borobudur, Magelang, Central Java</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              whileHover={{ scale: 1.02 }}
              className="w-full h-40 overflow-hidden mb-6 rounded-sm"
            >
              <img src={IMAGES.akad} alt="Venue" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </motion.div>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-burgundy text-burgundy text-[10px] px-6 py-3 tracking-widest font-semibold hover:bg-burgundy/5 transition-all uppercase"
            >
              <MapPin size={14} /> Buka Maps
            </a>
          </motion.div>

          {/* Resepsi */}
          <motion.div 
            initial={{ opacity: 0, x: 50, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="bg-white p-8 border border-charcoal/5 shadow-md flex flex-col items-center text-center relative overflow-hidden"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute top-0 left-0 w-12 h-12 border-t border-l border-sage m-4"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-sage m-4"
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ delay: 0.35, duration: 0.55 }}
            >
              <PartyPopper className="text-burgundy mb-4" size={40} />
            </motion.div>
            <h3 className="text-2xl text-burgundy mb-4 italic">Resepsi</h3>
            <p id="kehadiran" className="text-sm text-charcoal/60 mb-8 max-w-xs italic">Bergabunglah dengan kami untuk makan malam perayaan saat kami merayakan awal perjalanan baru kami bersama.</p>

            <div className="space-y-6 mb-8 w-full">
              <div>
                <span className="text-[10px] font-semibold text-sage tracking-widest block mb-1">TANGGAL & WAKTU</span>
                <p className="font-semibold">Sabtu, 12 Agustus 2024</p>
                <p className="text-sm">06:00 PM – 09:00 PM</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-sage tracking-widest block mb-1">LOKASI</span>
                <p className="font-semibold">The Terrace, Amanjiwo</p>
                <p className="text-xs text-charcoal/60 px-4">Majaksingi, Borobudur, Magelang, Central Java</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              whileHover={{ scale: 1.02 }}
              className="w-full h-40 overflow-hidden mb-6 rounded-sm"
            >
              <img src={IMAGES.resepsi} alt="Venue" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </motion.div>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-burgundy text-white text-[10px] px-6 py-3 tracking-widest font-semibold hover:bg-burgundy/90 transition-all uppercase"
            >
              <MapPin size={14} /> Buka Maps
            </a>
          </motion.div>
        </div>

        {/* Map Section */}
        <div className="mt-20 max-w-4xl mx-auto text-center">
          <SectionTitle 
            title="Lokasi"
            description="Kami tidak sabar menanti kehadiran Anda. Bagi yang bepergian dari jauh, silakan lihat lokasi peta digital di bawah ini."
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative aspect-video w-full rounded-lg overflow-hidden border border-charcoal/10 shadow-lg bg-white"
          >
            <iframe
              title="Google Maps Street View"
              src={STREET_VIEW_URL}
              className="w-full h-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-champagne/10 via-transparent to-transparent pointer-events-none"></div>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-5 py-2 text-[10px] font-semibold tracking-[0.3em] text-burgundy shadow-lg backdrop-blur-md transition-colors hover:bg-white"
            >
              BUKA STREET VIEW
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Journey Gallery */}
      <motion.section id="gallery" className="py-20 px-6 max-w-6xl mx-auto" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: 0.75 }}>
        <SectionTitle 
          title="Perjalanan Kami"
          description="Koleksi momen-momen yang membawa kami ke hari istimewa ini. Setiap bab telah membuat kami semakin dekat."
          icon={ImageIcon}
        />
        
        <div className="masonry-grid mt-12">
          {IMAGES.journey.map((src, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="masonry-item group cursor-pointer"
            >
              <div className="overflow-hidden border border-charcoal/5 shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img src={src} alt="Journey" className="w-full grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                <div className="p-4 bg-white">
                  <p className="text-[10px] font-bold tracking-widest text-sage uppercase">
                    {["Provence, 2022", "Terikat Hati", "Lamaran", "Momen Tenang", "Energi Musim Semi", "Perayaan"][i]}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* RSVP Section */}
      <motion.section id="join-us" className="py-20 px-6 scroll-mt-24" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: 0.75 }}>
        <div className="max-w-xl mx-auto bg-white border border-charcoal/5 p-12 shadow-md relative overflow-hidden">
          <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none">
            <Mail size={180} className="text-sage" />
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl text-burgundy mb-2 italic">Kehadiran</h2>
              <p className="text-sm text-charcoal/60">Silakan konfirmasi kehadiran Anda sebelum 15 September 2026</p>
            </div>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[10px] font-bold text-sage tracking-widest uppercase mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  placeholder="Isi dengan nama lengkap Anda..."
                  className="w-full bg-transparent border-b border-charcoal/20 py-2 focus:border-burgundy focus:ring-0 transition-colors placeholder:text-charcoal/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sage tracking-widest uppercase mb-4">Kamu bisa hadir?</label>
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="attendance" className="text-burgundy focus:ring-burgundy w-4 h-4" />
                    <span className="text-sm text-charcoal/80 group-hover:text-burgundy transition-colors">Ya, Saya Akan Hadir</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="attendance" className="text-burgundy focus:ring-burgundy w-4 h-4" />
                    <span className="text-sm text-charcoal/80 group-hover:text-burgundy transition-colors">Maaf, Tidak Bisa Hadir</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sage tracking-widest uppercase mb-2">Catatan untuk Pasangan</label>
                <textarea 
                  rows={4}
                  placeholder="Tulis pesan, harapan, atau doa restu untuk kami di sini..."
                  className="w-full bg-transparent border-b border-charcoal/20 py-2 focus:border-burgundy focus:ring-0 transition-colors placeholder:text-charcoal/20 resize-none"
                />
              </div>

              <div className="text-center pt-4">
                <button className="bg-burgundy text-white px-12 py-4 tracking-widest text-xs font-semibold hover:opacity-90 transition-all uppercase shadow-md active:scale-95">
                  Kirim Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.section>

      {/* Gifts Section (Tanda Kasih) */}
      <section id="gifts" className="py-20 px-6 max-w-4xl mx-auto">
        <SectionTitle 
          title="Tanda Kasih"
          description="Doa restu Anda merupakan karunia terindah bagi kami. Namun, apabila Anda ingin memberikan tanda kasih kepada kami, berikut adalah sarana yang kami sediakan."
          icon={Gift}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1 */}
          <div className="bg-white p-8 border border-charcoal/5 shadow-sm rounded-lg relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Gift size={160} />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] font-bold text-sage tracking-widest uppercase mb-1">BANK CENTRAL ASIA</p>
                  <h4 className="text-2xl text-burgundy">BCA Account</h4>
                </div>
              </div>
              <div className="mb-8">
                <p className="text-[8px] font-bold text-charcoal/40 tracking-widest uppercase mb-1">ACCOUNT NUMBER</p>
                <div className="flex items-center gap-4">
                  <span className="text-xl tracking-widest">1234 5678 90</span>
                  <button 
                    onClick={() => copyToClipboard('1234567890', 'bca')}
                    className="p-1.5 rounded-full border border-charcoal/10 hover:bg-charcoal/5 transition-all"
                  >
                    {copiedId === 'bca' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[8px] font-bold text-charcoal/40 tracking-widest uppercase mb-1">ACCOUNT HOLDER</p>
                <p className="text-sm font-medium uppercase tracking-wider">Elias & Clara</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-primary-container p-8 border border-charcoal/5 shadow-sm rounded-lg relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Heart size={160} />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] font-bold text-sage tracking-widest uppercase mb-1">BANK MANDIRI</p>
                  <h4 className="text-2xl text-burgundy">Mandiri Account</h4>
                </div>
              </div>
              <div className="mb-8">
                <p className="text-[8px] font-bold text-charcoal/40 tracking-widest uppercase mb-1">ACCOUNT NUMBER</p>
                <div className="flex items-center gap-4">
                  <span className="text-xl tracking-widest">9876 5432 10</span>
                  <button 
                    onClick={() => copyToClipboard('9876543210', 'mandiri')}
                    className="p-1.5 rounded-full border border-charcoal/10 hover:bg-charcoal/5 transition-all"
                  >
                    {copiedId === 'mandiri' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[8px] font-bold text-charcoal/40 tracking-widest uppercase mb-1">ACCOUNT HOLDER</p>
                <p className="text-sm font-medium uppercase tracking-wider">Clara Adeline</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mailing Address */}
        <div className="max-w-xl mx-auto p-8 border border-dashed border-sage/40 rounded-lg text-center bg-white/50 backdrop-blur-sm">
          <SectionTitle 
            title="Alamat"
            description="Bagi Anda yang berkeinginan untuk mengirimkan bingkisan fisik, dapat ditujukan ke alamat kediaman kami."
          />
          <div className="p-4 rounded mb-6">
            <p className="font-semibold text-burgundy mb-2">Zahra & Akbar</p>
            <p className="text-sm text-charcoal/70 leading-relaxed">
              Jl. Pinang Merah No. 12, Kebayoran Lama<br />
              Jakarta Selatan, 12220<br />
              DKI Jakarta
            </p>
          </div>
          <button className="flex items-center gap-2 mx-auto bg-burgundy text-white text-[10px] px-8 py-3 tracking-widest font-semibold hover:bg-burgundy/90 transition-all uppercase rounded-full">
            Lihat Map <MapPin size={12} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 text-center">
        <div className="ornamental-divider w-48 mx-auto mb-8">
          <span className="text-sage/40"><Heart size={24} fill="currentColor" /></span>
        </div>
        <h2 className="text-4xl sm:text-5xl text-burgundy mb-4">Thank You</h2>
        {/* <p className="text-lg text-charcoal/70 italic mb-12">We can't wait to share our special day with you.</p>
        
        <div className="opacity-20 mb-12">
          <img src={IMAGES.flourish} alt="Flourish" className="w-16 h-16 mx-auto grayscale" />
        </div> */}
        
        <p className="text-[10px] font-bold text-sage/60 tracking-[0.2em] uppercase">
          © 2026 ZAHRA & AKBAR • DIBUAT OLEH <span style={{ fontWeight: 'bold' }}> R. ROJAB MAULANA AKBAR</span>
        </p>
      </footer>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex justify-around items-center p-2 bg-white/90 backdrop-blur-md w-[95%] max-w-lg rounded-full border border-charcoal/5 shadow-2xl">
        {[
          { id: 'home', icon: HomeIcon, label: 'Home' },
          { id: 'couple', icon: Heart, label: 'Couple' },
          { id: 'event', icon: Calendar, label: 'Event' },
          { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
          { id: 'rsvp', icon: Mail, label: 'RSVP' },
          { id: 'gifts', icon: Gift, label: 'Gifts' },
        ].map((tab) => (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center px-2.5 py-2 rounded-full transition-all duration-300 ${activeTab === tab.id ? 'bg-burgundy/5 text-burgundy scale-110' : 'text-charcoal/40 hover:text-burgundy/60'}`}
          >
            <tab.icon size={20} fill={activeTab === tab.id ? 'currentColor' : 'none'} className={activeTab === tab.id ? 'opacity-100' : 'opacity-40'} />
            <span className="text-[8px] font-bold tracking-widest mt-1 uppercase">{tab.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default App;
