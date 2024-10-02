import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreateStudent } from '../../services/https/admin/listUsers';
import FrontLayout from '../../components/layouts/FrontLayout';
import { UsersInterface } from '../../interfaces/IUsers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddStudentPage = () => {
    const [userName, setUserName] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!userName || !fullName) {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        setLoading(true);
        const value: UsersInterface = {
            user_name: userName,
            full_name: fullName,
            password: userName,
            email: `${userName}@g.sut.ac.th`, // เปลี่ยนเป็น userName เพื่อความถูกต้อง
            role_id: 1
        };

        try {
            const res = await CreateStudent(value);
            if (res.status === 200) {
                toast.success('บัญชีผู้ใช้ถูกสร้างเรียบร้อยแล้ว!');
                console.log(res.data)
            } else {
                toast.error('เกิดข้อผิดพลาดในการสร้างบัญชี กรุณาลองใหม่');
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error('ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FrontLayout>
            <ToastContainer />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-grow flex-col p-4 md:p-8 lg:p-10 "
            >
                <motion.div
                    className="mx-auto p-6 md:p-10 shadow-2xl rounded-lg w-full max-w-2xl bg-white"
                    whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-red-700 text-3xl md:text-4xl mb-8 text-center font-bold">ข้อมูลนักศึกษา</h1>

                    <div className="space-y-6">
                        {/* Student Username */}
                        <div>
                            <div className="mb-2">
                                <label className="text-xl font-bold text-gray-700 mb-2">รหัสประจำตัว </label>
                                <p className="text-sm text-gray-600">เช่น B64xxxxxx</p>
                            </div>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full p-3 bg-white border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                            />
                        </div>
                    </div>

                    {/* Student Full Name */}
                    <div>
                        <div className="my-4">
                            <label className="text-xl font-bold text-gray-700 mb-2">ชื่อนักศึกษา</label>
                            <p className="text-sm text-gray-600">เช่น นาย สมหวัง ดีมาก</p>
                        </div>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 bg-white border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                        />

                    </div>
                    <motion.div
                        className="mt-8 flex justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.button
                            onClick={handleConfirm}
                            disabled={loading}
                            className={`text-xl font-semibold rounded-full px-8 py-3 text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </FrontLayout>
    );
};

export default AddStudentPage;
