"use client";

import React from 'react';
import Link  from 'next/link';
import { User, ShoppingBag, Heart, Search } from 'lucide-react';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useWishlist } from '@/hooks/useWishlist';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CurrencyDropdown } from '@/components/ui/currency-dropdown';
import LanguageSwitcher from '@/components/language/LanguageSwitcher';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const TopHeader = () => {
  const { items } = useTypedSelector(state => state.cart);
  const { isAuthenticated=false, user=null } = useTypedSelector(state => state.auth);
  const { wishlistItems } = useWishlist();
  
  // const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  // const wishlistItemCount = wishlistItems.length;

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 text-sm">
          {/* Left side - Welcome message */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {isAuthenticated ? `Welcome back, ${user?.first_name??"unknown"}` : 'Welcome to Jimmy'}
            </span>
          </div>

          {/* Right side - Account, Preferences */}
          <div className="flex items-center space-x-6">
            {/* Shipping to */}
            <div className="flex items-center space-x-1 text-gray-600">
              <span>Ship to:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    United Arab Emirates
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>United Arab Emirates</DropdownMenuItem>
                  <DropdownMenuItem>Saudi Arabia</DropdownMenuItem>
                  <DropdownMenuItem>United States</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Language & Currency */}
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <CurrencyDropdown />
            </div>

            {/* Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <User className="h-4 w-4 mr-1" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-gray-900 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
