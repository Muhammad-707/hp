import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from './ui/Card';

export function MessageLetter() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4 relative flex justify-center items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-800/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl relative"
      >
        <Card className="bg-black/80 backdrop-blur-md border-0 shadow-2xl overflow-hidden relative">
          {/* Paper texture overlay (subtle) */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
          
          {/* Decorative Corner / Ribbon */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full blur-2xl opacity-50" />
          
          <CardContent className="p-8 md:p-14 relative z-10">
            <h3 className="text-3xl md:text-4xl font-serif text-rose-200 mb-8 font-medium italic">
              {t.letter.title}
            </h3>
            
            <div className="space-y-6 text-lg md:text-xl text-rose-100/90 leading-relaxed">
              {t.letter.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <div className="mt-12 text-right">
              <p className="text-2xl font-serif text-rose-400 italic">
                {t.letter.closing}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
