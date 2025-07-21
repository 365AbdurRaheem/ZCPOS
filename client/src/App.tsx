import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import RolesList from './components/RoleList';
import PersonList from './components/PersonList';
import RawList from './components/RawList';

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
            <Route path="/raw-materials" element={<RawList />} />
            <Route path="/embroidery-designing" element={<div className="p-6">Embroidery Designing Page</div>} />
            <Route path="/filling" element={<div className="p-6">Filling Page</div>} />
            <Route path="/cutting" element={<div className="p-6">Cutting Page</div>} />
            <Route path="/stitching" element={<div className="p-6">Stitching Page</div>} />
            <Route path="/pressing" element={<div className="p-6">Pressing Page</div>} />
            <Route path="/packing" element={<div className="p-6">Packing Page</div>} />
            <Route path="*" element={<div className="p-6">404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;