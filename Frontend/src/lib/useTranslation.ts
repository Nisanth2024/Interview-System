import { translations } from "./translations";
 
export function useTranslation(language: 'en' | 'fr' | 'es') {
  return translations[language];
} 