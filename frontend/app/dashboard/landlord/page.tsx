/**
 * Landlord Dashboard
 * Property listing management for landlords
 */

'use client';

import { useState } from 'react';
import WalletConnect from '@/components/WalletConnect';

interface Property {
  id: string;
  title: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  state: string;
  monthly_rent_ngn: number;
  status: string;
  created_at: string;
}

export default function LandlordDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Mock data - in production, fetch from API
  const mockProperties: Property[] = [
    {
      id: '1',
      title: 'Modern 2-Bedroom Apartment',
      property_type: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      address: '123 Lekki Expressway',
      city: 'Lagos',
      state: 'Lagos',
      monthly_rent_ngn: 250000,
      status: 'active',
      created_at: '2024-01-15',
    },
    {
      id: '2',
      title: 'Spacious 3-Bedroom House',
      property_type: 'house',
      bedrooms: 3,
      bathrooms: 3,
      address: '45 Admiralty Way',
      city: 'Lekki',
      state: 'Lagos',
      monthly_rent_ngn: 450000,
      status: 'pending',
      created_at: '2024-02-01',
    },
  ];

  const handleAddProperty = () => {
    setShowAddForm(true);
    setSelectedProperty(null);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowAddForm(true);
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Landlord Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your property listings</p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total Properties</div>
            <div className="text-3xl font-bold text-gray-900">{mockProperties.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Active Listings</div>
            <div className="text-3xl font-bold text-green-600">
              {mockProperties.filter(p => p.status === 'active').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Pending Approval</div>
            <div className="text-3xl font-bold text-yellow-600">
              {mockProperties.filter(p => p.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Rented</div>
            <div className="text-3xl font-bold text-blue-600">
              {mockProperties.filter(p => p.status === 'rented').length}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Properties</h2>
          <button
            type="button"
            onClick={handleAddProperty}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Property
          </button>
        </div>

        {/* Property List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rent (NGN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{property.title}</div>
                    <div className="text-sm text-gray-500">
                      {property.bedrooms} bed • {property.bathrooms} bath • {property.property_type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.address}</div>
                    <div className="text-sm text-gray-500">{property.city}, {property.state}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₦{property.monthly_rent_ngn.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleEditProperty(property)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProperty(property.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Property Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedProperty ? 'Edit Property' : 'Add New Property'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Property Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      defaultValue={selectedProperty?.title}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Modern 2-Bedroom Apartment"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">
                        Property Type
                      </label>
                      <select
                        id="property_type"
                        name="property_type"
                        defaultValue={selectedProperty?.property_type}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="flat">Flat</option>
                        <option value="studio">Studio</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        defaultValue={selectedProperty?.status || 'pending'}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="rented">Rented</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        id="bedrooms"
                        name="bedrooms"
                        defaultValue={selectedProperty?.bedrooms}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        id="bathrooms"
                        name="bathrooms"
                        defaultValue={selectedProperty?.bathrooms}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      defaultValue={selectedProperty?.address}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        defaultValue={selectedProperty?.city}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        defaultValue={selectedProperty?.state}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="monthly_rent_ngn" className="block text-sm font-medium text-gray-700">
                      Monthly Rent (NGN)
                    </label>
                    <input
                      type="number"
                      id="monthly_rent_ngn"
                      name="monthly_rent_ngn"
                      defaultValue={selectedProperty?.monthly_rent_ngn}
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="250000"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {selectedProperty ? 'Update Property' : 'Add Property'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
