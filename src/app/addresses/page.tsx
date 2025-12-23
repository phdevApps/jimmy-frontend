"use client";
import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2, Home, Building } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getCustomer, updateCustomer, Customer } from '@/services/wooCommerceApi';

interface Address {
  id: string;
  type: 'billing' | 'shipping' | 'other';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  emirate: string;
  postalCode: string;
  country: string;
}

const Addresses = () => {
  const { user, isAuthenticated } = useTypedSelector(state => state.auth);
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    type: 'billing',
    isDefault: false,
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    emirate: 'Dubai',
    postalCode: '',
    country: 'UAE'
  });

  // Fetch user addresses on component mount
  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (!user?.id || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching customer addresses for user:', user.id);
        const customerData = await getCustomer(user.id);
        console.log('Customer data received:', customerData);
        
        const userAddresses: Address[] = [];
        
        // Add billing address if it exists and has required fields
        if (customerData.billing && customerData.billing.address_1) {
          userAddresses.push({
            id: 'billing',
            type: 'billing',
            isDefault: true, // Billing is typically the default
            firstName: customerData.billing.first_name || '',
            lastName: customerData.billing.last_name || '',
            phone: customerData.billing.phone || '',
            address: customerData.billing.address_1 + (customerData.billing.address_2 ? ', ' + customerData.billing.address_2 : ''),
            city: customerData.billing.city || '',
            emirate: customerData.billing.state || 'Dubai',
            postalCode: customerData.billing.postcode || '',
            country: customerData.billing.country || 'UAE'
          });
        }
        
        // Always add shipping address if it exists and has required fields
        if (customerData.shipping && customerData.shipping.address_1) {
          userAddresses.push({
            id: 'shipping',
            type: 'shipping',
            isDefault: userAddresses.length === 0, // Default if no billing address
            firstName: customerData.shipping.first_name || '',
            lastName: customerData.shipping.last_name || '',
            phone: customerData.billing?.phone || '', // Use billing phone since shipping doesn't have phone
            address: customerData.shipping.address_1 + (customerData.shipping.address_2 ? ', ' + customerData.shipping.address_2 : ''),
            city: customerData.shipping.city || '',
            emirate: customerData.shipping.state || 'Dubai',
            postalCode: customerData.shipping.postcode || '',
            country: customerData.shipping.country || 'UAE'
          });
        }
        
        console.log('Processed addresses:', userAddresses);
        setAddresses(userAddresses);
      } catch (error) {
        console.error('Error fetching customer addresses:', error);
        toast.error("Failed to load your addresses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAddresses();
  }, [user?.id, isAuthenticated, toast]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to manage your addresses.</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-gray-600">Fetching your addresses...</p>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!user?.id) return;

      // Update the customer data via WooCommerce API
      const updateData: Partial<Customer> = {};
      
      if (formData.type === 'billing') {
        updateData.billing = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: '',
          address_1: formData.address,
          address_2: '',
          city: formData.city,
          state: formData.emirate,
          postcode: formData.postalCode,
          country: formData.country,
          email: user.email || '',
          phone: formData.phone
        };
      } else if (formData.type === 'shipping') {
        updateData.shipping = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: '',
          address_1: formData.address,
          address_2: '',
          city: formData.city,
          state: formData.emirate,
          postcode: formData.postalCode,
          country: formData.country
        };
      }

      await updateCustomer(user.id, updateData);

      // Refresh the addresses list
      const customerData = await getCustomer(user.id);
      const userAddresses: Address[] = [];
      
      if (customerData.billing && customerData.billing.address_1) {
        userAddresses.push({
          id: 'billing',
          type: 'billing',
          isDefault: true,
          firstName: customerData.billing.first_name || '',
          lastName: customerData.billing.last_name || '',
          phone: customerData.billing.phone || '',
          address: customerData.billing.address_1 + (customerData.billing.address_2 ? ', ' + customerData.billing.address_2 : ''),
          city: customerData.billing.city || '',
          emirate: customerData.billing.state || 'Dubai',
          postalCode: customerData.billing.postcode || '',
          country: customerData.billing.country || 'UAE'
        });
      }
      
      // Always add shipping address if it exists
      if (customerData.shipping && customerData.shipping.address_1) {
        userAddresses.push({
          id: 'shipping',
          type: 'shipping',
          isDefault: userAddresses.length === 0,
          firstName: customerData.shipping.first_name || '',
          lastName: customerData.shipping.last_name || '',
          phone: customerData.billing?.phone || '',
          address: customerData.shipping.address_1 + (customerData.shipping.address_2 ? ', ' + customerData.shipping.address_2 : ''),
          city: customerData.shipping.city || '',
          emirate: customerData.shipping.state || 'Dubai',
          postalCode: customerData.shipping.postcode || '',
          country: customerData.shipping.country || 'UAE'
        });
      }
      
      setAddresses(userAddresses);
      
      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        type: 'billing',
        isDefault: false,
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        emirate: 'Dubai',
        postalCode: '',
        country: 'UAE'
      });

      toast.success(editingAddress ? "Address updated successfully" : "Address added successfully");
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error("Failed to save address. Please try again.");
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    // For now, we can't actually delete billing/shipping addresses
    // This would require setting them to empty in WooCommerce
    toast.info("Billing and shipping addresses cannot be deleted, only edited.");
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success("Your default address has been updated.");
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'billing':
        return <Home className="h-4 w-4" />;
      case 'shipping':
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MapPin className="h-8 w-8" />
              My Addresses
            </h1>
            <p className="text-gray-600 mt-2">Manage your delivery addresses</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>

        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+971 50 123 4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emirate">Emirate</Label>
                  <select
                    id="emirate"
                    name="emirate"
                    value={formData.emirate}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                    <option value="Ajman">Ajman</option>
                    <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                    <option value="Fujairah">Fujairah</option>
                    <option value="Umm Al Quwain">Umm Al Quwain</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Address Type</Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="billing">Billing</option>
                  <option value="shipping">Shipping</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="rounded border-input"
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit">
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingAddress(null);
                    setFormData({
                      type: 'billing',
                      isDefault: false,
                      firstName: '',
                      lastName: '',
                      phone: '',
                      address: '',
                      city: '',
                      emirate: 'Dubai',
                      postalCode: '',
                      country: 'UAE'
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {addresses.length === 0 ? (
          <Card className="p-8 text-center">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No addresses found</h3>
            <p className="text-gray-600 mb-4">Add your first address to get started with deliveries.</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <Card key={address.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getAddressIcon(address.type)}
                    <span className="font-medium capitalize">{address.type}</span>
                    {address.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">{address.firstName} {address.lastName}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  <p className="text-sm text-gray-600">{address.address}</p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.emirate} {address.postalCode}
                  </p>
                  <p className="text-sm text-gray-600">{address.country}</p>
                </div>

                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
