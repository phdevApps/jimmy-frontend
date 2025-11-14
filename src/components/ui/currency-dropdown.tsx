
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySymbol } from './currency-symbol';
import { useCurrency } from '../../contexts/CurrencyContext';

export const CurrencyDropdown: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currencies = [
    { code: 'AED' as const, name: 'UAE Dirham' },
    { code: 'SAR' as const, name: 'Saudi Riyal' },
    { code: 'USD' as const, name: 'US Dollar' }
  ];

  const handleCurrencyChange = (newCurrency: 'AED' | 'SAR' | 'USD') => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-white hover:text-gray-200 transition-colors text-sm"
      >
        <span style={{ fontFamily: "custom_currency" }}>
          <CurrencySymbol currencyCode={currency} />
        </span>
        <span>{currency}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[120px] z-50">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleCurrencyChange(curr.code)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
                currency === curr.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span style={{ fontFamily: "custom_currency" }}>
                <CurrencySymbol currencyCode={curr.code} />
              </span>
              <span>{curr.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
