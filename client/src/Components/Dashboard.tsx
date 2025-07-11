import React from 'react';
import { Link } from 'react-router-dom';
import { crudConfigs } from './config';

const Dashboard: React.FC = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(crudConfigs).map(([key, config]) => (
        <div key={key} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{config.title}</h3>
          <p className="text-gray-600 text-sm">Manage your {config.title.toLowerCase()}</p>
          <div className="mt-4">
            <Link
              to={`/${key}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Details →
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;