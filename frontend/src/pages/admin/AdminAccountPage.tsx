import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FrontLayout from '../../components/layouts/FrontLayout';
import { UsersInterface } from '../../interfaces/IUsers';
import { ToastContainer, toast } from 'react-toastify';
import { GetAdminById, UpdateAdminById } from '../../services/https/admin/admin';
import 'react-toastify/dist/ReactToastify.css';

function AdminAccountPage() {
    const [adminData, setAdminData] = useState<UsersInterface | null>(null);
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const id = String(localStorage.getItem('id'));

    const getAdminById = async (id: string) => {
        try {
            const res = await GetAdminById(id);
            if (res.status === 200) {
                setAdminData(res.data.data);
                setFullName(res.data.data.full_name || '');
           
            } else {
                throw new Error('Failed to fetch teacher data');
            }
        } catch (error) {
            console.error("Error fetching teacher data:", error);
            toast.error('ไม่สามารถดึงข้อมูลอาจารย์ได้ กรุณาลองใหม่อีกครั้ง');
        }
    };


    useEffect(() => {
        getAdminById(id);
    }, [id]);

    const handleConfirm = async () => {
        setLoading(true);
        if (!adminData) return;

        const value: UsersInterface = {
            ID: Number(id),
            full_name: fullName,
        };

        try {
            const res = await UpdateAdminById(id, value);
            if (res.status === 200) {
                toast.success('ข้อมูลแอดมินถูกอัปเดตเรียบร้อยแล้ว!');
            } else {
                throw new Error('Failed to update account');
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error('ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
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
                    className="mx-auto p-6 md:p-10 shadow-2xl rounded-lg w-full max-w-2xl bg-white"
                    whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-red-700 text-3xl md:text-4xl mb-8 text-center font-bold">ข้อมูลแอดมิน</h1>

                    <div className="space-y-6">
                        <div>
                            <div className="mb-2">
                                <label className="text-xl font-bold text-gray-700 mb-2">ชื่อผู้ใช้</label>
                            </div>
                            <input
                                type="text"
                                value={adminData?.user_name || ''}
                                readOnly
                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-600"
                            />
                        </div>
                        <div>
                          
                        </div>
                        <div>
                            <div className="mb-2">
                                <label className="text-xl font-bold text-gray-700 mb-2">ชื่อแอดมิน</label>
                                <p className="text-sm text-gray-600">เช่น นาย สมหวัง ดีมาก</p>
                            </div>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full p-3 bg-white border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                            />
                        </div>
                        <div>
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
}

export default AdminAccountPage;
