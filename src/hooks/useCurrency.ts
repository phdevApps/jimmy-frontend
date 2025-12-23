
"use client";
import { useState, useEffect } from 'react';
import { getStoreSettings, formatPrice, WooCommerceSettings } from '@/services/wooCommerceApi';

// Custom currency symbol mapping
const getCurrencySymbol = (currencyCode: string): string => {
  switch (currencyCode.toUpperCase()) {
    case 'SAR': // Saudi Riyal
      return String.fromCodePoint(0xFFFFC);
    case 'AED': // UAE Dirham
      return String.fromCodePoint(0xFFFFD);
    default:
      return String.fromCodePoint(0xFFFFD); // Default to Dirham
  }
};

export const useCurrency = () => {
  const [settings, setSettings] = useState<WooCommerceSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storeSettings = await getStoreSettings();
        setSettings(storeSettings);
      } catch (error) {
        console.error('Error loading currency settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const formatCurrency = async (price: string | number): Promise<string> => {
    return await formatPrice(price);
  };

  const formatCurrencySync = (price: string | number): string => {
    if (!settings) return `${price}`;
    
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const formattedNumber = numPrice.toFixed(settings.number_of_decimals);
    
    switch (settings.currency_position) {
      case 'left':
        return `${settings.currency_symbol}${formattedNumber}`;
      case 'right':
        return `${formattedNumber}${settings.currency_symbol}`;
      case 'left_space':
        return `${settings.currency_symbol} ${formattedNumber}`;
      case 'right_space':
        return `${formattedNumber} ${settings.currency_symbol}`;
      default:
        return `${settings.currency_symbol}${formattedNumber}`;
    }
  };

  return {
    settings,
    isLoading,
    formatCurrency,
    formatCurrencySync,
    currencySymbol: settings?.currency_symbol || getCurrencySymbol('AED'),
    currencyCode: settings?.currency || 'AED'
  };
};
