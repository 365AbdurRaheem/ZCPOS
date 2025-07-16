import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CRUDPage from './components/GenericCRUD';
import { crudConfigs } from './config/crudConfigs'; // ✅ FIXED this path

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {Object.entries(crudConfigs).map(([key, config]) => (
            <Route key={key} path={`/${key}`} element={<CRUDPage config={config} />} />
          ))}
        </Routes>
      </div>
    </div>
  );
};

export default App;
