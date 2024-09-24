import React from 'react';
import FrontLayout from '../../components/layouts/FrontLayout';
import 'react-toastify/dist/ReactToastify.css'; // เพิ่มนี้
import Profile from '../../components/shared/Profile';

const TeacherProfile: React.FC = () => {

  return (
    <FrontLayout>
        <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white">
          <Profile/>
      </main>
    </FrontLayout>
  );
}

export default TeacherProfile;