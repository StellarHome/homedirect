/**
 * Tenant Dashboard
 * Application and lease management for tenants
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
  security_deposit_ngn: number;
  images: string[];
  amenities: string[];
}

interface Application {
  id: string;
  property_id: string;
  property_title: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  submitted_at: string;
  monthly_rent_offer_ngn?: number;
}

interface Lease {
  id: string;
  property_title: string;
  landlord_name: string;
  monthly_rent_ngn: number;
  security_deposit_ngn: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'terminated' | 'disputed';
}

export default function TenantDashboard() {
  const [activeTab, setActiveTab] = useState<'browse' | 'applications' | 'leases'>('browse');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showLeaseSigning, setShowLeaseSigning] = useState(false);

  // Mock data
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
      security_deposit_ngn: 500000,
      images: ['/placeholder1.jpg', '/placeholder2.jpg'],
      amenities: ['AC', 'Gym', 'Parking', 'Security'],
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
      security_deposit_ngn: 900000,
      images: ['/placeholder3.jpg', '/placeholder4.jpg'],
      amenities: ['AC', 'Garden', 'Parking', 'Security', 'Generator'],
    },
  ];

  const mockApplications: Application[] = [
    {
      id: '1',
      property_id: '3',
      property_title: 'Cozy 1-Bedroom Studio',
      status: 'pending',
      submitted_at: '2024-02-15',
      monthly_rent_offer_ngn: 180000,
    },
    {
      id: '2',
      property_id: '4',
      property_title: 'Luxury Penthouse',
      status: 'approved',
      submitted_at: '2024-01-20',
      monthly_rent_offer_ngn: 800000,
    },
  ];

  const mockLeases: Lease[] = [
    {
      id: '1',
      property_title: 'Modern 2-Bedroom Apartment',
      landlord_name: 'John Doe',
      monthly_rent_ngn: 250000,
      security_deposit_ngn: 500000,
      start_date: '2024-03-01',
      end_date: '2025-02-28',
      status: 'active',
    },
  ];

  const handleApply = (property: Property) => {
    setSelectedProperty(property);
    setShowApplicationForm(true);
  };

  const handleSignLease = (_lease: Lease) => {
    setShowLeaseSigning(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'terminated':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'disputed':
        return 'bg-orange-100 text-orange-800';
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
              <h1 className="text-2xl font-bold text-gray-900">Tenant Dashboard</h1>
              <p className="text-sm text-gray-600">Browse properties and manage your leases</p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className={`${
                activeTab === 'browse'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Browse Properties
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className={`${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Applications ({mockApplications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('leases')}
              className={`${
                activeTab === 'leases'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Leases ({mockLeases.length})
            </button>
          </nav>
        </div>

        {/* Browse Properties Tab */}
        {activeTab === 'browse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Property Image</span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {property.bedrooms} bed • {property.bathrooms} bath • {property.property_type}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">{property.address}, {property.city}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        ₦{property.monthly_rent_ngn.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">/month</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Deposit: ₦{property.security_deposit_ngn.toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApply(property)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer (NGN)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
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
                {mockApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{application.property_title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.monthly_rent_offer_ngn
                          ? `₦${application.monthly_rent_offer_ngn.toLocaleString()}`
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{application.submitted_at}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {application.status === 'pending' && (
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900"
                        >
                          Withdraw
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Leases Tab */}
        {activeTab === 'leases' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Landlord
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent (NGN)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lease Period
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
                {mockLeases.map((lease) => (
                  <tr key={lease.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lease.property_title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lease.landlord_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₦{lease.monthly_rent_ngn.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Deposit: ₦{lease.security_deposit_ngn.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lease.start_date}</div>
                      <div className="text-xs text-gray-500">to {lease.end_date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lease.status)}`}>
                        {lease.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {lease.status === 'active' && (
                        <button
                          type="button"
                          onClick={() => handleSignLease(lease)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Pay Rent
                        </button>
                      )}
                      <button
                        type="button"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Application Form Modal */}
      {showApplicationForm && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Apply for Property</h3>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">{selectedProperty.title}</h4>
                <p className="text-sm text-gray-600">{selectedProperty.address}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  ₦{selectedProperty.monthly_rent_ngn.toLocaleString()}/month
                </p>
              </div>

              <form className="space-y-4">
                <div>
                  <label htmlFor="move_in_date" className="block text-sm font-medium text-gray-700">
                    Preferred Move-in Date
                  </label>
                  <input
                    type="date"
                    id="move_in_date"
                    name="move_in_date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="lease_duration" className="block text-sm font-medium text-gray-700">
                    Lease Duration (months)
                  </label>
                  <select
                    id="lease_duration"
                    name="lease_duration"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="6">6 months</option>
                    <option value="12" selected>12 months</option>
                    <option value="18">18 months</option>
                    <option value="24">24 months</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="rent_offer" className="block text-sm font-medium text-gray-700">
                    Monthly Rent Offer (NGN) - Optional
                  </label>
                  <input
                    type="number"
                    id="rent_offer"
                    name="rent_offer"
                    placeholder={selectedProperty.monthly_rent_ngn.toString()}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message to Landlord
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell the landlord about yourself..."
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lease Signing Modal */}
      {showLeaseSigning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Sign Lease Agreement</h3>
                <button
                  type="button"
                  onClick={() => setShowLeaseSigning(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Lease Terms</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Monthly Rent: ₦250,000</li>
                    <li>• Security Deposit: ₦500,000</li>
                    <li>• Duration: 12 months</li>
                    <li>• Start Date: March 1, 2024</li>
                    <li>• End Date: February 28, 2025</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Important Notes</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Security deposit will be locked in smart contract escrow</li>
                    <li>• Rent payments are due on the 1st of each month</li>
                    <li>• 30-day notice required for early termination</li>
                    <li>• Platform fee of 5% applies to total rent</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowLeaseSigning(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sign with Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
