import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 text-center relative z-10 bg-black/20 backdrop-blur-md border-t border-rose-900">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
        </motion.div>
        <p className="text-rose-100 font-medium">
          {t.footer.madeWithLove}
        </p>
        <p className="text-sm text-rose-400/70">
          © 1978 — {year}
        </p>
      </div>
    </footer>
  );
}
