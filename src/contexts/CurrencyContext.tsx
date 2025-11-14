
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useSWR from 'swr';
import { getStoreSettings } from '../services/wooCommerceApi';

interface CurrencyContextType {
  currency: 'AED' | 'SAR' | 'USD';
  setCurrency: (currency: 'AED' | 'SAR' | 'USD') => void;
  rateMap: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  convertPrice: (amount: number) => number;
  storeBaseCurrency: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch exchange rates');
  }
  return response.json();
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<'AED' | 'SAR' | 'USD'>('AED');
  const [storeBaseCurrency, setStoreBaseCurrency] = useState<string>('AED');
  
  // Fetch store settings to get default currency
  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const settings = await getStoreSettings();
        console.log('Store base currency:', settings.currency);
        setStoreBaseCurrency(settings.currency);
        
        // If no user preference is stored, use store default
        const stored = localStorage.getItem('selectedCurrency');
        if (!stored && ['AED', 'SAR', 'USD'].includes(settings.currency)) {
          setCurrencyState(settings.currency as 'AED' | 'SAR' | 'USD');
        }
      } catch (error) {
        console.error('Error fetching store settings:', error);
      }
    };
    
    fetchStoreSettings();
  }, []);
  
  // Fetch live exchange rates using a free API
  const { data: rates, error, isLoading } = useSWR(
    'https://api.exchangerate-api.com/v4/latest/AED', // Use AED as base since that's likely the store currency
    fetcher,
    {
      refreshInterval: 3600000, // Refresh every hour
      revalidateOnFocus: false,
    }
  );

  // Default rates if API fails - with AED as base
  const defaultRates = {
    AED: 1,
    USD: 0.27, // 1 AED = 0.27 USD approximately
    SAR: 1.02, // 1 AED = 1.02 SAR approximately
  };

  const rateMap = rates?.rates || defaultRates;

  const setCurrency = (newCurrency: 'AED' | 'SAR' | 'USD') => {
    setCurrencyState(newCurrency);
    localStorage.setItem('selectedCurrency', newCurrency);
  };

  const convertPrice = (amount: number): number => {
    // If store base currency is the same as selected currency, no conversion needed
    if (storeBaseCurrency === currency) {
      return amount;
    }
    
    // Convert from store base currency to selected currency
    // First convert to AED (our API base), then to target currency
    let amountInAED = amount;
    
    // If store currency is not AED, convert to AED first
    if (storeBaseCurrency !== 'AED') {
      const storeToAEDRate = 1 / (rateMap[storeBaseCurrency] || 1);
      amountInAED = amount * storeToAEDRate;
    }
    
    // Then convert to target currency
    const targetRate = rateMap[currency] || 1;
    return amountInAED * targetRate;
  };

  useEffect(() => {
    const stored = localStorage.getItem('selectedCurrency') as 'AED' | 'SAR' | 'USD' | null;
    if (stored && ['AED', 'SAR', 'USD'].includes(stored)) {
      setCurrencyState(stored);
    }
  }, []);

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      rateMap,
      isLoading,
      error: error?.message || null,
      convertPrice,
      storeBaseCurrency,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
