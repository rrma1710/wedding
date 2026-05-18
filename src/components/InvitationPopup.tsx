import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart } from 'lucide-react';

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
            transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl bg-gradient-to-b from-champagne/95 via-white/95 to-sage/5 backdrop-blur-md rounded-3xl p-0 shadow-2xl border border-white/80 overflow-hidden max-h-[90vh] overflow-y-auto"
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
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white text-burgundy transition-colors shadow-lg"
              aria-label="Tutup"
            >
              <X size={24} />
            </motion.button>

            {/* Content */}
            <div className="relative z-10 px-6 sm:px-10 py-12 sm:py-16 space-y-8">
              {/* Header with animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center space-y-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  <Heart size={32} className="text-burgundy fill-burgundy" />
                </motion.div>

                <h1 className="text-5xl sm:text-6xl font-serif text-burgundy mb-2">
                  Zahra & Akbar
                </h1>

                <p className="text-sm sm:text-base tracking-[0.3em] font-semibold text-charcoal/60 uppercase">
                  Dengan hormat mengundang Anda
                </p>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="h-px bg-gradient-to-r from-transparent via-burgundy/40 to-transparent"
              />

              {/* Main invitation text */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center space-y-6"
              >
                <div className="space-y-3 text-charcoal/80">
                  <p className="text-lg sm:text-xl italic leading-relaxed">
                    Suatu kehormatan bagi kami untuk mempersilahkan Anda pada acara yang memperingati momen istimewa dalam hidup kami
                  </p>
                  
                  <div className="pt-4 space-y-2">
                    <p className="font-semibold text-lg text-burgundy">
                      Pernikahan Kami
                    </p>
                    <p className="text-sm sm:text-base">
                      Minggu, 17 Oktober 2027
                    </p>
                  </div>
                </div>

                {/* Decorative flourish */}
                <div className="flex items-center justify-center gap-3 pt-4">
                  <div className="h-px w-8 bg-charcoal/20"></div>
                  <Heart size={16} className="text-sage fill-sage" />
                  <div className="h-px w-8 bg-charcoal/20"></div>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onOpenAndPlay?.();
                    const audio = audioRef.current;
                    if (audio) {
                      audio.muted = false;
                      void audio.play();
                    }
                  }}
                  type="button"
                  className="bg-linear-to-r from-burgundy to-burgundy/80 text-white px-10 py-4 tracking-widest text-sm font-semibold hover:shadow-lg transition-all uppercase shadow-lg shadow-burgundy/25 mb-6 flex items-center justify-center gap-2 rounded-lg"
                >
                  <Heart size={20} fill="currentColor" />
                  Buka Undangan & Putar Musik
                </motion.button>
                {/* single combined action - remaining button above handles open+play+scroll */}
              </motion.div>

              {/* Footer text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-center text-xs sm:text-sm text-charcoal/50 pt-4 italic"
              >
                Scroll ke bawah untuk melihat detail lengkap acara
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
