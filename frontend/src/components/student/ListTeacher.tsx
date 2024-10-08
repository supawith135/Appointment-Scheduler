import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetTeachersList } from '../../services/https/student/student';
import { UsersInterface } from '../../interfaces/IUsers';
import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Default  from '../../assets/default-profile.jpg'
function ListTeacher() {
  const [teacherData, setTeacherData] = useState<UsersInterface[]>([]);
  const navigate = useNavigate();

  const getTeacherList = async () => {
    try {
      const res = await GetTeachersList();
      console.log("API Response:", res); // Log API Response
      if (res.status === 200) {
        setTeacherData(res.data.data);
        console.log("Teacher List:", res.data);
      } else {
        console.error("Error getting teacher data: ", res.data);
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching teacher list..."); // Log when fetching starts
    getTeacherList();
  }, []);

  // const handleMoreDetail = (ID?: number) => {
  //   navigate(`teacherDetail/${ID}`);
  // };

  const handleBooking = (ID?: number) => {
    navigate(`bookingTeacher/${ID}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6">
      {teacherData.map((item, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full h-[350px]"> {/* ลดความสูงลงอีก */}
            <img
              src={item.image || Default}
              className="w-full h-full object-cover object-center rounded-t-lg"
              alt={item.full_name}
              onClick={() => handleBooking(item.ID)}
            />
          </div>
          <div className="p-3"> {/* ลด padding ลงเล็กน้อย */}
            <div className="text-black font-bold text-base mb-1"> {/* ลดขนาดตัวอักษรและเพิ่ม margin-bottom */}
              {`${item.position?.position_name} ${item.full_name}`}
            </div>
            <div className="flex items-center text-gray-600 my-1 text-xs"> {/* ลดขนาดตัวอักษรลงอีก */}
              <Mail size={18} className="mr-1" />
              {item.email}
            </div>
            <div className="flex items-center text-gray-600 my-1 text-xs"> {/* ลดขนาดตัวอักษรลงอีก */}
              <Phone size={18} className="mr-1" />
              {item.contact_number}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default ListTeacher;