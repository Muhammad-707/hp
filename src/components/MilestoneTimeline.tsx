import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

export function MilestoneTimeline() {
  const milestones = [
    { year: 1978, label: 'Начало пути / The Beginning' },
    { year: 2001, label: 'Любовь и семья / Family & Love' },
    { year: 2026, label: '48 Лет Счастья / 48 Years of Joy' },
  ];

  return (
    <section className={cn('relative', 'py-24', 'overflow-hidden')}>
      <div className={cn('relative', 'mx-auto', 'px-4', 'max-w-4xl')}>
        {/* Glowing Path Line */}
        <div className={cn('top-0', 'bottom-0', 'left-[20px]', 'md:left-1/2', 'absolute', 'bg-rose-200', 'dark:bg-rose-900', 'rounded-full', 'w-1', 'md:-translate-x-1/2')}>
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className={cn('bg-gradient-to-b', 'from-rose-400', 'dark:from-rose-500', 'via-rose-500', 'to-rose-600', 'dark:to-rose-800', 'shadow-[0_0_15px_rgba(255,45,120,0.5)]', 'rounded-full', 'w-full')}
          />
        </div>

        <div className={cn('z-10', 'relative', 'space-y-24')}>
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
              className={`flex flex-col md:flex-row items-center md:justify-between ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Spacer for alternating layout */}
              <div className={cn('hidden', 'md:block', 'w-[45%]')} />
              
              {/* Marker */}
              <div className={cn('left-[12px]', 'md:left-1/2', 'z-20', 'absolute', 'bg-white', 'dark:bg-black', 'shadow-[0_0_15px_rgba(255,45,120,0.8)]', 'border-4', 'border-rose-500', 'rounded-full', 'w-4', 'h-4', 'md:-translate-x-1/2')} />
              
              {/* Content */}
              <div className={cn('mt-4', 'md:mt-0', 'pl-12', 'md:pl-0', 'w-full', 'md:w-[45%]', 'text-left', 'md:text-center')}>
                <div className={cn('bg-white/60', 'dark:bg-black/40', 'shadow-xl', 'hover:shadow-2xl', 'backdrop-blur-md', 'p-6', 'border', 'border-rose-100', 'dark:border-rose-900', 'rounded-2xl', 'transition-shadow', 'duration-300')}>
                  <h4 className={cn('bg-clip-text', 'bg-gradient-to-r', 'from-rose-500', 'dark:from-rose-400', 'to-rose-700', 'dark:to-rose-600', 'drop-shadow-sm', 'mb-2', 'font-black', 'text-transparent', 'text-4xl')}>
                    {milestone.year}
                  </h4>
                  <p className={cn('font-medium', 'text-rose-800', 'dark:text-rose-200')}>
                    {milestone.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
