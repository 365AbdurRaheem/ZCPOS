import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import RolesList from './components/RoleList';
import PersonList from './components/PersonList';
import ProcessList from './components/ProcessList';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main
          className={`flex-1 transition-all duration-300 ease-in-out min-h-screen bg-gray-100
            ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}
        >
          <Routes>
            <Route path="/" element={<div className="p-6">Welcome to ZCPOS Dashboard!</div>} />
            <Route path="/roles" element={<RolesList />} />
            <Route path="/persons" element={<PersonList />} />
            <Route path="/raw-materials" element={<ProcessList condition='raw' />} />
            <Route path="/embroidery-designing" element={<ProcessList condition='embroidery' />} />
            <Route path="/filling" element={<ProcessList condition='filling' />} />
            <Route path="/cutting" element={<ProcessList condition='cutting' />} />
            <Route path="/stitching" element={<ProcessList condition='stitching' />} />
            <Route path="/pressing" element={<ProcessList condition='pressing' />} />
            <Route path="/packing" element={<ProcessList condition='packing' />} />
            <Route path="*" element={<div className="p-6">404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;