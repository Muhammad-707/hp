import { ru } from './ru';
import { tj } from './tj';
import { en } from './en';
import type { LanguageCode, TranslationSchema } from './types';

export const translations: Record<LanguageCode, TranslationSchema> = {
  ru,
  tj,
  en,
};

export * from './types';
