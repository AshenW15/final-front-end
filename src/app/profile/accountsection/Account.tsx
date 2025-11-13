/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react';
import {
  Heart,
  Clock,
  Gift,
  ShoppingBag,
  FileText,
  DollarSign,
  ChevronRight,
  Ticket,
  CreditCard,
  Star,
  Users,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
 const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
interface AccountProps {
  setActiveComponent: (component: string) => void;
}

const Account: FC<AccountProps> = ({ setActiveComponent }) => {
  const { user } = useAuth();
  const [username, setUsername] = useState('Guest');
  const [userImage, setUserImage] = useState<string | null>(null);

   useEffect(() => {
    const fetchUserProfile = async () => {
    if (user) {
     try {
        const response = await fetch(`${baseUrl}/get_user_profile.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email, // Pass the user's email to the backend
          }),
        });

        const data = await response.json();
        console.log('Fetched user profile data:', data);

        // If the backend returns the user data, update the profile state
        if (data.success) {
          const imageUrl =
            data.profile_picture && data.profile_picture.startsWith('https://lh3.googleusercontent.com')
              ? data.profile_picture // If it's from Google, use the URL directly
              : `${baseUrl}/${data.profile_picture}`; // If it's a local image, construct the URL

          setUsername(data.first_name + ' ' + data.last_name); // Combine first and last name for the username
          setUserImage(imageUrl); // Set the profile image
        } else {
          console.error('Failed to fetch user profile:', data.message);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
    } 
  }else {
      setUsername('Guest');
      setUserImage(null);
      setLoading(false);
    }

  };
  fetchUserProfile();
}, [user]); 

  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
        <h1 className="text-4xl font-bold animate-pulse flex items-center space-x-1">
          <span className="text-yellow-500 animate-bounce drop-shadow-[0_0_8px_rgb(234,179,8)] font-extrabold">
            S
          </span>
          <span className="text-white">TOREVIA</span>
          <span className="text-yellow-500 typing-dots ml-2"></span> .....
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <h1 className="text-2xl font-semibold text-gray-800">Manage My Account</h1>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Personal Profile Section */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Personal Profile</h2>
            <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
              EDIT
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={userImage || `${baseUrl}/images/default-avatar.png`}
                alt="User avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">{username}</h3>
                <p className="text-sm text-gray-600">{user?.email || 'guest@example.com'}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" disabled />
                  <span className="text-sm text-gray-600">Receive marketing SMS</span>
                </label>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-orange-500" 
                    checked 
                    readOnly
                  />
                  <span className="text-sm text-gray-600">Receive marketing emails</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Address Book Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Address Book</h2>
            <button 
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              onClick={() => setActiveComponent('shipping-address')}
            >
              EDIT
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default Shipping Address */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase">Default Shipping Address</h3>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{username}</p>
                <p className="text-gray-600 text-sm">No.230,Colombo Road,Pothuhera,Kurunegala</p>
                <p className="text-gray-600 text-sm">North Western - Kurunegala - Pothuhera</p>
                <p className="text-gray-600 text-sm">(+94) 725531791</p>
              </div>
            </div>
            
            {/* Default Billing Address */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase">Default Billing Address</h3>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{username}</p>
                <p className="text-gray-600 text-sm">No.230,Colombo Road,Pothuhera,Kurunegala</p>
                <p className="text-gray-600 text-sm">North Western - Kurunegala - Pothuhera</p>
                <p className="text-gray-600 text-sm">(+94) 725531791</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <button 
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            onClick={() => setActiveComponent('purchased')}
          >
            View All
          </button>
        </div>

        {/* Orders Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Placed On
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Sample Order Rows */}
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  221450328876440
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  17/09/2025
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <img 
                    src={`${baseUrl}/images/default-product.png`} 
                    alt="Product"
                    className="w-8 h-8 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/32x32?text=Product';
                    }}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  Rs. 1,299
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                    MANAGE
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  218992210676440
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  26/02/2025
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <img 
                    src={`${baseUrl}/images/default-product.png`} 
                    alt="Product"
                    className="w-8 h-8 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/32x32?text=Product';
                    }}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  Rs. 582
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                    MANAGE
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Empty state if no orders */}
        {/* <div className="text-center py-8">
          <p className="text-gray-500">No recent orders found</p>
        </div> */}
      </div>
      
    </div>
  );
};

export default Account;
