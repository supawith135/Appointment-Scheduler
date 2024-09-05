import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const StudentNavbar: React.FC = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string>(location.pathname);

  // Handle active link state based on the current path
  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };

  return (
    <div className='bg-white flex justify-end items-center h-14 w-full mx-auto px-2 text-black shadow-xl'>
      <div className='flex '>
        <ul 
          className={`p-2 m-2 cursor-pointer border-b-2 duration-300 hover:border-ENGi-Red hover:text-ENGi-Red ${
            activeLink === '/Student/Appointment' ? 'border-ENGi-Red text-ENGi-Red' : 'border-white'
          }`}
          onClick={() => handleLinkClick('/Student/Appointment')}
        >
          <Link to="/Student/Appointment" className="block">การจองคิวนัดหมาย</Link>
        </ul>
        <ul 
          className={`p-2 m-2 cursor-pointer border-b-2 duration-300 hover:border-ENGi-Red hover:text-ENGi-Red ${
            activeLink === '/Student/History' ? 'border-ENGi-Red text-ENGi-Red' : 'border-white'
          }`}
          onClick={() => handleLinkClick('/Student/History')}
        >
          <Link to="/Student/History" className="block">ประวัติการจองคิว</Link>
        </ul>
      </div>
    </div>
  );
};

export default StudentNavbar;
