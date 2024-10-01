import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GetPositionsList, CreateTeacher } from '../../services/https/admin/listUsers';
import FrontLayout from '../../components/layouts/FrontLayout';
import { UsersInterface } from '../../interfaces/IUsers';
import { PositionsInterface } from '../../interfaces/IPositions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TeacherAccountPage() {
    const [userName, setUserName] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [positions, setPositions] = useState<PositionsInterface[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<number | null>(null);


    // Fetch position list when the component mounts
    useEffect(() => {
        getPositionsList();
    }, []);

    const getPositionsList = async () => {
        try {
            const res = await GetPositionsList();
            if (res.status === 200) {
                setPositions(res.data.data);
            } else {
                throw new Error('Failed to fetch positions data');
            }
        } catch (error) {
            console.error("Error fetching positions data:", error);
            toast.error('ไม่สามารถดึงข้อมูลตำแหน่งได้ กรุณาลองใหม่อีกครั้ง');
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        const value: UsersInterface = {
            user_name: userName,
            full_name: fullName,
            position_id: selectedPosition || undefined, // Include selected position ID in the payload
            email: `${userName}@sut.ac.th`,
            role_id: 2,
            password: userName 
        };

        try {
            const res = await CreateTeacher(value);
            if (res.status === 200) {
                toast.success('ข้อมูลอาจารย์ถูกเพิ่มเรียบร้อยแล้ว!');
           
            } else {
                throw new Error('Failed to update account');
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error('ไม่สร้างอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
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
                className="flex flex-grow flex-col p-4 md:p-8 lg:p-10"
            >
                <motion.div
                    className="mx-auto p-6 md:p-10 shadow-2xl rounded-lg w-full max-w-2xl bg-white text-black"
                    whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-red-700 text-3xl md:text-4xl mb-8 text-center font-bold">ข้อมูลอาจารย์</h1>

                    <div className="space-y-6">
                        {/* Existing fields */}
                        <div>
                            <div className="mb-2">
                                <label className="text-xl font-bold text-gray-700 mb-2">ชื่อผู้ใช้</label>
                            </div>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full p-3 bg-white border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                            />
                        </div>
                        {/* Select position */}
                        <div>
                            <div className="mb-2">
                                <label className="text-xl font-bold text-gray-700 mb-2">ตำแหน่ง</label>
                            </div>
                            <select
                                value={selectedPosition || ''}
                                onChange={(e) => setSelectedPosition(Number(e.target.value))}
                                className="w-full p-3 bg-white border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                            >
                                <option value="" disabled>เลือกตำแหน่ง</option>
                                {positions.map((position) => (
                                    <option key={position.ID} value={position.ID}>
                                        {position.position_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Other fields */}
                        <div>
                            <div className="mb-2">
                                <label className="text-xl font-bold text-gray-700 mb-2">ชื่ออาจารย์</label>
                                <p className="text-sm text-gray-600">เช่น นาย สมหวัง ดีมาก</p>
                            </div>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full p-3 bg-white border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                            />
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
                            className={`text-xl font-semibold rounded-full px-8 py-3 text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 transition duration-300 ease-in-out'}`}
                        >
                            {loading ? 'กำลังบันทึก...' : 'ยืนยันข้อมูล'}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </FrontLayout>
    );
}

export default TeacherAccountPage;
