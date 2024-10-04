import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreateStudent, GetTeachersList } from '../../services/https/admin/listUsers';

import FrontLayout from '../../components/layouts/FrontLayout';
import { UsersInterface } from '../../interfaces/IUsers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Input, Button, Select } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const { Option } = Select;

function TeacherAccountPage() {
    const [loading, setLoading] = useState(false);
    const [teacherData, setTeacherData] = useState<UsersInterface[]>([]);

    const navigate = useNavigate();

    const getTeachersList = async () => {
        try {
            const res = await GetTeachersList();
            if (res.status == 200) {
                setTeacherData(res.data.data);
                console.log("TeaherData : ", res.data)
            }

        } catch (error) {
            console.error("Error submitting data:", error);
        }

    }
    useEffect(() => {
        getTeachersList();
    }, [])



    const handleConfirm = async (values: UsersInterface) => {
        setLoading(true);
        values.role_id = 1;
        values.email = `${values.user_name}@g.sut.ac.th`;
        values.password = values.user_name;
        console.log("values :", values);

        try {
            const res = await CreateStudent(values);
            if (res.status === 200) {
                console.log(res.data);
                toast.success('ข้อมูลอาจารย์ถูกเพิ่มเรียบร้อยแล้ว!', {
                    onClose: () => {
                        navigate('/Admin/StudentList'); // Navigate after the toast is closed
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
                        ข้อมูลนักศึกษา
                    </motion.h1>

                    <Form
                        {...formItemLayout}
                        onFinish={handleConfirm}
                        initialValues={{
                            user_name: '',
                            full_name: '',
                            advisor_id: '',
                        }}
                    >
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Form.Item
                                label={
                                    <div className='p-2'>
                                        <span className="text-xl font-bold font-NotoSans">รหัสประจำตัวนักศึกษา</span>
                                    </div>
                                }
                                name="user_name" // เปลี่ยนเป็น student_id เพื่อให้สอดคล้องกับรหัสที่ต้องการ
                                rules={[
                                    { required: true, message: "กรุณากรอกรหัสประจำตัวนักศึกษา!" },
                                    {
                                        pattern: /^B[a-zA-Z0-9]{7}$/, // รูปแบบ B ตามด้วยตัวอักษรหรือตัวเลข 7 ตัว
                                        message: "รหัสประจำตัวนักเรียนต้องเริ่มด้วย 'B' ตามด้วย 7 ตัวเลข! เช่น B6412345",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined className="text-indigo-500" />}
                                    placeholder='เช่น B64XXXXX'
                                    style={{ height: '48px' }} // เพิ่มความสูงที่ต้องการ
                                />
                            </Form.Item>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Form.Item
                                label={
                                    <span className="text-xl font-bold font-NotoSans">ชื่อนักศึกษา</span>
                                }
                                name="full_name"
                                rules={[{ required: true, message: "กรุณากรอกชื่อนักศึกษา!" }]}
                            >
                                <Input prefix={<UserOutlined className="text-indigo-500" />}
                                    placeholder='เช่น นาย เก่ง ขยัน'
                                    style={{ height: '48px' }} // เพิ่มความสูงที่ต้องการ
                                />
                            </Form.Item>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Form.Item
                                label={<span className="text-lg font-semibold font-NotoSans">อาจารย์ที่ปรึกษา</span>}
                                name="advisor_id"
                                rules={[{ required: true, message: "กรุณาเลือกอาจารย์ที่ปรึกษา !" }]}
                            >
                                <Select
                                    placeholder="กรุณาเลือกอาจารย์ที่ปรึกษา"
                                    style={{ width: "100%", height: '48px' }} // ตั้งค่าความสูงและความกว้างใน style เดียว
                                >
                                    {teacherData.map((teacher) => (
                                        <Option key={teacher.ID} value={teacher.ID}>
                                            {teacher.position?.position_name} {teacher.full_name} {/* เปลี่ยน full_name เป็นชื่อของอาจารย์ */}
                                        </Option>
                                    ))}
                                </Select>
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
                                    style={{ height: '48px' }} // เพิ่มความสูงที่ต้องการ
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-lg"
                                >
                                    {loading ? 'กำลังบันทึก...' : 'ยืนยันข้อมูล'}
                                </Button>
                            </motion.div>
                        </Form.Item>
                    </Form>
                </motion.div>
            </motion.div>

        </FrontLayout>
    );
}

export default TeacherAccountPage;