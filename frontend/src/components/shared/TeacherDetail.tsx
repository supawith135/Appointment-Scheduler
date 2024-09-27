import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaLine, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { GetStudentTeacherById } from '../../services/https/student/student';
import { GetAdminTeacherById } from '../../services/https/admin/admin';
import { UsersInterface } from '../../interfaces/IUsers';
import { useParams } from 'react-router-dom';

function StudentTeacherDetailPage() {
    const [teacher, setTeacher] = useState<UsersInterface | null>(null);

    const getTeacherById = async (id: string) => {
        const role = localStorage.getItem("role");
        try {
            let res;
            if (role === 'student') {
                res = await GetStudentTeacherById(id);
            } else if (role === 'admin') {
                res = await GetAdminTeacherById(id);
            }      
            if (res?.status === 200) {
                setTeacher(res.data.data);
                console.log("Teacher Data: ", res.data.data);
            }
        } catch (error) {
            console.log("Error fetching teacher data", error);
        }
    };

    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        if (id) {
            getTeacherById(id);
        }
    }, [id]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.main
            className="flex-grow p-4 bg-gradient-to-br"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {teacher ? (
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex items-center">
                        <motion.div
                            className="md:flex-shrink-0"
                            variants={itemVariants}
                        >
                            <img
                                src={teacher.image || '/placeholder.jpg'}
                                alt={`${teacher.full_name}'s profile`}
                                className="h-32 w-32 object-cover rounded-full m-4"
                            />
                        </motion.div>
                        <div className="p-4 md:p-6 flex-grow">
                            <motion.h1
                                className="text-2xl font-bold text-gray-900 mb-2"
                                variants={itemVariants}
                            >
                                {teacher.position?.position_name} {teacher.full_name}
                            </motion.h1>
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"
                                variants={itemVariants}
                            >
                                {teacher.facebook && (
                                        <div  className="flex items-center text-blue-600 hover:text-blue-800">
                                            <FaFacebook className="mr-2" />
                                            <span className="truncate">{teacher.facebook}</span>
                                        </div>
                                    )}
                                {teacher.line && (
                                    <div className="flex items-center text-green-600">
                                        <FaLine className="mr-2" />
                                        <span className="truncate">{teacher.line}</span>
                                    </div>
                                )}
                                {teacher.email && (
                                    <a href={`mailto:${teacher.email}`} className="flex items-center text-red-600 hover:text-red-800">
                                        <FaEnvelope className="mr-2" />
                                        <span className="truncate">{teacher.email}</span>
                                    </a>
                                )}
                                {teacher.contact_number && (
                                    <div className="flex items-center text-purple-600">
                                        <FaPhone className="mr-2" />
                                        <span>{teacher.contact_number}</span>
                                    </div>
                                )}
                                {teacher.location && (
                                    <div className="flex items-center text-yellow-600 col-span-full">
                                        <FaMapMarkerAlt className="mr-2" />
                                        <span>{teacher.location}</span>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            ) : (
                <motion.p
                    className="text-center text-xl text-gray-600"
                    variants={itemVariants}
                >
                    Loading teacher details...
                </motion.p>
            )}
        </motion.main>
    );
}

export default StudentTeacherDetailPage;
