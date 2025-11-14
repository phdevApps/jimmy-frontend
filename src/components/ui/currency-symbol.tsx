
import React from 'react';

interface CurrencySymbolProps {
  currencyCode: 'AED' | 'SAR' | 'USD';
  className?: string;
}
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

export const CurrencySymbol: React.FC<CurrencySymbolProps> = ({
  currencyCode,
  className = ""
}) => {
  const getSymbol = (code: string): string => {
    switch (code.toUpperCase()) {
      case 'SAR': // Saudi Riyal - use custom font glyph
        return String.fromCodePoint(0xFFFFC);; // This should map to the SAR symbol in your custom font
      case 'AED': // UAE Dirham - use custom font glyph  
        return String.fromCodePoint(0xFFFFD);; // This should map to the AED symbol in your custom font
      case 'USD': // US Dollar
        return '$';
      default:
        return '$'; // Default to Dollar
    }

  };

  const shouldUseCustomFont = currencyCode === 'AED' || currencyCode === 'SAR';

  return (
    <span
      style={shouldUseCustomFont ? { fontFamily: "custom_currency" } : undefined}
      className={className}
    >
      {getSymbol(currencyCode)}
    </span>
  );
};
