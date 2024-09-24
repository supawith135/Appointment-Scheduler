import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, MessageCircle, Phone, Upload, X, Check, Edit2, MapPin, Mail } from 'lucide-react';
import FrontLayout from '../../components/layouts/FrontLayout';
import { ToastContainer, toast } from 'react-toastify'; // เพิ่มนี้
import 'react-toastify/dist/ReactToastify.css'; // เพิ่มนี้
import { UpdateStudentById, GetStudentById } from '../../services/https/student/student';
import { UsersInterface } from '../../interfaces/IUsers';
import Profile from '../../components/shared/Profile';

const StudentProfile: React.FC = () => {

  return (
    <FrontLayout>
        <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white">
          <Profile/>
      </main>
    </FrontLayout>
  );
}

export default StudentProfile;