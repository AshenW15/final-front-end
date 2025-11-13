'use client';

import React, { useEffect, useState } from 'react';
import LoadingOverlay from '@/components/ui/loading-overlay';

type User = {
  name: string;
  email: string;
  date: string;
};

const Users = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const formData = new FormData();

      try {
        const response = await fetch(`${baseUrl}/get_users.php`, {
          method: 'POST',
          body: formData,
        });

        const result: User[] = await response.json();
        setUsers(result);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [baseUrl]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Users</h1>
      
      <LoadingOverlay isLoading={loading} text="Loading users...">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">User List</h2>

          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-6 py-4 text-gray-700">{user.name}</td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-gray-700">{user.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-700">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </LoadingOverlay>
    </div>
  );
};

export default Users;
