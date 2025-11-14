import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, CreditCard, MapPin, User, Tag, Truck, Plus, Home, Package, Save } from 'lucide-react';
import { closeCart, clearCart } from '../features/cart/cartSlice';
import { getCustomer, Customer, updateCustomer, getPaymentGateways, WooCommercePaymentGateway, validateCoupon, createOrder, CreateOrderData } from '../services/wooCommerceApi';
import { toast } from '../components/ui/sonner';
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
  const dispatch = useDispatch();
  const { items, total } = useTypedSelector(state => state.cart);
  const { user, isAuthenticated } = useTypedSelector(state => state.auth);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [paymentGateways, setPaymentGateways] = useState<WooCommercePaymentGateway[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [showCustomCity, setShowCustomCity] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Country, State, City data
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Load countries on mount
  useEffect(() => {
    GetCountries().then(result => {
      console.log('Countries loaded:', result);
      setCountries(result);
    });
  }, []);

  // Get default form values based on selected address and customer data
  const getDefaultValues = (): Partial<CheckoutFormData> => {
    const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);

    if (selectedAddress) {
      return {
        email: customerData?.email || user?.email || '',
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        address: selectedAddress.address,
        city: selectedAddress.city,
        customCity: '',
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
        paymentMethod: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
      };
    }

    return {
      email: customerData?.email || user?.email || '',
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      address: '',
      city: '',
      customCity: '',
      state: '',
      postalCode: '',
      country: '',
      paymentMethod: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    };
  };

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: getDefaultValues(),
  });

  // Watch for country/state changes to update dependent dropdowns
  const watchedCountry = form.watch('country');
  const watchedState = form.watch('state');
  const watchedCity = form.watch('city');

  // Handle city selection change
  useEffect(() => {
    setShowCustomCity(watchedCity === 'Other');
    if (watchedCity !== 'Other') {
      form.setValue('customCity', '');
    }
  }, [watchedCity, form]);

  // Load states when country changes
  useEffect(() => {
    if (watchedCountry) {
      console.log('Country changed to:', watchedCountry);
      const selectedCountry = countries.find(country => country.iso2 === watchedCountry);
      console.log('Selected country object:', selectedCountry);
      if (selectedCountry) {
        console.log('Getting states for country ID:', selectedCountry.id);
        GetState(selectedCountry.id).then(result => {
          console.log('States loaded:', result);
          setStates(result);
          setCities([]); // Reset cities when country changes
          form.setValue('state', '');
          // Don't reset city here - let it be handled by state change
        }).catch(error => {
          console.error('Error loading states:', error);
        });
      }
    }
  }, [watchedCountry, countries, form]);

  // Load cities when state changes
  useEffect(() => {
    if (watchedCountry && watchedState) {
      console.log('State changed to:', watchedState);
      const selectedCountry = countries.find(country => country.iso2 === watchedCountry);
      const selectedState = states.find(state => state.state_code === watchedState);
      console.log('Selected country for cities:', selectedCountry);
      console.log('Selected state for cities:', selectedState);
      if (selectedCountry && selectedState) {
        console.log('Getting cities for country ID:', selectedCountry.id, 'and state ID:', selectedState.id);
        GetCity(selectedCountry.id, selectedState.id).then(result => {
          console.log('Cities loaded:', result);
          setCities(result);
          // Only reset city value, don't clear it if cities are available
          const currentCity = form.getValues('city');
          const cityExists = result.some((city: any) => city.name === currentCity);
          if (!cityExists && currentCity !== 'Other') {
            form.setValue('city', '');
          }
        }).catch(error => {
          console.error('Error loading cities:', error);
          setCities([]);
          if (form.getValues('city') !== 'Other') {
            form.setValue('city', '');
          }
        });
      }
    } else if (watchedCountry && !watchedState) {
      // Clear cities if state is not selected
      setCities([]);
      if (form.getValues('city') !== 'Other') {
        form.setValue('city', '');
      }
    }
  }, [watchedState, watchedCountry, countries, states, form]);

  // Initialize form with user data when user is available
  useEffect(() => {
    if (user || customerData) {
      const initialValues = getDefaultValues();
      console.log('Setting initial form values:', initialValues);
      form.reset(initialValues);
    }
  }, [user, customerData, savedAddresses, selectedAddressId]);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (!user?.id || !isAuthenticated) {
        return;
      }

      setLoadingAddresses(true);
      try {
        console.log('Fetching customer addresses for checkout:', user.id);
        const fetchedCustomerData = await getCustomer(user.id);
        console.log('Customer data for checkout:', fetchedCustomerData);

        // Store customer data for form initialization
        setCustomerData(fetchedCustomerData);

        const addresses: SavedAddress[] = [];

        // Add billing address if it exists
        if (fetchedCustomerData.billing && fetchedCustomerData.billing.address_1) {
          addresses.push({
            id: 'billing',
            type: 'billing',
            firstName: fetchedCustomerData.billing.first_name || '',
            lastName: fetchedCustomerData.billing.last_name || '',
            phone: fetchedCustomerData.billing.phone || '',
            address: fetchedCustomerData.billing.address_1 + (fetchedCustomerData.billing.address_2 ? ', ' + fetchedCustomerData.billing.address_2 : ''),
            city: fetchedCustomerData.billing.city || '',
            state: fetchedCustomerData.billing.state || '',
            postalCode: fetchedCustomerData.billing.postcode || '',
            country: fetchedCustomerData.billing.country || 'AE'
          });
        }

        // Add shipping address if it exists and is different from billing
        if (fetchedCustomerData.shipping && fetchedCustomerData.shipping.address_1) {
          addresses.push({
            id: 'shipping',
            type: 'shipping',
            firstName: fetchedCustomerData.shipping.first_name || '',
            lastName: fetchedCustomerData.shipping.last_name || '',
            phone: fetchedCustomerData.billing?.phone || '', // Use billing phone
            address: fetchedCustomerData.shipping.address_1 + (fetchedCustomerData.shipping.address_2 ? ', ' + fetchedCustomerData.shipping.address_2 : ''),
            city: fetchedCustomerData.shipping.city || '',
            state: fetchedCustomerData.shipping.state || '',
            postalCode: fetchedCustomerData.shipping.postcode || '',
            country: fetchedCustomerData.shipping.country || 'AE'
          });
        }

        console.log('Processed addresses for checkout:', addresses);
        setSavedAddresses(addresses);

        // Auto-select first address if available
        if (addresses.length > 0) {
          setSelectedAddressId(addresses[0].id);
        }
      } catch (error) {
        console.error('Error fetching customer addresses for checkout:', error);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchUserAddresses();
  }, [user?.id, isAuthenticated]);

  useEffect(() => {
    const fetchPaymentGateways = async () => {
      try {
        console.log('Fetching real payment gateways from WooCommerce');
        const gateways = await getPaymentGateways();
        console.log('Received payment gateways:', gateways);
        setPaymentGateways(gateways);
      } catch (error) {
        console.error('Error loading payment gateways:', error);
        // Set fallback gateways if API fails
        setPaymentGateways([
          { id: 'cod', title: 'Cash on Delivery', description: 'Pay with cash upon delivery.', order: 1, enabled: true, method_title: 'Cash on Delivery', method_description: '', method_supports: [], settings: {} },
          { id: 'bacs', title: 'Direct Bank Transfer', description: 'Make your payment directly into our bank account.', order: 2, enabled: true, method_title: 'Direct Bank Transfer', method_description: '', method_supports: [], settings: {} }
        ]);
      }
    };

    fetchPaymentGateways();
  }, []);

  useEffect(() => {
    const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);

    if (selectedAddress && selectedAddressId !== 'new') {
      const updatedValues = {
        ...form.getValues(),
        email: customerData?.email || user?.email || form.getValues().email,
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        address: selectedAddress.address,
        city: selectedAddress.city,
        customCity: '',
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
      };
      form.reset(updatedValues);
    } else if (selectedAddressId === 'new') {
      const newAddressValues = {
        ...form.getValues(),
        email: customerData?.email || user?.email || form.getValues().email,
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        address: '',
        city: '',
        customCity: '',
        state: '',
        postalCode: '',
        country: '',
      };
      form.reset(newAddressValues);
    }
  }, [selectedAddressId, savedAddresses, form, user, customerData]);

  const selectedGateway = paymentGateways.find(gateway => gateway.id === selectedPaymentMethod);
  const requiresCardDetails = selectedGateway?.method_supports?.includes('products') && selectedGateway?.id !== 'cod' && selectedGateway?.id !== 'bacs';

  const saveNewAddress = async () => {
    if (!user?.id || !isAuthenticated) {
      toast.error("You must be logged in to save addresses.");
      return;
    }

    const formData = form.getValues();
    const finalCity = formData.city === 'Other' ? formData.customCity : formData.city;

    if (!formData.address || !finalCity || !formData.state || !formData.country) {
      toast.error("Please fill in all required address fields before saving.");
      return;
    }

    setIsSavingAddress(true);
    try {
      const addressData = {
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: '', // Add missing company property
          address_1: formData.address,
          address_2: '',
          city: finalCity,
          state: formData.state,
          postcode: formData.postalCode || '',
          country: formData.country,
          email: formData.email,
          phone: ''
        }
      };

      console.log('Saving new address:', addressData);
      await updateCustomer(user.id, addressData);

      // Refresh addresses list
      const updatedCustomer = await getCustomer(user.id);
      setCustomerData(updatedCustomer);

      // Update saved addresses
      const addresses: SavedAddress[] = [];
      if (updatedCustomer.billing && updatedCustomer.billing.address_1) {
        addresses.push({
          id: 'billing',
          type: 'billing',
          firstName: updatedCustomer.billing.first_name || '',
          lastName: updatedCustomer.billing.last_name || '',
          phone: updatedCustomer.billing.phone || '',
          address: updatedCustomer.billing.address_1 + (updatedCustomer.billing.address_2 ? ', ' + updatedCustomer.billing.address_2 : ''),
          city: updatedCustomer.billing.city || '',
          state: updatedCustomer.billing.state || '',
          postalCode: updatedCustomer.billing.postcode || '',
          country: updatedCustomer.billing.country || 'AE'
        });
      }
      setSavedAddresses(addresses);
      setSelectedAddressId('billing');

      toast.success("Address saved successfully!");
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error("Failed to save address. Please try again.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsProcessing(true);
    setCouponError('');

    try {
      console.log('Validating coupon:', couponCode);
      const result = await validateCoupon(couponCode.trim());
      
      if (result.valid && result.coupon && result.discount !== undefined) {
        setAppliedCoupon({
          code: result.coupon.code,
          discount: result.discount
        });
        setCouponCode('');
        
        toast.success(`${result.coupon.code} - €${result.discount.toFixed(2)} discount applied`);
      } else {
        setCouponError(result.error || 'Invalid coupon code');
      }
    } catch (error: any) {
      console.error('Coupon validation error:', error);
      setCouponError(error.message || 'Failed to validate coupon');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const finalTotal = appliedCoupon ? Math.max(0, total - appliedCoupon.discount) : total;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    try {
      // Use custom city if "Other" was selected
      const finalCity = data.city === 'Other' ? data.customCity : data.city;

      // Find the selected payment gateway
      const selectedGateway = paymentGateways.find(gateway => gateway.id === selectedPaymentMethod);
      
      if (!selectedGateway) {
        throw new Error('Please select a valid payment method');
      }

      // Prepare order data for WooCommerce
      const orderData: CreateOrderData = {
        payment_method: selectedPaymentMethod,
        payment_method_title: selectedGateway.title,
        set_paid: selectedPaymentMethod === 'cod' ? false : true, // COD orders are not paid initially
        billing: {
          first_name: data.firstName,
          last_name: data.lastName,
          address_1: data.address,
          address_2: '',
          city: finalCity || '',
          state: data.state,
          postcode: data.postalCode || '',
          country: data.country,
          email: data.email,
          phone: ''
        },
        shipping: {
          first_name: data.firstName,
          last_name: data.lastName,
          address_1: data.address,
          address_2: '',
          city: finalCity || '',
          state: data.state,
          postcode: data.postalCode || '',
          country: data.country
        },
        line_items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_lines: [{
          method_id: 'free_shipping',
          method_title: 'Free Shipping',
          total: '0'
        }]
      };

      // Add coupon if applied
      if (appliedCoupon) {
        orderData.coupon_lines = [{
          code: appliedCoupon.code
        }];
      }

      console.log('Submitting order to WooCommerce:', orderData);

      // Create the order in WooCommerce
      const createdOrder = await createOrder(orderData);
      
      console.log('Order created successfully:', createdOrder);

      // Clear the cart after successful order creation
      dispatch(clearCart());

      toast.success(`Order #${createdOrder.id} has been created. You will receive a confirmation email shortly.`);

      // Redirect to a success page or orders page
      setTimeout(() => {
        window.location.href = '/orders';
      }, 2000);

    } catch (error: any) {
      console.error('Order submission failed:', error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to your cart before checkout.</p>
            <Button onClick={() => window.location.href = '/products'}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Billing Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Saved Address Cards */}
                    {isAuthenticated && savedAddresses.length > 0 && (
                      <div className="space-y-3">
                        <FormLabel>Select Billing Address</FormLabel>
                        <div className="grid gap-3">
                          {savedAddresses.map((address) => (
                            <div
                              key={address.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedAddressId === address.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedAddressId(address.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  {address.type === 'billing' ? (
                                    <Home className="h-5 w-5 text-gray-500" />
                                  ) : (
                                    <Package className="h-5 w-5 text-gray-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">
                                    {address.firstName} {address.lastName}
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    {address.address}
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    {address.city}, {address.state} {address.postalCode}
                                  </div>
                                  <div className="text-xs text-gray-500 capitalize mt-1">
                                    {address.type} Address
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedAddressId === 'new'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedAddressId('new')}
                          >
                            <div className="flex items-center gap-3">
                              <Plus className="h-5 w-5 text-gray-500" />
                              <span className="text-sm font-medium">Add New Address</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                      <>
                        {/* Save Address Button - only show for logged in users */}
                        {isAuthenticated && (
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={saveNewAddress}
                              disabled={isSavingAddress}
                              className="flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              {isSavingAddress ? 'Saving...' : 'Save Address'}
                            </Button>
                          </div>
                        )}

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address *</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main Street" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country *</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white z-50">
                                    {countries.map((country) => (
                                      <SelectItem key={country.iso2} value={country.iso2}>
                                        {country.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State *</FormLabel>
                              <FormControl>
                                <Select 
                                  onValueChange={(value) => {
                                    console.log('State selection changed to:', value);
                                    field.onChange(value);
                                  }} 
                                  value={field.value}
                                  disabled={states.length === 0}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={states.length === 0 ? "Select country first" : "Select state"} />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
                                    {states.map((state) => (
                                      <SelectItem key={state.state_code} value={state.state_code}>
                                        {state.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City *</FormLabel>
                                <FormControl>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    value={field.value}
                                    disabled={cities.length === 0}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder={cities.length === 0 ? "Select state first" : "Select city"} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
                                      {cities.map((city, index) => (
                                        <SelectItem key={`${city.name}-${index}`} value={city.name}>
                                          {city.name}
                                        </SelectItem>
                                      ))}
                                      <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="12345" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Custom City Input */}
                        {showCustomCity && (
                          <FormField
                            control={form.control}
                            name="customCity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Enter City Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your city name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Payment Method *</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedPaymentMethod(value);
                              }} 
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Choose payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                {paymentGateways.map((gateway) => (
                                  <SelectItem key={gateway.id} value={gateway.id}>
                                    <div className="flex items-center gap-2">
                                      {gateway.id === 'cod' && <Truck className="h-4 w-4" />}
                                      {(gateway.id === 'stripe' || gateway.id === 'paypal') && <CreditCard className="h-4 w-4" />}
                                      <span>{gateway.title}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Card Details - only show if card payment is selected */}
                    {requiresCardDetails && (
                      <div className="space-y-4 pt-4 border-t">
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="1234 5678 9012 3456" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date *</FormLabel>
                                <FormControl>
                                  <Input placeholder="MM/YY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV *</FormLabel>
                                <FormControl>
                                  <Input placeholder="123" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* Payment method info */}
                    {selectedGateway && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-800">
                          {selectedGateway.id === 'cod' && <Truck className="h-5 w-5" />}
                          {selectedGateway.id !== 'cod' && <CreditCard className="h-5 w-5" />}
                          <span className="font-medium">{selectedGateway.title}</span>
                        </div>
                        {selectedGateway.description && (
                          <p className="text-sm text-blue-600 mt-1">
                            {selectedGateway.description}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Place Order - €${finalTotal.toFixed(2)}`}
                </Button>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                {/* Coupon Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-sm">Coupon Code</span>
                  </div>

                  {!appliedCoupon ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          type="button"
                          variant="outline" 
                          onClick={applyCoupon}
                          disabled={isProcessing}
                        >
                          Apply
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-sm text-red-600">{couponError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                      <span className="text-green-800 text-sm font-medium">
                        {appliedCoupon.code} applied
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="text-green-700 hover:text-green-800"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-€{appliedCoupon.discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>€{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
