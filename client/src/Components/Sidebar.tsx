import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Crown,
  Users,
  Package,
  PenTool,
  Box,
  Scissors,
  Feather,
  Shirt,
  Archive,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Roles', icon: Crown, path: '/roles' },
    { name: 'Persons', icon: Users, path: '/persons' },
    { name: 'Raw Materials', icon: Package, path: '/raw-materials' },
    { name: 'Embroidery Designing', icon: PenTool, path: '/embroidery-designing' },
    { name: 'Filling', icon: Box, path: '/filling' },
    { name: 'Cutting', icon: Scissors, path: '/cutting' },
    { name: 'Stitching', icon: Feather, path: '/stitching' },
    { name: 'Pressing', icon: Shirt, path: '/pressing' },
    { name: 'Packing', icon: Archive, path: '/packing' },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white text-gray-800 flex flex-col shadow-lg
        ${isOpen ? 'w-64' : 'w-16'}
        transition-all duration-300 ease-in-out`}
    >
      <div className={`p-4 text-xl font-semibold text-blue-600 border-b border-gray-200 flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen ? (
          <>
            <img src="/1.png" alt="Logo" className="w-21 h-21 -ml-2 mb-3" />
            <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <ChevronLeft size={20} />
            </button>
          </>
        ) : (
          <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-3 text-sm font-medium transition-colors duration-200
                  ${location.pathname.startsWith(item.path) || (location.pathname === '/' && item.path === '/')
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
                  }`}
                title={!isOpen ? item.name : ''}
              >
                <item.icon size={18} className={`${isOpen ? 'mr-2' : 'mr-0'}`} />
                <span className={`${isOpen ? 'block' : 'hidden'} whitespace-nowrap`}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`p-3 text-xs text-gray-600 border-t border-gray-300 my-2 -mx-2 text-center
        ${isOpen ? 'block' : 'hidden'}`}>
        Developed By FBR
      </div>
    </div>
  );
};

export default Sidebar;