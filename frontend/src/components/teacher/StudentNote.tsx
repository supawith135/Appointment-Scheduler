import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetStudentsList } from '../../services/https/teacher/student';
import { CreateBookingTeacher } from '../../services/https/teacher/booking';
import { motion } from 'framer-motion';
import { UsersInterface } from '../../interfaces/IUsers';
import { BookingsInterface } from '../../interfaces/IBookings';
import { Form, Input, Button, AutoComplete } from 'antd';
import { UserOutlined, MailOutlined, CommentOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { TextArea } = Input;

function StudentNote() {
    const [studentsData, setStudentsData] = useState<UsersInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<UsersInterface | null>(null);
    
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const getStudentsList = async () => {
        try {
            const res = await GetStudentsList();
            if (res.status === 200) {
                console.log("studentsData", res.data.data);
                setStudentsData(res.data.data);
            } else {
                toast.error("Failed to fetch students data");
            }
        } catch (error) {
            console.error("Error fetching students data:", error);
            toast.error("Error fetching students data");
        }
    };

    useEffect(() => {
        getStudentsList();
    }, []);

    const handleConfirm = async (values: BookingsInterface) => {
        setLoading(true);
        if (!selectedStudent) {
            toast.error("กรุณาเลือกนักศึกษา");
            setLoading(false);
            return;
        }
        try {
            values.user_id = selectedStudent.ID;
            values.status_id = 2;
            values.created_by_id = Number(localStorage.getItem("id"));
            console.log("values", values)
            // const bookingData = {
            //     ...values,
            //     user_id: selectedStudent.ID
            // };
            const res = await CreateBookingTeacher(values);
            if (res.status === 200) {
                console.log("data : ", res.data)
                toast.success('บันทึกพบนักศึกษาด่วนถูกบันทึกเรียบร้อยแล้ว!', {
                    onClose: () => navigate('/Teacher/History')
                });
            } else {
                throw new Error(res.data.message || 'เกิดข้อผิดพลาด');
            }
        } catch (error: any) {
            console.error("Error submitting data:", error);
            toast.error(error.message || 'ไม่สามารถเพิ่มข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSelect = (value: string, option: any) => {
        const student = studentsData.find(s => s.ID === option.key);
        if (student) {
            setSelectedStudent(student);
        }
    };

    const studentOptions = studentsData.map(student => ({
        value: `${student.user_name} ${student.full_name}`,
        key: student.ID,
        label: `${student.user_name} ${student.full_name}`,
    }));

    const formItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };
    return (
        <>
            <ToastContainer />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-grow flex-col p-4 md:p-8 lg:p-10 bg-gradient-to-br"
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
                        บันทึกพบนักศึกษาด่วน
                    </motion.h1>

                    <Form
                        {...formItemLayout}
                        onFinish={handleConfirm}
                        initialValues={{
                            reason: '',
                            location: '',
                            comment: '',
                        }}
                    >
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Form.Item
                                label={<span className="text-xl font-bold font-NotoSans">ค้นหานักศึกษา</span>}
                                name="student_search"
                                rules={[{ required: true, message: "กรุณาเลือกนักศึกษา!" }]}
                            >
                                <AutoComplete
                                    options={studentOptions}
                                    onSelect={handleStudentSelect}
                                    filterOption={(inputValue, option) =>
                                        option && option.value ? option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 : false
                                    }
                                    // placeholder='ค้นหาชื่อนักศึกษา'
                                    style={{ width: '100%' }}
                                >
                                    <Input prefix={<UserOutlined className="text-indigo-500" />} style={{ height: '48px' }} />
                                </AutoComplete>
                            </Form.Item>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Form.Item
                                label={<span className="text-lg font-semibold font-NotoSans">สถานที่พบ</span>}
                                name="location"
                                rules={[{ required: true, message: "กรุณากรอกสถานที่พบ!" }]}
                                
                            >
                                <Input
                                    prefix={<EnvironmentOutlined className="text-indigo-500" />}
                                    placeholder='เช่น เรียนรวม 1'
                                    style={{ height: '48px' }}
                                />
                            </Form.Item>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Form.Item
                                label={<span className="text-lg font-semibold font-NotoSans">เหตุผลที่พบ</span>}
                                name="reason"
                                rules={[{ required: true, message: 'กรุณากรอกเหตุผลที่พบ' }]}
                            >
                                <Input
                                    prefix={<MailOutlined className="text-indigo-500" />}
                                    style={{ height: '48px' }}
                                />
                            </Form.Item>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Form.Item
                                label={<span className="text-lg font-semibold font-NotoSans">ความคิดเห็น</span>}
                                name="comment"
                                rules={[{ required: true, message: 'กรุณากรอกความคิดเห็น' }]}
                            >
                                <TextArea
                                
                                    rows={4}
                                    style={{ minHeight: '80px' }}
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
                                    style={{ height: '48px', marginTop: '40px' }}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-lg"
                                >
                                    {loading ? 'กำลังบันทึก...' : 'ยืนยันข้อมูล'}
                                </Button>
                            </motion.div>
                        </Form.Item>
                    </Form>
                </motion.div>
            </motion.div>
        </>
    );
}

export default StudentNote;