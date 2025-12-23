"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { loginUser, registerUser, logout, toggleLoginModal } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { User, Mail, Lock, UserPlus, LogIn, BarChart3, CreditCard, Heart, Shield } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation';

const LoginModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoginModalOpen, isAuthenticated, user, isLoading } = useTypedSelector(state => state.auth);
  
  const location = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  // Close modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user && isLoginModalOpen) {
      console.log('LoginModal: User authenticated, closing modal');
      dispatch(toggleLoginModal());
    }
  }, [isAuthenticated, user, isLoginModalOpen, dispatch]);

  // Close modal when navigating to account pages
  useEffect(() => {
    const accountPages = ['/dashboard', '/profile', '/payment-methods', '/wishlist', '/security', '/orders', '/addresses'];
    if (accountPages.includes(location.pathname) && isLoginModalOpen) {
      dispatch(toggleLoginModal());
    }
  }, [location.pathname, isLoginModalOpen, dispatch]);

  // Account menu items - same as AccountSidebar
  const accountMenuItems = [
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      if (isLogin) {
        console.log('LoginModal: Attempting login');
        await dispatch(loginUser({ 
          email: formData.email, 
          password: formData.password 
        })).unwrap();
      } else {
        console.log('LoginModal: Attempting registration');
        await dispatch(registerUser({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        })).unwrap();
      }
      
      toast.success(`Successfully ${isLogin ? 'signed in' : 'registered'} as ${formData.email}`);

      // Clear form data
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('LoginModal: Authentication error:', error);
      toast.error(error || `${isLogin ? 'Authentication' : 'Registration'} failed. Please try again.`);
    }
  };

  const handleLogout = () => {
    console.log('LoginModal: Logging out');
    dispatch(logout());
    dispatch(toggleLoginModal());
    toast.success("You have been successfully signed out.");
  };

  const handleNavigateAndClose = (path: string) => {
    dispatch(toggleLoginModal());
    window.location.href = path;
  };

  return (
    <Sheet open={isLoginModalOpen} onOpenChange={() => dispatch(toggleLoginModal())}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {isAuthenticated && user ? (
          <div className="space-y-6">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Management
              </SheetTitle>
              <SheetDescription>
                Welcome back, {user.first_name}!
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{user.first_name} {user.last_name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              {accountMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleNavigateAndClose(item.href)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </Button>
                );
              })}

              <div className="pt-4 border-t">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                {isLogin ? 'Sign In' : 'Create Account'}
              </SheetTitle>
              <SheetDescription>
                {isLogin ? 'Sign in to your account' : 'Create a new account to get started'}
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default LoginModal;
