
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const languageNames = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français'
};

const LanguageSwitcher: React.FC = () => {
  const { currentLang, supportedLanguages, switchLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-300" />
      <Select value={currentLang} onValueChange={switchLanguage}>
        <SelectTrigger className="w-32 h-8 text-sm bg-transparent border-gray-600 text-white hover:bg-gray-800">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {languageNames[lang as keyof typeof languageNames]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
