
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';

export const CurrencySwitcher: React.FC = () => {
  const { currency, setCurrency, isLoading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currencies = [
    { code: 'AED' as const, name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'SAR' as const, name: 'Saudi Riyal', symbol: '﷼' },
    { code: 'USD' as const, name: 'US Dollar', symbol: '$' }
  ];

  const handleCurrencyChange = (newCurrency: 'AED' | 'SAR' | 'USD') => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  const currentCurrency = currencies.find(c => c.code === currency);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors text-sm disabled:opacity-50"
      >
        <span className="font-CurrencyIcons text-lg">
          {currentCurrency?.symbol}
        </span>
        <span>{currency}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[140px] z-50">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleCurrencyChange(curr.code)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
                currency === curr.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span className="font-CurrencyIcons text-lg">
                {curr.symbol}
              </span>
              <span>{curr.code}</span>
              <span className="text-xs text-gray-500">{curr.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
