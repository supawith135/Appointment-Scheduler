import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const TeacherNavbar: React.FC = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string>(location.pathname);

  // Handle active link state based on the current path
  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };

  return (
    <div className='bg-white flex justify-end items-center h-14 w-full mx-auto px-2 text-black shadow-xl'>
      <div className='flex font-Kanit'>
        <ul 
          className={`p-2 m-2 cursor-pointer border-b-2 duration-300 hover:border-orange-500 hover:text-orange-500 ${
            activeLink === '/Teacher/Appointment' ? 'border-orange-500 text-orange-500' : 'border-white'
          }`}
          onClick={() => handleLinkClick('/Student/Appointment')}
        >
          <Link to="/Teacher/Appointment" className="block">การนัดหมาย</Link>
        </ul>
        <ul 
          className={`p-2 m-2 cursor-pointer border-b-2 duration-300 hover:border-orange-500 hover:text-orange-500 ${
            activeLink === '/Teacher/CreateTimeSlot' ? 'border-orange-500 text-orange-500' : 'border-white'
          }`}
          onClick={() => handleLinkClick('/Teacher/CreateTimeSlot')}
        >
          <Link to="/Teacher/CreateTimeSlot" className="block">สร้างเวลานัดหมาย</Link>
        </ul>
        <ul 
          className={`p-2 m-2 cursor-pointer border-b-2 duration-300 hover:border-orange-500 hover:text-orange-500 ${
            activeLink === '/Teacher/History' ? 'border-orange-500 text-orange-500' : 'border-white'
          }`}
          onClick={() => handleLinkClick('/Teacher/History')}
        >
          <Link to="/Teacher/History" className="block">ประวัติจองคิว</Link>
        </ul>
       
      </div>
    </div>
  );
};

export default TeacherNavbar;
