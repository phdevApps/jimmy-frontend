
"use client";
import React from 'react';
import { useRouter, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, CreditCard, Heart, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const AccountSidebar = () => {
  const location = useRouter();
  
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
    },
    {
      title: 'Profile',
      href: '/profile',
      icon: User,
    },
    {
      title: 'Payment Methods',
      href: '/payment-methods',
      icon: CreditCard,
    },
    {
      title: 'Wishlist',
      href: '/wishlist',
      icon: Heart,
    },
    {
      title: 'Security',
      href: '/security',
      icon: Shield,
    },
  ];

  return (
    <Card className="h-fit">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-4">Account Management</h3>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
};

export default AccountSidebar;
