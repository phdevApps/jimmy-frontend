"use client";
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import AccountSidebar from '@/components/account/AccountSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PaymentMethods = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to view your payment methods.</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  const formatAddress = (userData: typeof user) => {
    if (!userData?.billing) return 'No address information available';
    
    const parts = [
      userData.billing.address_1,
      userData.billing.address_2,
      userData.billing.city,
      userData.billing.state,
      userData.billing.postcode,
      userData.billing.country
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No address information available';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CreditCard className="h-8 w-8" />
            Payment Methods
          </h1>
          <p className="text-gray-600 mt-2">Manage your payment options and billing addresses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="cards" className="space-y-6">
              <TabsList>
                <TabsTrigger value="cards">Payment Cards</TabsTrigger>
                <TabsTrigger value="addresses">Billing Addresses</TabsTrigger>
              </TabsList>

              <TabsContent value="cards">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Saved Payment Methods
                      </span>
                      <Button size="sm" disabled>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Card
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Payment method management requires integration with a payment processor like Stripe. 
                        No saved payment methods are currently available.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="text-center py-12 text-gray-500">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No Payment Methods</p>
                      <p className="text-sm">Add a payment method to make purchases easier</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Billing Addresses</span>
                      <Button size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Address
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium mb-1">
                              {user?.billing?.first_name && user?.billing?.last_name 
                                ? `${user.billing.first_name} ${user.billing.last_name}` 
                                : user?.first_name && user?.last_name 
                                  ? `${user.first_name} ${user.last_name}`
                                  : 'Default Address'}
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Default
                              </span>
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              {formatAddress(user)}
                            </p>
                            {user?.billing?.email && (
                              <p className="text-sm text-gray-600">
                                Email: {user.billing.email}
                              </p>
                            )}
                            {user?.billing?.phone && (
                              <p className="text-sm text-gray-600">
                                Phone: {user.billing.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
