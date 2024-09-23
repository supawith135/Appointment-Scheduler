import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetTeachersList } from '../../services/https/admin/listUsers';
import { UsersInterface } from '../../interfaces/IUsers';
import { Facebook, MessageCircle, Phone, Upload, X, Check, Edit2, MapPin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

function ListTeacherCPE() {
  const [teacherData, setTeacherData] = useState<UsersInterface[]>([]);
  const navigate = useNavigate();

  const getTeacherList = async () => {
    try {
      const res = await GetTeachersList();
      if (res.status === 200) {
        setTeacherData(res.data.data);
        console.log("Teacher List :", res.data);
      } else {
        console.error("Error getting student data: ", res.data);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    getTeacherList();
  }, []);

  const handleMoreDetail = (ID?: number) => {
    navigate(`teacherDetail/${ID}`);
  };

  const handleBooking = (ID?: number) => {
    navigate(`bookingTeacher/${ID}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2 shadow-sm rounded-sm">
      {teacherData.map((item, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <img
              src={item.image}
              className="w-full h-48 object-cover rounded-t-lg"
              alt={item.full_name}
              onClick={() => handleBooking(item.ID)}
            />
            
          </div>
          <div className="p-4">
          <div className="text-black font-bold text-xl">
              {`${item.position?.position_name} ${item.full_name}`}
            </div>
            <div className="flex items-center text-gray-600 my-2">
              <Mail size={18} className="mr-2" />
              {item.email}
            </div>
            <div className="flex items-center text-gray-600 my-2">
              <Phone size={18} className="mr-2" />
              {item.contact_number}
            </div>
          </div>
          <button
            type="button"
            className="bg-ENGi-Red text-white w-full py-2 hover:bg-ENGi-Red-dark transition-colors duration-300"
            onClick={() => handleMoreDetail(item.ID)}
          >
            More Detail
          </button>
        </motion.div>
      ))}
    </div>
  );
}

export default ListTeacherCPE;