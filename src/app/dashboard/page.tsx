"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, ShoppingBag, Heart, Calendar, User, Mail, Loader2 } from 'lucide-react';
import AccountSidebar from '@/components/account/AccountSidebar';
import { getCustomerOrders, getUserProfile, Customer } from '@/services/wooCommerceApi';

const Dashboard = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [customerData, setCustomerData] = useState<Customer | null>(null);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['customer-orders', user?.id],
    queryFn: () => user?.id ? getCustomerOrders(user.id) : Promise.resolve([]),
    enabled: !!user?.id && !!token,
  });

  // Fetch customer data for complete profile information
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!token || !isAuthenticated) return;
      
      try {
        const customer = await getUserProfile(token);
        setCustomerData(customer);
      } catch (error) {
        console.error('Dashboard: Error fetching customer data:', error);
      }
    };

    fetchCustomerData();
  }, [token, isAuthenticated]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to view your dashboard.</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  const totalOrders = orders?.length || 0;
  const totalSpent = orders?.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0) || 0;
  const memberSince = user.date_created ? new Date(user.date_created).getFullYear() : new Date().getFullYear();

  // Use customer data email if available, fallback to user data
  const displayEmail = customerData?.email || user.email || user.billing?.email || 'Not provided';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.first_name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{totalOrders}</div>
                      <p className="text-xs text-muted-foreground">
                        Total spent: AED {totalSpent.toFixed(2)}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {orders?.filter(order => {
                          const orderDate = new Date(order.date_created);
                          const thirtyDaysAgo = new Date();
                          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                          return orderDate >= thirtyDaysAgo;
                        }).length || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{memberSince}</div>
                  <p className="text-xs text-muted-foreground">Valued customer</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <ShoppingBag className="h-5 w-5 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.date_created).toLocaleDateString()} - AED {order.total}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No orders found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{user.first_name} {user.last_name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{displayEmail}</span>
                </div>
                {(customerData?.billing?.phone || user.billing?.phone) && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="h-4 w-4 text-gray-500">📞</span>
                    <span>{customerData?.billing?.phone || user.billing?.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
