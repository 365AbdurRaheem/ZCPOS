import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X,
  ChevronRight, 
  ChevronDown,
  Package,
  Truck,
  Palette,
  Archive,
  Crown,
  Scissors,
  Printer,
  Package2
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  subItems: { name: string; href: string; }[];
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const location = useLocation();

  const navItems: NavItem[] = [
    { 
      name: 'Roles', 
      href: '/roles',
      icon: Crown,
      subItems: [
        { name: 'View All', href: '/roles' }
      ]
    },
    { 
      name: 'Raw Material', 
      href: '/raw-material',
      icon: Package,
      subItems: [
        { name: 'View All', href: '/raw-material' },
        { name: 'Categories', href: '/raw-material/categories' },
        { name: 'Stock Report', href: '/raw-material/stock-report' }
      ]
    },
    { 
      name: 'Supplier', 
      href: '/supplier',
      icon: Truck,
      subItems: [
        { name: 'View All', href: '/supplier' },
        { name: 'Purchase Orders', href: '/supplier/purchase-orders' },
        { name: 'Payments', href: '/supplier/payments' }
      ]
    },
    { 
      name: 'Embroidery Designer', 
      href: '/embroidery-designer',
      icon: Palette,
      subItems: [
        { name: 'View All', href: '/embroidery-designer' },
        { name: 'Designs', href: '/embroidery-designer/designs' },
        { name: 'Orders', href: '/embroidery-designer/orders' }
      ]
    },
    { 
      name: 'Filler', 
      href: '/filler',
      icon: Archive,
      subItems: [
        { name: 'View All', href: '/filler' },
        { name: 'Assignments', href: '/filler/assignments' },
        { name: 'Reports', href: '/filler/reports' }
      ]
    },
    { 
      name: 'Master', 
      href: '/master',
      icon: Crown,
      subItems: [
        { name: 'View All', href: '/master' },
        { name: 'Supervision', href: '/master/supervision' },
        { name: 'Quality Check', href: '/master/quality-check' }
      ]
    },
    { 
      name: 'Stitcher', 
      href: '/stitcher',
      icon: Scissors,
      subItems: [
        { name: 'View All', href: '/stitcher' },
        { name: 'Work Orders', href: '/stitcher/work-orders' },
        { name: 'Performance', href: '/stitcher/performance' }
      ]
    },
    { 
      name: 'Presser', 
      href: '/presser',
      icon: Printer,
      subItems: [
        { name: 'View All', href: '/presser' },
        { name: 'Press Orders', href: '/presser/press-orders' },
        { name: 'Schedule', href: '/presser/schedule' }
      ]
    },
    { 
      name: 'Packer', 
      href: '/packer',
      icon: Package2,
      subItems: [
        { name: 'View All', href: '/packer' },
        { name: 'Pack Orders', href: '/packer/pack-orders' },
        { name: 'Shipping', href: '/packer/shipping' }
      ]
    },
  ];

  const toggleDropdown = (index: number): void => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className={`${isOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 ease-in-out h-screen fixed left-0 top-0 z-50`}>
      <div className="flex items-center justify-between p-4 border-b">
        <Link to="/" className={`text-xl font-bold text-blue-600 ${!isOpen && 'hidden'}`}>
          ZCPOS
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="mt-4 overflow-y-auto h-full pb-20">
        <div className="px-2 space-y-1">
          {navItems.map((item: NavItem, index: number) => {
            const Icon = item.icon;
            const isActive = activeDropdown === index;
            const isCurrentRoute = isActiveRoute(item.href);
            
            return (
              <div key={index}>
                <button
                  onClick={() => toggleDropdown(index)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-blue-50 hover:text-blue-600 transition-colors group ${
                    isCurrentRoute ? 'bg-blue-50 text-blue-600' : isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon size={20} className="mr-3" />
                    {isOpen && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </div>
                  {isOpen && (
                    <div className="ml-auto">
                      {isActive ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>
                  )}
                </button>

                {isActive && isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem, subIndex: number) => (
                      <Link
                        key={subIndex}
                        to={subItem.href}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          location.pathname === subItem.href
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              ZCPOS v1.0
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
