import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn('top-0', 'right-0', 'left-0', 'z-50', 'fixed', 'p-4')}
    >
      <div className={cn('flex', 'justify-between', 'items-center', 'mx-auto', 'max-w-6xl')}>
        <div></div>
        <div className={cn('flex', 'items-center', 'gap-4')}>
          <LanguageSwitcher />
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </motion.header>
  );
}
