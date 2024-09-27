import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GetStudentById, UpdateStudentById, GetTeachersList } from '../../services/https/student/student';
import FrontLayout from '../../components/layouts/FrontLayout';
import { UsersInterface } from '../../interfaces/IUsers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentAccountPage = () => {
    const [studentData, setStudentData] = useState<UsersInterface | null>(null);
    const [teachers, setTeachers] = useState<UsersInterface[]>([]);
    const [fullName, setFullName] = useState('');
    const [advisorId, setAdvisorId] = useState<number | ''>('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const id = String(localStorage.getItem('id'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentRes, teachersRes] = await Promise.all([
                    GetStudentById(id),
                    GetTeachersList()
                ]);

                if (studentRes.status === 200) {
                    setStudentData(studentRes.data.data);
                    setFullName(studentRes.data.data.full_name || '');
                    setAdvisorId(studentRes.data.data.advisor_id || '');
                }

                if (teachersRes.status === 200) {
                    setTeachers(teachersRes.data.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error('Failed to load data. Please try again.');
            }
        };

        fetchData();
    }, [id]);

    const handleConfirm = async () => {
        setLoading(true);
        if (!studentData) return;

        // Password validation
        if (password !== confirmPassword) {
            toast.error('Passwords do not match. Please try again.');
            setLoading(false);
            return;
        }

        const value: UsersInterface = {
            ID: Number(id),
            full_name: fullName,
            advisor_id: advisorId ? advisorId : undefined,
            ...(password && { password }), // Only include password if it is filled
        };

        try {
            const res = await UpdateStudentById(id, value);
            if (res.status === 200) {
                toast.success('Account updated successfully!');
            } else {
                toast.error('Error updating account. Please try again.');
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error('Failed to update account. Please try again.');
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
                                <label className="text-xl font-bold text-gray-700 mb-2">ชื่อผู้ใช้ </label>
                            </div>
                            <input
                                type="text"
                                value={studentData?.user_name || ''}
                                readOnly
                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-600"
                            />
                        </div>
                        {/* Password Input */}
                        <div>
                            <div className="mb-2">
                                <label className="text-xl font-bold text-gray-700 mb-2">รหัสผ่านใหม่</label>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="กรอกรหัสผ่านใหม่"
                                className="w-full p-3 bg-white border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                            />
                        </div>
                        {/* Confirm Password Input */}
                        <div>
                            <div className="mb-2">
                                <label className="text-xl font-bold text-gray-700 mb-2">ยืนยันรหัสผ่านใหม่</label>
                            </div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="ยืนยันรหัสผ่านใหม่"
                                className="w-full p-3 bg-white border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                            />
                        </div>
                        {/* Student Full Name */}
                        <div>
                            <div className="mb-2">
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
                        {/* Advisor Selection */}
                        <div>
                            <div className="mb-2">
                                <label className="text-xl font-bold text-gray-700 mb-2">อาจารย์ที่ปรึกษา</label>
                            </div>
                            <select
                                value={advisorId}
                                onChange={(e) => setAdvisorId(e.target.value ? Number(e.target.value) : '')}
                                className="w-full p-3 bg-white border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                            >
                                <option value="" disabled>เลือกอาจารย์ที่ปรึกษา</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.ID} value={teacher.ID}>
                                        {teacher.position?.position_name} {teacher.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        
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

export default StudentAccountPage;
