import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { Card, CardContent } from './ui/Card';

export function WishesSlider() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4 relative flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-2xl text-center"
      >
        <h3 className="text-3xl md:text-4xl font-serif text-rose-900 dark:text-rose-100 mb-8">
          {t.wishes.title}
        </h3>

        <Tabs defaultValue="wish-0" className="w-full">
          <TabsList className="mb-8 flex-wrap h-auto justify-center p-2 rounded-2xl bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-rose-100 dark:border-rose-900 shadow-sm">
            {t.wishes.items.map((_, index) => (
              <TabsTrigger 
                key={index} 
                value={`wish-${index}`}
                className="rounded-xl px-4 py-2 m-1 text-rose-700 dark:text-rose-300 data-[state=active]:bg-rose-500 data-[state=active]:text-white"
              >
                {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {t.wishes.items.map((wish, index) => (
            <TabsContent key={index} value={`wish-${index}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-rose-500 to-rose-700 dark:from-rose-800 dark:to-rose-950 border-0 shadow-2xl text-white transform hover:-translate-y-2 transition-transform duration-300">
                  <CardContent className="p-12 text-center relative overflow-hidden">
                    {/* Decorative quotes */}
                    <div className="absolute top-4 left-6 text-6xl text-rose-300/30 font-serif">"</div>
                    <div className="absolute bottom-[-1rem] right-6 text-6xl text-rose-300/30 font-serif">"</div>
                    
                    <p className="text-xl md:text-3xl font-medium leading-tight relative z-10 text-rose-50 drop-shadow-md">
                      {wish}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </section>
  );
}
