import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import bgHero from '../foto/bg/bg.jpg';

interface InvitationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onPlayMusic?: () => void;
  onOpenAndPlay?: () => void;
}

export const InvitationPopup = ({
  isOpen,
  onClose,
  audioRef,
  onPlayMusic,
  onOpenAndPlay
}: InvitationPopupProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Auto-play music when popup opens
  useEffect(() => {
    if (isOpen && !hasPlayed && audioRef.current) {
      setHasPlayed(true);
      const audio = audioRef.current;
      audio.muted = false;
      void audio.play().catch(() => {
        // ignore autoplay errors
      });
      onPlayMusic?.();
    }
  }, [isOpen, hasPlayed, audioRef, onPlayMusic]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && e.target === containerRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Close on Escape key for accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock background scroll when popup is open (supports mobile & desktop)
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;

    // Preserve scroll position and lock
    const scrollY = window.scrollY || window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';

    return () => {
      // Restore
      document.body.style.overflow = prevOverflow || '';
      document.body.style.position = prevPosition || '';
      document.body.style.top = prevTop || '';
      // restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[999] grid place-items-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ duration: 0.45, type: 'spring', stiffness: 280, damping: 28 }}
            className="relative w-full max-w-3xl bg-linear-to-b from-champagne/95 via-white/95 to-sage/5 backdrop-blur-md rounded-2xl p-0 shadow-2xl border border-white/80 overflow-hidden max-h-[80vh]"
          >
            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-burgundy rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-sage rounded-full blur-3xl"
            />

            {/* Close button */}
            {/* Note: removed top-right close button to simplify UI; users can tap outside or press Escape to close */}

            {/* Content (right column on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="hidden md:block relative overflow-hidden rounded-l-2xl min-h-[320px]">
                <motion.div initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: 'easeOut' }} className="absolute inset-0 bg-cover bg-center transform-gpu" style={{ backgroundImage: `url(${bgHero})` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/80 mix-blend-overlay" />
              </div>

              <div className="relative z-10 px-4 sm:px-8 py-8 sm:py-10 flex flex-col justify-center">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="text-center">
                  <div className="mx-auto w-full max-w-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Heart size={28} className="text-burgundy fill-burgundy" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-burgundy leading-tight">Zahra & Akbar</h1>
                    <p className="mt-1 text-[11px] sm:text-sm tracking-[0.18em] font-semibold text-charcoal/60 uppercase">Dengan hormat mengundang Anda</p>
                  </div>
                </motion.div>

                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.35, duration: 0.6 }} className="h-px bg-gradient-to-r from-transparent via-burgundy/40 to-transparent my-6" />

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }} className="text-center px-2 sm:px-6">
                  <p className="text-sm italic leading-relaxed text-charcoal/80 max-w-xl mx-auto">Suatu kehormatan bagi kami mengundang Anda pada momen istimewa ini.</p>
                  <div className="mt-3">
                    <p className="font-semibold text-md text-burgundy">Pernikahan Kami</p>
                    <p className="text-xs sm:text-sm">Minggu, 17 Oktober 2027</p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.5 }} className="pt-6">
                  <div className="flex items-center justify-center">
                    <motion.button initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02, boxShadow: '0 18px 45px rgba(99,13,22,0.22)' }} whileTap={{ scale: 0.975 }} onClick={() => { onOpenAndPlay?.(); const audio = audioRef.current; if (audio) { audio.muted = false; void audio.play().catch(() => {}); } }} type="button" className="w-full max-w-lg bg-linear-to-r from-burgundy to-burgundy/80 text-white px-5 py-3 tracking-widest text-sm sm:text-base font-semibold transition-all uppercase rounded-xl flex items-center justify-center gap-2">
                      <Heart size={20} fill="currentColor" />
                      <span>Buka & Putar</span>
                    </motion.button>
                  </div>
                </motion.div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }} className="text-center text-xs text-charcoal/50 pt-3 italic">Lihat detail di halaman utama</motion.p>

                <p className="text-center text-[11px] text-charcoal/40 mt-2">Ketuk di luar popup atau tekan <span className="font-semibold">Esc</span> untuk menutup</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
