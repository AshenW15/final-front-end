/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import useAlerts from '@/hooks/useAlerts';
import { getSession } from '@/lib/auth-compat';

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  phone: string;
  useAsBilling: boolean;
}

const ShippingAddress: FC = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  // Sample existing shipping data - in real app, this would come from API
  
  const { warning, AlertModalComponent } = useAlerts();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const getShippingAddress = async () => {
    const formdata = new FormData();
    const session = await getSession();
    const currentloggedInEmail = session?.user.email;
    formdata.append('email', currentloggedInEmail || '');

    try {
      const response = await fetch(`${baseUrl}/get_default_shipping_address.php`, {
        method: 'POST',
        body: formdata,
      });

      const data = await response.json();
      console.log('address', data);
      if (data && Array.isArray(data.allAddresses)) {
        // If backend returns an array of addresses
        setAddresses(data.allAddresses);
      } else if (data && Object.keys(data).length > 0) {
        // If backend returns a single address object
        setAddresses([data]);
      } else {
        // No saved address
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching shipping data:', error);
    }
  };

  useEffect(() => {
    getShippingAddress();
  }, []);

  const [newAddress, setNewAddress] = useState<Address>({
    id: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
    phone: '',
    useAsBilling: false,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddNew = () => {
    setIsFormOpen(true);
    setEditingIndex(null);
    setNewAddress({
      id: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      province: '',
      country: '',
      postalCode: '',
      phone: '',
      useAsBilling: false,
    });
  };

  //for edit exsiting address
  const saveEditedAddress = async () => {
    if (
      !newAddress.firstName ||
      !newAddress.lastName ||
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.phone
    ) {
      warning('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (editingIndex === null) return;

    console.log('new Address', newAddress);

    const formData = new FormData();
    formData.append('address', JSON.stringify(newAddress));

    try {
      const response = await fetch(`${baseUrl}/update_shipping_address.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (result.status === 'success') {
        // Update UI locally
        const updatedAddresses = [...addresses];
        updatedAddresses[editingIndex] = newAddress;
        setAddresses(updatedAddresses);
        setIsFormOpen(false);
        setEditingIndex(null);
      }
    } catch (err) {
      console.error('Error saving address:', err);
    }
  };

  //Save new Address
  const saveNewAddress = async () => {
    const session = await getSession();
    const currentloggedInEmail = session?.user.email;

    if (
      !newAddress.firstName ||
      !newAddress.lastName ||
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.phone
    ) {
      warning('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('address', JSON.stringify(newAddress));
    formData.append('email', currentloggedInEmail || '');
    console.log('new Address', newAddress);
    try {
      const response = await fetch(`${baseUrl}/add_shipping_address.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (result.status === 'success') {
        getShippingAddress();
        setIsFormOpen(false);
        setEditingIndex(null);
      }
    } catch (err) {
      console.error('Error saving address:', err);
    }
  };

  const handleSave = async () => {
    if (editingIndex !== null) {
      saveEditedAddress();
    } else {
      saveNewAddress();
    }
  };

  const handleEdit = async (index: number) => {
    console.log(addresses[index]);
    setNewAddress(addresses[index]);
    setEditingIndex(index);
    setIsFormOpen(true);
  };

  const handleDelete = async(index: number, id: number) => {

     const formData = new FormData();
    const session = await getSession();
    const currentloggedInEmail = session?.user.email;

    formData.append('email', currentloggedInEmail || '');
    formData.append('address_id', String(id));
    formData.append('operation','delete');

    try {
      const response = await fetch(`${baseUrl}/change_default_shipping_address.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (result.status === 'success') {
        console.log(result.message);
      }
    } catch (err) {
      console.error('Error saving address:', err);
    }


    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
  };

  const handleBillingAddressChange = (checked: boolean) => {
    setNewAddress({ ...newAddress, useAsBilling: checked });
  };

  const handleToggleBillingAddress = async (index: number, id: number) => {
    console.log('default address id ', id);

    const formData = new FormData();
    const session = await getSession();
    const currentloggedInEmail = session?.user.email;

    formData.append('email', currentloggedInEmail || '');
    formData.append('address_id', String(id));

    try {
      const response = await fetch(`${baseUrl}/change_default_shipping_address.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (result.status === 'success') {
        console.log(result.message);
      }
    } catch (err) {
      console.error('Error saving address:', err);
    }
    setAddresses(
      addresses.map((addr, i) => ({
        ...addr,
        useAsBilling: i === index ? !addr.useAsBilling : false,
      }))
    );
  };

  return (
    <div className="p-6 bg-white min-h-screen max-w-4xl mx-auto">
      {/* Alert Modal Component */}
      {AlertModalComponent}
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Shipping Address</h1>
        <div className="text-sm text-gray-500">
          {addresses.length} {addresses.length === 1 ? 'Address' : 'Addresses'}
        </div>
      </div>
      <p className="text-md text-gray-600 mb-8">Manage your shipping addresses with ease.</p>

      {/* No Shipping Addresses Message */}
      {addresses.length === 0 && (
        <div className="mb-6">
          <p className="text-gray-600 text-center text-lg">No shipping addresses added yet.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-8 flex space-x-4">
        <button
          onClick={handleAddNew}
          className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-5 py-3 rounded-lg shadow-md hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
        >
          <i className="fas fa-plus mr-2"></i> Add New
        </button>
      </div>

      {/* Form for Adding/Editing Address */}
      {isFormOpen && (
        <div className="bg-gray-50 p-6 rounded-xl text-gray-600">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingIndex !== null ? 'Edit Address' : 'Add New Address'}
          </h2>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={newAddress.firstName}
                  onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={newAddress.lastName}
                  onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                placeholder="Enter full address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Province
                </label>
                <select
                  value={newAddress.province}
                  onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select Province</option>
                  <option value="Eastern Province">Eastern Province</option>
                  <option value="Western Province">Western Province</option>
                  <option value="Central Province">Central Province</option>
                  <option value="Southern Province">Southern Province</option>
                  <option value="Northern Province">Northern Province</option>
                  <option value="North Western Province">North Western Province</option>
                  <option value="North Central Province">North Central Province</option>
                  <option value="Uva Province">Uva Province</option>
                  <option value="Sabaragamuwa Province">Sabaragamuwa Province</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal or zip code
                </label>
                <input
                  type="text"
                  placeholder="Enter postal code"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="billingAddress"
                checked={newAddress.useAsBilling}
                onChange={(e) => handleBillingAddressChange(e.target.checked)}
                className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label htmlFor="billingAddress" className="text-sm text-gray-600">
                Use as billing address
              </label>
            </div>
            {newAddress.useAsBilling && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <i className="fas fa-info-circle mr-2"></i>
                  This will be set as your billing address. Any existing billing address will be
                  replaced.
                </p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSave}
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors duration-200 font-medium"
              >
                {editingIndex !== null ? 'Save Edit' : 'Save New Address'}
              </button>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingIndex(null);
                  setNewAddress({
                    id: '',
                    firstName: '',
                    lastName: '',
                    address: '',
                    city: '',
                    province: '',
                    country: '',
                    postalCode: '',
                    phone: '',
                    useAsBilling: false,
                  });
                }}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display All Addresses */}
      {addresses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Shipping Addresses</h2>
          <div className="space-y-4">
            {addresses.map((addr, index) => (
              <div
                key={addr.id}
                className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-gray-800">
                      <span className="font-medium">Name:</span> {addr.firstName} {addr.lastName}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Address:</span> {addr.address}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">City:</span> {addr.city}, {addr.province}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Phone:</span> {addr.phone}
                    </p>
                    {/* {addr.useAsBilling && (
                      <p className="text-blue-600 font-semibold mt-2">
                        <i className="fas fa-credit-card mr-1"></i>Billing Address
                      </p>
                    )} */}
                  </div>
                  <div className="flex flex-col space-y-3">
                    {/* Edit and Delete Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 text-sm font-medium"
                        title="Edit Address"
                      >
                        <i className="fas fa-edit mr-1"></i>Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index, Number(addr.id))}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                        title="Delete Address"
                      >
                        <i className="fas fa-trash mr-1"></i>Delete
                      </button>
                    </div>
                    {/* Billing Address Toggle */}
                    <button
                      onClick={() => handleToggleBillingAddress(index, Number(addr.id))}
                      className={`text-xs px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
                        addr.useAsBilling
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title={
                        addr.useAsBilling ? 'Remove as billing address' : 'Set as billing address'
                      }
                    >
                      <i
                        className={`fas ${
                          addr.useAsBilling ? 'fa-credit-card' : 'fa-credit-card'
                        } mr-1`}
                      ></i>
                      {addr.useAsBilling ? 'Remove Billing' : 'Set as Billing'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;
