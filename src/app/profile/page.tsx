"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile, fetchUserProfile } from '@/features/auth/authSlice';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, Customer } from '@/services/wooCommerceApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { AppDispatch } from '@/store';
import AccountSidebar from '@/components/account/AccountSidebar';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isSessionValid, isLoading } = useAuth();
  
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'UAE'
  });

  // Memoize the form data initialization to prevent unnecessary re-renders
  const initializeFormData = useCallback((customer: Customer) => {
    setFormData({
      firstName: customer.first_name || '',
      lastName: customer.last_name || '',
      email: customer.email || '',
      phone: customer.billing?.phone || '',
      address: customer.billing?.address_1 || '',
      city: customer.billing?.city || '',
      postalCode: customer.billing?.postcode || '',
      country: customer.billing?.country || 'UAE'
    });
  }, []);

  // Optimize the customer data fetching with proper dependency management
  useEffect(() => {
    const fetchCustomerData = async () => {
      // Only fetch if we haven't initialized and have necessary auth data
      if (!token || !isAuthenticated || hasInitialized) {
        return;
      }
      
      try {
        console.log('Profile: Fetching customer data with JWT token');
        setIsLoadingProfile(true);
        
        const customer = await getUserProfile(token);
        console.log('Profile: Customer data received:', customer);
        setCustomerData(customer);
        initializeFormData(customer);
        setHasInitialized(true);
        
        console.log('Profile: Form data updated successfully');
      } catch (error) {
        console.error('Profile: Error fetching customer data:', error);
        toast.error("Failed to fetch profile data. Please try again.");
        
        // Fallback to user data from auth state
        if (user) {
          const fallbackData = {
            firstName: user.first_name || '',
            lastName: user.last_name || '',
            email: user.email || '',
            phone: '',
            address: '',
            city: '',
            postalCode: '',
            country: 'UAE'
          };
          setFormData(fallbackData);
          setHasInitialized(true);
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchCustomerData();
  }, [token, isAuthenticated, hasInitialized, initializeFormData, toast, user]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSessionValid()) {
      toast.error("Session expired. Please sign in again to update your profile.");
      return;
    }
    
    if (user) {
      try {
        const updateData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          billing: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: customerData?.billing?.company || '',
            address_1: formData.address,
            address_2: customerData?.billing?.address_2 || '',
            city: formData.city,
            state: customerData?.billing?.state || '',
            postcode: formData.postalCode,
            country: formData.country,
            email: formData.email,
            phone: formData.phone,
          },
          shipping: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: customerData?.shipping?.company || '',
            address_1: formData.address,
            address_2: customerData?.shipping?.address_2 || '',
            city: formData.city,
            state: customerData?.shipping?.state || customerData?.billing?.state || '',
            postcode: formData.postalCode,
            country: formData.country,
          }
        };

        await dispatch(updateUserProfile({ userId: user.id, userData: updateData })).unwrap();
        
        toast.success("Your profile has been successfully updated.");
      } catch (error) {
        console.error('Profile: Error updating profile:', error);
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  // Memoize the account summary to prevent unnecessary re-renders
  const accountSummary = useMemo(() => ({
    name: user ? `${user.first_name} ${user.last_name}` : '',
    email: formData.email || user?.email || 'Not provided',
    phone: formData.phone || 'Not provided',
    city: formData.city || 'Not provided'
  }), [user, formData.email, formData.phone, formData.city]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to view your profile.</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <User className="h-8 w-8" />
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {(isLoadingProfile || isLoading) ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading profile...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
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
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+971 50 123 4567"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Street address"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Dubai"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="12345"
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </form>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{accountSummary.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{accountSummary.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{accountSummary.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{accountSummary.city}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
