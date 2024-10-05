import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  path: string;
  label: string;
  children?: NavItem[];
}

interface AdminMobileMenuProps {
  navItems: NavItem[];
  onNavigate: (path: string) => void;
}

const AdminMobileMenu: React.FC<AdminMobileMenuProps> = ({ navItems, onNavigate }) => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (label: string) => {
    setOpenSections(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  return (
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      {navItems.map((item) => (
        <div key={item.label} className="mb-2">
          <button
            onClick={() => toggleSection(item.label)}
            className="w-full text-left px-3 py-2 rounded-md text-lg font-medium text-gray-700 hover:text-ENGi-Red hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ENGi-Red"
          >
            {item.label}
            <span className="float-right">
              {openSections.includes(item.label) ? '▲' : '▼'}
            </span>
          </button>
          <AnimatePresence>
            {openSections.includes(item.label) && item.children && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pl-6"
              >
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ENGi-Red hover:bg-gray-50"
                    onClick={() => {
                      onNavigate(child.path);
                    }}
                  >
                    {child.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default AdminMobileMenu;