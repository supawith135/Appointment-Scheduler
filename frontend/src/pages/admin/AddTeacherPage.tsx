import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateTeacher } from '../../services/https/admin/listUsers';
import { Upload, X } from 'lucide-react';
import FrontLayout from '../../components/layouts/FrontLayout';
import { UsersInterface } from '../../interfaces/IUsers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Input, Button, Select } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

function TeacherAccountPage() {
    const [imageString, setImageString] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    const handleConfirm = async (values: UsersInterface) => {
        setLoading(true);
        
        // // ตรวจสอบว่ามีการอัปโหลดรูปภาพหรือไม่
        // if (!imageString) {
        //     toast.error('กรุณาอัปโหลดรูปภาพก่อนส่งข้อมูล!');
        //     setLoading(false);
        //     return; // หยุดการทำงานหากไม่มีรูปภาพ
        // }
    
        values.user_name = values.email;
        values.role_id = 2;
        values.password = values.email;
        // values.image = imageString;
        console.log("values :", values);
    
        try {
            const res = await CreateTeacher(values);
            if (res.status === 200) {
                console.log(res.data);
                toast.success('ข้อมูลอาจารย์ถูกเพิ่มเรียบร้อยแล้ว!', {
                    onClose: () => {
                        navigate('/Admin/TeacherList'); // Navigate after the toast is closed
                    },
                });
            } else {
                const message = res.data.message || 'เกิดข้อผิดพลาด';
                toast.error(message);
                throw new Error(message);
            }
        } catch (error: any) {
            console.error("Error submitting data:", error);
            const errorMessage = error.response?.data?.message || 'ไม่สามารถเพิ่มข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const formItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };

    return (
        <FrontLayout>
            <ToastContainer />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-grow flex-col p-4 md:p-8 lg:p-10 bg-gradient-to-br "
            >
                <motion.div
                    className="mx-auto p-6 md:p-10 shadow-2xl rounded-lg w-full max-w-2xl bg-white"
                    whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.h1
                        className="text-red-700 text-3xl md:text-4xl mb-8 text-center font-bold"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        ข้อมูลอาจารย์
                    </motion.h1>
                    {/* <div className="mb-6">
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
                                    className="w-full h-full object-cover rounded-full border-4 border-purple-500"
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
                    </div> */}

                    <Form
                        {...formItemLayout}
                        onFinish={handleConfirm}
                        initialValues={{
                            position_id: null,
                            full_name: '',
                            email: '',
                            contact_number: '',
                        }}
                    >
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} >
                            <Form.Item
                            
                                label={<span className="text-lg font-semibold font-NotoSans">ตำแหน่ง</span>}
                                name="position_id"
                                rules={[{ required: true, message: "กรุณาเลือกตำแหน่ง !" }]}
                            >
                                <Select

                                    placeholder="กรุณาเลือกตำแหน่ง"
                                    style={{ width: "100%", height: '48px' }} // ตั้งค่าความสูงและความกว้างใน style เดียว
                                >
                                    <Option value={1}>ศาสตราจารย์</Option>
                                    <Option value={2}>รองศาสตราจารย์</Option>
                                    <Option value={3}>ผู้ช่วยศาสตราจารย์</Option>
                                    <Option value={4}>อาจารย์</Option>
                                    <Option value={5}>ผู้ช่วยสอนและวิจัย</Option>
                                </Select>
                            </Form.Item>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Form.Item
                                label={
                                    <span className="text-xl font-bold font-NotoSans">ชื่ออาจารย์</span>
                                }
                                name="full_name"
                                rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
                            >
                                <Input prefix={<UserOutlined className="text-indigo-500" />}
                                    placeholder='เช่น ดร. สมพงษ์ ดีจัง'
                                    style={{ height: '48px' }} // เพิ่มความสูงที่ต้องการ
                                />

                            </Form.Item>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Form.Item
                                label={<span className="text-lg font-semibold font-NotoSans">อีเมล</span>}
                                name="email"
                                rules={[
                                    { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง!" },
                                    { required: true, message: "กรุณากรอกอีเมล!" },
                                    {
                                        pattern: /^[a-zA-Z0-9._%+-]+@sut\.ac\.th$/, // Regex pattern to match emails ending with @sut.ac.th
                                        message: "อีเมลต้องลงท้ายด้วย @sut.ac.th เช่น XXXXX@sut.ac.th"

                                    },
                                    
                                ]}
                                style={{ marginBottom: '20px' }}
                            >
                                <Input
                                    prefix={<MailOutlined className="text-indigo-500" />}
                                    placeholder='เช่น XXXXX@sut.ac.th'
                                    style={{ height: '48px' }} // เพิ่มความสูงที่ต้องการ
                                />
                            </Form.Item>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Form.Item
                                label={<span className="text-lg font-semibold font-NotoSans ">เบอร์ติดต่อ</span>}
                                name="contact_number"
                                rules={[
                                    { required: true, message: 'กรุณาใส่เบอร์ติดต่อ' },
                                    {
                                        pattern: /^0-4422-\d{4}$/, // Regex pattern to match the format
                                        message: 'เบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0-4422 และมีทั้งหมด 9 ตัวเลข (เช่น 0-4422-XXXX)'
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined className="text-indigo-500" />}
                                    placeholder="เช่น 0-4422-XXXX"
                                    style={{ height: '48px' }} // เพิ่มความสูงที่ต้องการ
                                />
                            </Form.Item>
                        </motion.div>

                        <Form.Item>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    style={{ height: '48px' , marginTop: '40px'}} // เพิ่มความสูงที่ต้องการ
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-lg"
                                >
                                    {loading ? 'กำลังบันทึก...' : 'ยืนยันข้อมูล'}
                                </Button>
                            </motion.div>
                        </Form.Item>
                    </Form>
                </motion.div>
            </motion.div>
            <AnimatePresence>
                {/* {isModalOpen && (
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
                )} */}
            </AnimatePresence>
        </FrontLayout>
    );
}

export default TeacherAccountPage;