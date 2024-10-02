import React, { useEffect, useState } from 'react';
import { TbUsers, TbUserCheck } from "react-icons/tb";
import { LuCalendarRange } from "react-icons/lu";
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { useNavigate } from 'react-router-dom';  // นำเข้า useNavigate
import { GetTeacherStatisticsById } from '../../services/https/teacher/statistics';

interface DashboardCardProps {
  icon: IconType;
  title: string;
  value: number;
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
  onClick?: () => void;  // เพิ่ม prop onClick
}
interface TeacherStatistics {
  total_students: number;
  advisor_name: string;
  student_names: string;
  advisor_student_count: number;
  total_bookings_for_advisor: number;
  remaining_bookings_for_advisor: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon: Icon, title, value, bgColor, iconBgColor, iconColor, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`flex items-center p-4 ${bgColor} rounded-lg cursor-pointer`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}  // เพิ่มการเรียก onClick เมื่อคลิก
    >
      <motion.div
        className={`${iconBgColor} p-3 rounded-full`}
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className={`${iconColor} text-3xl`} />
      </motion.div>
      <div className='ml-4'>
        <motion.ul
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <li className='text-sm font-medium text-gray-700'>{title}</li>
          <motion.li
            className='text-2xl font-bold text-black'
            animate={{ scale: isHovered ? 1.1 : 1 }}
          >
            {value}
          </motion.li>
        </motion.ul>
      </div>
    </motion.div>
  );
};

function TeacherDashboard() {
  const [statisticsData, setStatisticsData] = useState<TeacherStatistics | null>(null);
  const navigate = useNavigate();  // ใช้ useNavigate เพื่อการนำทาง

  const getTeacherStatisticsById = async (id: string) => {
    const res = await GetTeacherStatisticsById(id);
    if (res.status == 200) {
      setStatisticsData(res.data.data);
      console.log("statisticsData: ", res.data.data);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    const id = String(localStorage.getItem('id'));
    getTeacherStatisticsById(id);
  }, []);

  // ตรวจสอบว่ามี statisticsData พร้อมก่อนที่จะแสดงผล
  if (!statisticsData) {
    return <div>Loading...</div>;
  }

  // ใช้ค่าจาก statisticsData เพื่อแสดงใน DashboardCard
  const cardData: DashboardCardProps[] = [
    { icon: TbUsers, title: "นักศึกษาทั้งสาขา", value: statisticsData.total_students, bgColor: "bg-green-100", iconBgColor: "bg-green-200", iconColor: "text-green-600" },
    { 
      icon: TbUserCheck, 
      title: "นักศึกษาที่ดูแล", 
      value: statisticsData.advisor_student_count, 
      bgColor: "bg-blue-100", 
      iconBgColor: "bg-blue-200", 
      iconColor: "text-blue-600", 
      onClick: () => navigate('/Teacher/StudentInCharge')  // กำหนดการนำทางเมื่อคลิก
    },
    { icon: LuCalendarRange, title: "นัดหมายทั้งหมด", value: statisticsData.total_bookings_for_advisor, bgColor: "bg-purple-100", iconBgColor: "bg-purple-200", iconColor: "text-purple-600" },
    { icon: LuCalendarRange, title: "นัดหมายที่เหลือ", value: statisticsData.remaining_bookings_for_advisor, bgColor: "bg-yellow-100", iconBgColor: "bg-yellow-200", iconColor: "text-yellow-600" },
  ];

  return (
    <div className='sm:p-6 lg:p-10'>
      <motion.div
        className='bg-white border border-gray-200 rounded-md shadow-lg p-5'
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>Teacher Dashboard</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default TeacherDashboard;
