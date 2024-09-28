import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaLine, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { GetStudentWithAdvisorById } from '../../services/https/student/advisor';
import { UsersInterface } from '../../interfaces/IUsers';

function AdvisorDetail() {
    const [advisor, setAdvisor] = useState<UsersInterface | null>(null);

    const getStudentWithAdvisorById = async (id: string) => {

        try {
           const res = await GetStudentWithAdvisorById(id)
            if (res?.status === 200) {
                setAdvisor(res.data.data);
                console.log("Teacher Data: ", res.data.data);
            }
        } catch (error) {
            console.log("Error fetching teacher data", error);
        }
    };

    const id = String(localStorage.getItem("id"))
    useEffect(() => {
        if (id) {
            getStudentWithAdvisorById(id);
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
            {advisor ? (
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex items-center">
                        <motion.div
                            className="md:flex-shrink-0"
                            variants={itemVariants}
                        >
                            <img
                                src={advisor.advisor?.image || '/placeholder.jpg'}
                                alt={`${advisor.full_name}'s profile`}
                                className="h-32 w-32 object-cover rounded-full m-4"
                            />
                        </motion.div>
                        <div className="p-4 md:p-6 flex-grow">
                            <motion.h1
                                className="text-2xl font-bold text-gray-900 mb-2"
                                variants={itemVariants}
                            >
                                {advisor.advisor?.position?.position_name} {advisor.advisor?.full_name}
                            </motion.h1>
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"
                                variants={itemVariants}
                            >
                                {advisor.advisor?.facebook && (
                                        <div  className="flex items-center text-blue-600 hover:text-blue-800">
                                            <FaFacebook className="mr-2" />
                                            <span className="truncate">{advisor.advisor?.facebook}</span>
                                        </div>
                                    )}
                                {advisor.advisor?.line && (
                                    <div className="flex items-center text-green-600">
                                        <FaLine className="mr-2" />
                                        <span className="truncate">{advisor.advisor?.line}</span>
                                    </div>
                                )}
                                {advisor.advisor?.email && (
                                    <a href={`mailto:${advisor.advisor?.email}`} className="flex items-center text-red-600 hover:text-red-800">
                                        <FaEnvelope className="mr-2" />
                                        <span className="truncate">{advisor.advisor?.email}</span>
                                    </a>
                                )}
                                {advisor.advisor?.contact_number && (
                                    <div className="flex items-center text-purple-600">
                                        <FaPhone className="mr-2" />
                                        <span>{advisor.advisor?.contact_number}</span>
                                    </div>
                                )}
                                {advisor.advisor?.location && (
                                    <div className="flex items-center text-yellow-600 col-span-full">
                                        <FaMapMarkerAlt className="mr-2" />
                                        <span>{advisor.advisor?.location}</span>
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
                    Loading advisor details...
                </motion.p>
            )}
        </motion.main>
    );
}

export default AdvisorDetail;
