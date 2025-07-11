import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import CRUDPage from './Components/GenericCRUD';
import { crudConfigs } from '../src/config';

const App: React.FC = () => {
  return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {Object.entries(crudConfigs).map(([key, config]) => (
              <Route key={key} path={`/${key}/*`} element={<CRUDPage config={config} />} />
            ))}
          </Routes>
        </div>
      </div>
  );
};

export default App;