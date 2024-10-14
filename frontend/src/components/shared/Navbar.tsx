import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminMobileMenu from './AdminMobileMenu';  // ปรับ path ตามที่คุณบันทึกไฟล์
import { useNavigate } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  children?: NavItem[];
}

const studentNavItems: NavItem[] = [
  { path: '/Student/bookingAdvisor', label: 'การจองคิวนัดหมายอาจารย์ที่ปรึกษา' },
  { path: '/Student/History', label: 'ประวัติการจองคิว' },
];

const teacherNavItems: NavItem[] = [
  { path: '/Teacher', label: 'การนัดหมาย' },
  { path: '/Teacher/StudentNote', label: 'บันทึกพบนักศึกษาด่วน' },
  { path: '/Teacher/CreateTimeSlot', label: 'สร้างเวลานัดหมาย' },
  { path: '/Teacher/History', label: 'ประวัติจองคิว' },
];

const adminNavItems: NavItem[] = [
  // { path: '/Admin/AddStudentPage', label: 'การนัดหมายอาจารย์' },
  {
    path: '#',
    label: 'นักศึกษา',
    children: [
      { path: '/Admin/AddStudent', label: 'เพิ่มรายชื่อนักศึกษา' },
      { path: '/Admin/AddStudentList', label: 'นำเข้ารายชื่อนักศึกษา' },
      { path: '/Admin/StudentList', label: 'รายชื่อนักศึกษา' },
    ]
  },
  {
    path: '',
    label: 'อาจารย์',
    children: [
      { path: '/Admin/AddTeacher', label: 'เพิ่มรายชื่ออาจารย์' },
      { path: '/Admin/AddTeacherList', label: 'นำเข้ารายชื่ออาจารย์' },
      { path: '/Admin/TeacherList', label: 'รายชื่ออาจารย์' },
    ]
  },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string>(location.pathname);
  const [role, setRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLinkClick = (path: string) => {
    console.log('Navigating to:', path);
    setActiveLink(path);
    setIsOpen(false);
    setOpenDropdown(null);
    navigate(path);
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const navItems = role === 'student' ? studentNavItems :
    role === 'teacher' ? teacherNavItems :
      role === 'admin' ? adminNavItems : [];

  const renderNavItem = (item: NavItem) => (
    <div key={item.path} className="relative" ref={dropdownRef}>
      {item.children ? (
        <>
          <motion.button
            onHoverStart={() => setHoveredItem(item.label)}
            onHoverEnd={() => setHoveredItem(null)}
            onClick={() => toggleDropdown(item.label)}
            className={`px-3 py-2 rounded-md text-lg font-bold relative ${openDropdown === item.label ? 'text-ENGi-Red' : 'text-gray-700 hover:text-ENGi-Red'
              }`}
          >
            {item.label}
            {(hoveredItem === item.label || openDropdown === item.label) && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-ENGi-Red "
                layoutId="underline"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
          <AnimatePresence>
            {openDropdown === item.label && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 font-bold"
              >
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100 hover:text-ENGi-Red "
                    onClick={() => handleLinkClick(child.path)}
                  >
                    {child.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          onHoverStart={() => setHoveredItem(item.path)}
          onHoverEnd={() => setHoveredItem(null)}
        >
          <Link
            to={item.path}
            className={`px-3 py-2 rounded-md text-lg font-bold relative ${activeLink === item.path
              ? 'text-ENGi-Red'
              : 'text-gray-700 hover:text-ENGi-Red'
              }`}
            onClick={() => handleLinkClick(item.path)}
          >
            {item.label}
            {(hoveredItem === item.path || activeLink === item.path) && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-ENGi-Red"
                layoutId="underline"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        </motion.div>
      )}
    </div>
  );

  return (
    <nav className="bg-white shadow-xl border-b-2 border-gray-300">
      <div className="mr-4 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">

          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 ">
              {navItems.map(renderNavItem)}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-ENGi-Red focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          {role === 'admin' ? (
            <AdminMobileMenu
              navItems={adminNavItems}
              onNavigate={(path) => {
                handleLinkClick(path);
                setIsOpen(false);
              }}
            />
          ) : (
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <div key={item.path || item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className="w-full text-left block px-3 py-2 rounded-md text-lg font-medium text-gray-700 hover:text-ENGi-Red hover:bg-gray-50"
                      >
                        {item.label}
                      </button>
                      {openDropdown === item.label && (
                        <div className="pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className="block px-3 py-2 rounded-md text-lg font-medium text-gray-700 hover:text-ENGi-Red hover:bg-gray-50"
                              onClick={(e) => {
                                e.preventDefault(); // ป้องกันการทำงานเริ่มต้นของ Link
                                handleLinkClick(child.path);
                                setIsOpen(false);
                                setOpenDropdown(null);
                                // ใช้ programmatic navigation
                                window.location.href = child.path;
                              }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`block px-3 py-2 rounded-md text-lg font-medium ${activeLink === item.path
                        ? 'text-ENGi-Red border-l-4 border-ENGi-Red bg-gray-100'
                        : 'text-gray-700 hover:text-ENGi-Red hover:bg-gray-50'
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item.path);
                        setIsOpen(false);
                        // ใช้ programmatic navigation
                        window.location.href = item.path;
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <div key={item.path || item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="w-full text-left block px-3 py-2 rounded-md text-lg font-medium text-gray-700 hover:text-ENGi-Red hover:bg-gray-50"
                    >
                      {item.label}
                    </button>
                    {openDropdown === item.label && (
                      <div className="pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="block px-3 py-2 rounded-md text-lg font-medium text-gray-700 hover:text-ENGi-Red hover:bg-gray-50"
                            onClick={(e) => {
                              e.preventDefault(); // ป้องกันการทำงานเริ่มต้นของ Link
                              handleLinkClick(child.path);
                              setIsOpen(false);
                              setOpenDropdown(null);
                              // ใช้ programmatic navigation
                              window.location.href = child.path;
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-lg font-medium ${activeLink === item.path
                      ? 'text-ENGi-Red border-l-4 border-ENGi-Red bg-gray-100'
                      : 'text-gray-700 hover:text-ENGi-Red hover:bg-gray-50'
                      }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.path);
                      setIsOpen(false);
                      // ใช้ programmatic navigation
                      window.location.href = item.path;
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )} */}
    </nav>
  );
};

export default Navbar;