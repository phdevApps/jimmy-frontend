"use client";

import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface TrackingInfo {
  orderNumber: string;
  status: 'processing' | 'shipped' | 'delivered';
  estimatedDelivery: string;
  currentLocation: string;
  trackingSteps: {
    status: string;
    date: string;
    location: string;
    completed: boolean;
  }[];
}

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock tracking data
  const mockTrackingData: { [key: string]: TrackingInfo } = {
    'JMY001234': {
      orderNumber: 'JMY001234',
      status: 'shipped',
      estimatedDelivery: 'January 15, 2025',
      currentLocation: 'Distribution Center - New York',
      trackingSteps: [
        { status: 'Order Confirmed', date: 'Jan 10, 2025 - 2:30 PM', location: 'Jimmy Warehouse', completed: true },
        { status: 'Processing', date: 'Jan 11, 2025 - 9:15 AM', location: 'Jimmy Warehouse', completed: true },
        { status: 'Shipped', date: 'Jan 12, 2025 - 4:20 PM', location: 'Jimmy Warehouse', completed: true },
        { status: 'In Transit', date: 'Jan 13, 2025 - 8:00 AM', location: 'Distribution Center - NY', completed: true },
        { status: 'Out for Delivery', date: 'Estimated: Jan 15, 2025', location: 'Local Delivery Hub', completed: false },
        { status: 'Delivered', date: 'Estimated: Jan 15, 2025', location: 'Your Address', completed: false }
      ]
    },
    'JMY005678': {
      orderNumber: 'JMY005678',
      status: 'delivered',
      estimatedDelivery: 'Delivered',
      currentLocation: 'Delivered to customer',
      trackingSteps: [
        { status: 'Order Confirmed', date: 'Jan 5, 2025 - 1:15 PM', location: 'Jimmy Warehouse', completed: true },
        { status: 'Processing', date: 'Jan 6, 2025 - 10:30 AM', location: 'Jimmy Warehouse', completed: true },
        { status: 'Shipped', date: 'Jan 7, 2025 - 3:45 PM', location: 'Jimmy Warehouse', completed: true },
        { status: 'In Transit', date: 'Jan 8, 2025 - 7:20 AM', location: 'Distribution Center', completed: true },
        { status: 'Out for Delivery', date: 'Jan 9, 2025 - 8:30 AM', location: 'Local Delivery Hub', completed: true },
        { status: 'Delivered', date: 'Jan 9, 2025 - 2:15 PM', location: 'Front Door', completed: true }
      ]
    }
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTrackingInfo(null);

    // Simulate API call
    setTimeout(() => {
      const foundOrder = mockTrackingData[orderNumber.toUpperCase()];
      if (foundOrder) {
        setTrackingInfo(foundOrder);
      } else {
        setError('Order not found. Please check your order number and try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'shipped':
        return <Truck className="h-6 w-6 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      default:
        return <Package className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Order Tracking</h1>
          <p className="text-xl text-blue-100">Track your Jimmy product delivery status</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Your Order</h2>
          
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter your order number (e.g., JMY001234)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Tracking Results */}
        {trackingInfo && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order #{trackingInfo.orderNumber}</h2>
                <p className="text-gray-600">Current Location: {trackingInfo.currentLocation}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(trackingInfo.status)}`}>
                  {getStatusIcon(trackingInfo.status)}
                  <span className="ml-2 capitalize">{trackingInfo.status}</span>
                </span>
                <p className="text-sm text-gray-600 mt-2">
                  Estimated Delivery: {trackingInfo.estimatedDelivery}
                </p>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Timeline</h3>
              
              {trackingInfo.trackingSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.status}
                      </h4>
                      <span className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.date}
                      </span>
                    </div>
                    <p className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demo Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Demo Instructions</h3>
          <p className="text-blue-700 mb-2">Try these sample order numbers:</p>
          <ul className="text-blue-700 space-y-1">
            <li>• <code className="bg-blue-100 px-2 py-1 rounded">JMY001234</code> - In Transit Order</li>
            <li>• <code className="bg-blue-100 px-2 py-1 rounded">JMY005678</code> - Delivered Order</li>
          </ul>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">Can't find your order or have questions about delivery?</p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
