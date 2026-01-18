import React from 'react';
import Layout from '../components/Layout';
import { Users as UsersIcon } from 'lucide-react';

const Users = () => {
  return (
    <Layout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1">Manage application users</p>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-col items-center justify-center py-12">
            <UsersIcon className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600 text-center max-w-md">
              User management module coming soon. This will allow you to view and manage all registered users,
              their orders, and account details.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
