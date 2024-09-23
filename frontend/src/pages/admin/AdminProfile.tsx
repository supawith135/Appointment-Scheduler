import { GetAdminById, UpdateAdminById } from '../../services/https/admin/admin';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, MessageCircle, Phone, Upload, X, Check, Edit2, MapPin } from 'lucide-react';
import FrontLayout from '../../components/layouts/FrontLayout';
import { ToastContainer, toast } from 'react-toastify'; // เพิ่มนี้
import 'react-toastify/dist/ReactToastify.css'; // เพิ่มนี้
import { UsersInterface } from '../../interfaces/IUsers';


const AdminProfile: React.FC = () => {
  const [imageString, setImageString] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [adminData, setadminData] = useState<UsersInterface | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const image = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        const base64Data = reader.result as string;
        setImageString(base64Data);
      };
    }
  };

  const getAdminById = async (id: string) => {
    try {
      const res = await GetAdminById(id);
      if (res.status === 200) {
        setadminData(res.data.data);
        setImageString(res.data.data.image || null);
      } else {
        console.error("Error getting admin data: ", res.data);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  }

  const id = String(localStorage.getItem('id'));
  useEffect(() => {
    getAdminById(id);
  }, [id]);

  const handleConfirm = async () => {
    if (!adminData) return;

    const value: UsersInterface = {
      ID: Number(id),
      facebook: adminData.facebook,
      line: adminData.line,
      contact_number: adminData.contact_number,
      image: imageString as string,
      location: adminData.location
    };

    try {
      const res = await UpdateAdminById(id, value);
      if (res.status === 200) {
        console.log("Update Data",res.data)
        toast.success('Profile updated successfully!'); // เปลี่ยนการแจ้งเตือน
      } else {
        toast.error('Error updating profile. Please try again.'); // เปลี่ยนการแจ้งเตือน
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error('Failed to update profile. Please try again.'); // เปลี่ยนการแจ้งเตือน
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <FrontLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center bg-gradient-to-br p-4 bg-white"
      >
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <motion.h2
            className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            admin Profile
          </motion.h2>

          <div className="mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-40 h-40 mx-auto cursor-pointer"
              onClick={toggleModal}
            >
              {imageString ? (
                <img
                  src={imageString}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border-4 border-purple-500 "
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                  <Upload size={40} className="text-gray-400" />
                </div>
              )}
            </motion.div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="mt-4 inline-block bg-purple-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-purple-600 transition duration-300 ease-in-out"
            >
              Choose Image
            </label>
          </div>

          {adminData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Facebook className="text-blue-600" />
                  <input
                    type="text"
                    placeholder="Facebook"
                    value={adminData.facebook || ''}
                    onChange={(e) => setadminData({ ...adminData, facebook: e.target.value })}
                    className="flex-grow border-b-2 border-gray-300 focus:border-[#1877F2] outline-none p-2 transition duration-300 bg-white text-black"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="text-green-500" />
                  <input
                    type="text"
                    placeholder="Line"
                    value={adminData.line || ''}
                    onChange={(e) => setadminData({ ...adminData, line: e.target.value })}
                    className="flex-grow border-b-2 border-gray-300 focus:border-[#00C300] outline-none p-2 transition duration-300 bg-white text-black"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="text-red-500" />
                  <input
                    type="text"
                    placeholder="Contact Number"
                    value={adminData.contact_number || ''}
                    onChange={(e) => setadminData({ ...adminData, contact_number: e.target.value })}
                    className="flex-grow border-b-2 border-gray-300 focus:border-red-500 outline-none p-2 transition duration-300 bg-white text-black"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-orange-700" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={adminData.location || ''}
                    onChange={(e) => setadminData({ ...adminData, location: e.target.value })}
                    className="flex-grow border-b-2 border-gray-300 focus:border-orange-700 outline-none p-2 transition duration-300 bg-white text-black"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirm}
            className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:from-purple-600 hover:to-pink-600 transition duration-300 ease-in-out shadow-lg"
          >
            Update Profile
          </motion.button>
        </div>
      </motion.div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative bg-white rounded-lg p-2 max-w-3xl max-h-[90vh]"
            >
              <img
                src={imageString || ''}
                alt="Full Profile"
                className="max-w-full max-h-full rounded-lg"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleModal}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
              >
                <X size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FrontLayout>
  );
}

export default AdminProfile;