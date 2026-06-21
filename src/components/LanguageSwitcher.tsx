import { useLanguage } from '../context/LanguageContext';
import type { LanguageCode } from '../locales';
import { Button } from './ui/Button';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'ru', label: 'RU' },
    { code: 'tj', label: 'TJ' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="flex gap-1 bg-white/50 dark:bg-black/20 p-1 rounded-full backdrop-blur-sm border border-rose-100 dark:border-rose-900 shadow-sm">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? 'default' : 'ghost'}
          size="sm"
          className={`h-7 px-3 text-xs font-semibold rounded-full ${
            language === lang.code 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'text-rose-700 dark:text-rose-300 hover:text-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/50'
          }`}
          onClick={() => setLanguage(lang.code)}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}
