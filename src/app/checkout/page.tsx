"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, CreditCard, MapPin, User, Tag, Truck, Plus, Home, Package, Save } from 'lucide-react';
import { closeCart, clearCart } from '@/features/cart/cartSlice';
import { getCustomer, Customer, updateCustomer, getPaymentGateways, WooCommercePaymentGateway, validateCoupon, createOrder, CreateOrderData } from '@/services/wooCommerceApi';
import { toast } from '@/components/ui/sonner';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';

const checkoutFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  address: z.string().min(5, 'Please enter a complete address'),
  city: z.string().min(2, 'Please enter your city'),
  customCity: z.string().optional(),
  state: z.string().min(1, 'Please select your state'),
  postalCode: z.string().optional(),
  country: z.string().min(2, 'Please select your country'),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

interface PaymentGateway {
  id: string;
  name: string;
  type: 'card' | 'digital_wallet' | 'bank_transfer' | 'cash_on_delivery';
  enabled: boolean;
  icon?: string;
}

interface SavedAddress {
  id: string;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const Checkout = () => {
  return <div>
  Checkout page
  </div>;
}

export default  Checkout