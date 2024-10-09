import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, MessageCircle, Phone, Upload, X, Mail, MapPin } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UsersInterface } from '../../interfaces/IUsers';
import { GetTeacherById, UpdateTeacherById } from '../../services/https/teacher/teacher';
import { GetStudentById, UpdateStudentById } from '../../services/https/student/student';
import { GetAdminById, UpdateAdminById } from '../../services/https/admin/admin';
import Default  from '../../assets/default-profile.jpg'

const Profile: React.FC = () => {
    const [imageString, setImageString] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [userData, setUserData] = useState<UsersInterface | null>(null);
    const role = localStorage.getItem('role');
    const id = String(localStorage.getItem('id'));

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

    const fetchUserData = async () => {
        try {
            let res;
            if (role === 'teacher') {
                res = await GetTeacherById(id);
            } else if (role === 'student') {
                res = await GetStudentById(id);
            } else if (role === 'admin')
                res = await GetAdminById(id);

            if (res && res.status === 200) {
                setUserData(res.data.data);
                setImageString(res.data.data.image || null);
            } else {
                console.error("Error getting user data: ", res.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [id, role]);

    const handleConfirm = async () => {
        if (!userData) return;

        const value: UsersInterface = {
            ID: Number(id),
            facebook: userData.facebook,
            line: userData.line,
            contact_number: userData.contact_number,
            image: imageString as string,
            location: userData.location,
            email: userData.email,
        };
        console.log("value : ", value)

        try {
            let res;
            if (role === 'teacher') {
                res = await UpdateTeacherById(id, value);
            } else if (role === 'student') {
                res = await UpdateStudentById(id, value);
            } else if (role === 'admin') {
                res = await UpdateAdminById(id, value);
            }

            if (res && res.status === 200) {
                console.log("User Pro File: ", res.data)
                toast.success('Profile updated successfully!');
            } else {
                toast.error('Error updating profile. Please try again.');
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error('Failed to update profile. Please try again.');
        }
    };

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const profileTitle = role === 'teacher' ? 'Teacher Profile'
        : role === 'student' ? 'Student Profile'
            : role === 'admin' ? 'Admin Profile'
                : 'Profile';
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center bg-gradient-to-br p-4 bg-white"
            >
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                    <motion.h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
                        {profileTitle}
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
                                    src={imageString || Default}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full border-4 border-purple-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                                    <Upload size={40}  className="text-gray-400" />
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

                    {userData && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Mail className="text-[#FF9C00]" />
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        value={userData.email || ''}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        className="flex-grow border-b-2 border-gray-300 focus:border-[#FF9C00] outline-none p-2 transition duration-300 bg-white text-black"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Facebook className="text-blue-600" />
                                    <input
                                        type="text"
                                        placeholder="Facebook"
                                        value={userData.facebook || ''}
                                        onChange={(e) => setUserData({ ...userData, facebook: e.target.value })}
                                        className="flex-grow border-b-2 border-gray-300 focus:border-[#1877F2] outline-none p-2 transition duration-300 bg-white text-black"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MessageCircle className="text-green-500" />
                                    <input
                                        type="text"
                                        placeholder="Line"
                                        value={userData.line || ''}
                                        onChange={(e) => setUserData({ ...userData, line: e.target.value })}
                                        className="flex-grow border-b-2 border-gray-300 focus:border-[#00C300] outline-none p-2 transition duration-300 bg-white text-black"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="text-red-500" />
                                    <input
                                        type="text"
                                        placeholder="Contact Number"
                                        value={userData.contact_number || ''}
                                        onChange={(e) => setUserData({ ...userData, contact_number: e.target.value })}
                                        className="flex-grow border-b-2 border-gray-300 focus:border-red-500 outline-none p-2 transition duration-300 bg-white text-black"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="text-orange-700" />
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        value={userData.location || ''}
                                        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
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
        </div>
    );
}
export default Profile