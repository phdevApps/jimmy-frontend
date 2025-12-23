import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getStoreSettings, WooCommerceSettings } from '@/services/wooCommerceApi';

interface PriceProps {
  amount: number | string;
  className?: string;
  showCurrency?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Price: React.FC<PriceProps> = ({ 
  amount, 
  className = '', 
  showCurrency = true,
  size = 'md'
}) => {
  const { currency: selectedCurrency, convertPrice, storeBaseCurrency } = useCurrency();
  const [storeSettings, setStoreSettings] = useState<WooCommerceSettings | null>(null);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getStoreSettings();
        setStoreSettings(settings);
      } catch (error) {
        console.error('Error fetching store settings in Price component:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const convertedAmount = convertPrice(numAmount);
  
  // Use store settings for formatting if displaying store currency, otherwise use selected currency settings
  const isStoreCurrency = selectedCurrency === storeBaseCurrency;
  const formatOptions = {
    minimumFractionDigits: storeSettings?.number_of_decimals || 2,
    maximumFractionDigits: storeSettings?.number_of_decimals || 2,
  };

  const formattedAmount = new Intl.NumberFormat('en-US', formatOptions).format(convertedAmount);

  const getCurrencySymbol = (code: string): string => {
    // If we're showing the store currency, use store settings
    if (isStoreCurrency && storeSettings && code === storeSettings.currency) {
      return storeSettings.currency_symbol;
    }
    
    // Otherwise use custom symbols for supported currencies
    switch (code.toUpperCase()) {
      case 'SAR': // Saudi Riyal - use custom font glyph
        return String.fromCodePoint(0xFFFFC);
      case 'AED': // UAE Dirham - use custom font glyph  
        return String.fromCodePoint(0xFFFFD);
      case 'USD': // US Dollar
        return '$';
      default:
        return '$'; // Default to Dollar
    }
  };

  const shouldUseCustomFont = selectedCurrency === 'AED' || selectedCurrency === 'SAR';

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const currencySymbol = getCurrencySymbol(selectedCurrency);
  // Use store currency position settings if available and displaying store currency
  const position = (isStoreCurrency && storeSettings?.currency_position) || 'left';

  return (
    <div className={`flex items-baseline space-x-1 ${className}`}>
      {showCurrency && (position === 'left' || position === 'left_space') && (
        <span 
          className={`${sizeClasses[size]} ${position === 'left_space' ? 'mr-1' : ''}`}
          style={shouldUseCustomFont ? { fontFamily: "custom_currency" } : undefined}
        >
          {currencySymbol}
        </span>
      )}
      <span className={`font-medium ${sizeClasses[size]}`}>
        {formattedAmount}
      </span>
      {showCurrency && (position === 'right' || position === 'right_space') && (
        <span 
          className={`${sizeClasses[size]} ${position === 'right_space' ? 'ml-1' : ''}`}
          style={shouldUseCustomFont ? { fontFamily: "custom_currency" } : undefined}
        >
          {currencySymbol}
        </span>
      )}
    </div>
  );
};
