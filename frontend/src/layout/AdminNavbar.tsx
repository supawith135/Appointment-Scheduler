import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar: React.FC = () => {
  // State to manage the visibility of dropdowns
  const [openStudent, setOpenStudent] = useState(false);
  const [openTeacher, setOpenTeacher] = useState(false);

  // Ref for dropdowns
  const studentDropdownRef = useRef<HTMLUListElement>(null);
  const teacherDropdownRef = useRef<HTMLUListElement>(null);

  const toggleStudentDropdown = () => setOpenStudent(!openStudent);
  const toggleTeacherDropdown = () => setOpenTeacher(!openTeacher);

  const handleClickOutside = (event: MouseEvent) => {
    if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target as Node)) {
      setOpenStudent(false);
    }
    if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target as Node)) {
      setOpenTeacher(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='bg-white flex justify-end items-center h-14 w-full mx-auto px-2 text-black shadow-xl'>
      <div className='flex md:flex '>
        <ul className='p-2 m-2 cursor-pointer border-b-2 border-white duration-300 hover:border-b-2 hover:border-ENGi-Red hover:text-ENGi-Red'>
          <Link to='/Admin/AddStudentPage'>การนัดหมายอาจารย์</Link>
        </ul>
        <ul
          className='p-2 m-2 cursor-pointer border-b-2 border-white duration-300 hover:border-b-2 hover:border-ENGi-Red hover:text-ENGi-Red relative'
          ref={studentDropdownRef}
        >
          <button onClick={toggleStudentDropdown}>นักศึกษา</button>
          {openStudent && (
            <div className="absolute right-0 mt-4 w-36 bg-white rounded-md shadow-lg py-1">
              <Link to='/Admin/AddStudent' className="block px-4 py-2 text-sm text-black hover:text-ENGi-Red">เพิ่มรายชื่อนักศึกษา</Link>
              <Link to='/Admin/StudentList' className="block px-4 py-2 text-sm text-black hover:text-ENGi-Red">รายชื่อนักศึกษา</Link>
            </div>
          )}
        </ul>
        <ul
          className='p-2 m-2 cursor-pointer border-b-2 border-white duration-300 hover:border-b-2 hover:border-ENGi-Red hover:text-ENGi-Red relative'
          ref={teacherDropdownRef}
        >
          <button onClick={toggleTeacherDropdown}>อาจารย์</button>
          {openTeacher && (
            <div className="absolute right-0 mt-4 w-36 bg-white rounded-md shadow-lg py-1">
              <Link to='/Admin/AddTeacher' className="block px-4 py-2 text-sm text-black hover:text-ENGi-Red">เพิ่มรายชื่ออาจารย์</Link>
              <Link to='/Admin/TeacherList' className="block px-4 py-2 text-sm text-black hover:text-ENGi-Red">รายชื่ออาจารย์</Link>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminNavbar;
