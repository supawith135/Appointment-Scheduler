import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetStudentInCharge } from '../../services/https/teacher/student';
import { UsersInterface } from '../../interfaces/IUsers';
import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Default  from '../../assets/default-profile.jpg'
function ListStudentInCharge() {
  const [studentInChargeData, setStudentInChargeData] = useState<UsersInterface[]>([]);
  const navigate = useNavigate();

  const getStudentInCharge = async (id:string) => {
    try {
      const res = await GetStudentInCharge(id);
      console.log("API Response:", res); // Log API Response
      if (res.status === 200) {
        setStudentInChargeData(res.data.data);
        console.log("Teacher List:", res.data);
      } else {
        console.error("Error getting teacher data: ", res.data);
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  };

  const id = String(localStorage.getItem('id'))
  useEffect(() => {
    console.log("Fetching teacher list..."); // Log when fetching starts
    if (id){
      getStudentInCharge(id);
    }
    
  }, []);

  // const handleMoreDetail = (ID?: number) => {
  //   navigate(`teacherDetail/${ID}`);
  // };

  const handleBooking = (user_name?: string) => {
    navigate(`/Teacher/StudentBookingDetails/${user_name}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6">
      {studentInChargeData.map((item, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full h-[300px]">
            <img
              src={item.image || Default}
              className="w-full h-full object-cover object-center rounded-t-lg"
              alt={item.full_name}
              onClick={() => handleBooking(item.user_name)}
            />

          </div>
          <div className="p-3">
            <div className="text-black font-bold text-base mb-1">
              {`${item.position?.position_name} ${item.full_name}`}
            </div>
            <div className="flex items-center text-gray-600 my-1 text-xs">
              <Mail size={18} className="mr-2" />
              {item.email}
            </div>
            <div className="flex items-center text-gray-600 my-1 text-xs">
              <Phone size={18} className="mr-2" />
              {item.contact_number}
            </div>
          </div>
          {/* <button
            type="button"
            className="bg-ENGi-Red text-white w-full py-2 hover:bg-ENGi-Red-dark transition-colors duration-300"
            onClick={() => handleMoreDetail(item.ID)}
          >
            More Detail
          </button> */}
        </motion.div>
      ))}
    </div>
  );
}

export default ListStudentInCharge;