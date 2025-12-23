
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const LanguageDemo: React.FC = () => {
  const { currentLang } = useLanguage();

  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Language Demo</h3>
      
      <div className="space-y-4">
        <div>
          <span className="font-medium">Current Language:</span> {currentLang}
        </div>
        
        <div>
          <span className="font-medium">Language Switcher:</span>
          <div className="mt-2">
            <LanguageSwitcher />
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>This demo shows the multilingual functionality is working. The language switcher will:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Update the user's language preference in localStorage</li>
            <li>Send language headers to the WordPress API</li>
            <li>Update SEO meta tags for the current language</li>
            <li>Store preferences in cookies for server-side detection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LanguageDemo;
