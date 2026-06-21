import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import type { GalleryImage } from '../types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/Carousel';
import Autoplay from 'embla-carousel-autoplay'; // <-- Добавлен импорт для автопрокрутки
import { cn } from "@/lib/utils";

import i1 from "@/assets/1.jpg"
import i2 from "@/assets/2.jpg"
import i3 from "@/assets/3.jpg"
import i4 from "@/assets/4.jpg"
import i5 from "@/assets/5.jpg"
import i6 from "@/assets/6.jpg"
import i7 from "@/assets/7.jpg"

export function PhotoGallery() {
  const { t } = useLanguage();

  // Твои картинки теперь здесь
  const photos: GalleryImage[] = [
    { id: '1', src: i1, alt: 'Beautiful roses' },
    { id: '2', src: i2, alt: 'Family celebration' },
    { id: '3', src: i3, alt: 'Party event' },
    { id: '4', src: i4, alt: 'Celebration' },
    { id: '5', src: i5, alt: 'Event photo 5' },
    { id: '6', src: i6, alt: 'Event photo 6' },
    { id: '7', src: i7, alt: 'Event photo 7' },
  ];

  return (
    <section className={cn('bg-rose-50/50', 'dark:bg-black/30', 'py-24', 'border-rose-100', 'border-y', 'dark:border-rose-900', 'overflow-hidden')}>
      <div className={cn('mx-auto', 'px-4', 'max-w-5xl')}>
        <div className={cn('mb-12', 'text-center')}>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn('mb-4', 'font-serif', 'text-rose-900', 'dark:text-rose-100', 'text-4xl')}
          >
            {t.gallery.title}
          </motion.h3>
          <p className={cn('text-rose-600', 'dark:text-rose-400')}>
            {t.gallery.subtitle}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            // Добавлен плагин автопрокрутки
            plugins={[
              Autoplay({
                delay: 3000, // Время задержки (3 секунды)
              }),
            ]}
            className={cn('relative', 'mx-auto', 'w-full', 'max-w-4xl')}
          >
            <CarouselContent className={cn('-ml-2', 'md:-ml-4')}>
              {photos.map((photo) => (
                <CarouselItem key={photo.id} className={cn('pl-2', 'md:pl-4', 'md:basis-1/2', 'lg:basis-1/3')}>
                  <div className="p-1">
                    <div className={cn('group', 'relative', 'bg-rose-100', 'dark:bg-rose-950', 'shadow-xl', 'border-4', 'border-white', 'dark:border-rose-900', 'rounded-2xl', 'aspect-[4/5]', 'overflow-hidden')}>
                      {/* Decorative floral corner */}
                      <div className={cn('top-2', 'left-2', 'z-10', 'absolute', 'opacity-50', 'w-8', 'h-8', 'pointer-events-none')}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-rose-500">
                          <path d="M12 22C12 22 4 16 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 16 12 22 12 22Z" fill="currentColor" opacity="0.5"/>
                        </svg>
                      </div>
                      
                      <img 
                        src={photo.src} 
                        alt={photo.alt} 
                        className={cn('w-full', 'h-full', 'object-cover', 'group-hover:scale-110', 'transition-transform', 'duration-500')}
                      />
                      
                      <div className={cn('absolute', 'inset-0', 'bg-gradient-to-t', 'from-rose-900/60', 'to-transparent', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-300')} />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Custom styled navigation buttons */}
            <div className={cn('hidden', 'md:block')}>
              <CarouselPrevious className={cn('-left-16', 'bg-white/80', 'hover:bg-rose-500', 'dark:bg-black/80', 'shadow-lg', 'border-none', 'w-12', 'h-12', 'text-rose-500', 'hover:text-white')} />
              <CarouselNext className={cn('-right-16', 'bg-white/80', 'hover:bg-rose-500', 'dark:bg-black/80', 'shadow-lg', 'border-none', 'w-12', 'h-12', 'text-rose-500', 'hover:text-white')} />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}