import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaLine, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { GetTeacherStudentByUserName } from '../../services/https/teacher/student';
import { UsersInterface } from '../../interfaces/IUsers';
import { useParams } from 'react-router-dom';
import Default  from '../../assets/default-profile.jpg'
function StudentDetail() {
    const [student, setStudent] = useState<UsersInterface | null>(null);

    const getstudentById = async (user_name: string) => {
        const res = await GetTeacherStudentByUserName(user_name)
        try {
            if (res?.status === 200) {
                setStudent(res.data.data);
                console.log("student Data: ", res.data.data);
            }
        } catch (error) {
            console.log("Error fetching student data", error);
        }
    };
    const { user_name } = useParams<{ user_name: string }>();
    useEffect(() => {
        if (user_name) {
            getstudentById(user_name);
        }
    }, [user_name]);

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
            {student ? (
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex items-center">
                        <motion.div
                            className="md:flex-shrink-0"
                            variants={itemVariants}
                        >
                            <img
                                src={student.image || Default}
                                alt={`${student.full_name}'s profile`}
                                className="h-32 w-32 object-cover rounded-full m-4"
                            />
                        </motion.div>
                        <div className="p-4 md:p-6 flex-grow">
                            <motion.h1
                                className="text-2xl font-bold text-gray-900 mb-2"
                                variants={itemVariants}
                            >
                                {student.position?.position_name} {student.full_name}
                            </motion.h1>
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"
                                variants={itemVariants}
                            >
                                {student.facebook && (
                                        <div  className="flex items-center text-blue-600 hover:text-blue-800">
                                            <FaFacebook className="mr-2" />
                                            <span className="truncate">{student.facebook}</span>
                                        </div>
                                    )}
                                {student.line && (
                                    <div className="flex items-center text-green-600">
                                        <FaLine className="mr-2" />
                                        <span className="truncate">{student.line}</span>
                                    </div>
                                )}
                                {student.email && (
                                    <a href={`mailto:${student.email}`} className="flex items-center text-red-600 hover:text-red-800">
                                        <FaEnvelope className="mr-2" />
                                        <span className="truncate">{student.email}</span>
                                    </a>
                                )}
                                {student.contact_number && (
                                    <div className="flex items-center text-purple-600">
                                        <FaPhone className="mr-2" />
                                        <span>{student.contact_number}</span>
                                    </div>
                                )}
                                {student.location && (
                                    <div className="flex items-center text-yellow-600 col-span-full">
                                        <FaMapMarkerAlt className="mr-2" />
                                        <span>{student.location}</span>
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
                    Loading student details...
                </motion.p>
            )}
        </motion.main>
    );
}

export default StudentDetail;
