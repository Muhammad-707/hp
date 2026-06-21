export type LanguageCode = 'ru' | 'tj' | 'en';

export interface TranslationSchema {
  hero: {
    title: string;
    subtitle: string;
    years: string;
  };
  cake: {
    makeAWish: string;
    blowCandles: string;
  };
  letter: {
    title: string;
    body: string[];
    closing: string;
  };
  gallery: {
    title: string;
    subtitle: string;
  };
  wishes: {
    title: string;
    items: string[];
  };
  celebrate: {
    buttonText: string;
  };
  footer: {
    madeWithLove: string;
  };
  theme: {
    toggleDark: string;
    toggleLight: string;
  };
}
