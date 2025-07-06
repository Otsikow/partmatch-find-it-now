import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'tw', name: 'Twi', flag: '🇬🇭' },
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
];

interface LanguageSelectorProps {
  showLabel?: boolean;
  variant?: 'select' | 'button';
}

const LanguageSelector = ({ showLabel = true, variant = 'select' }: LanguageSelectorProps) => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
  };

  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  if (variant === 'button') {
    return (
      <Button variant="outline" size="sm" className="gap-2">
        <Languages className="h-4 w-4" />
        {currentLanguage.flag} {currentLanguage.name}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <label className="text-sm font-medium flex items-center gap-1">
          <Languages className="h-4 w-4" />
          {t('language')}:
        </label>
      )}
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-auto min-w-[140px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;