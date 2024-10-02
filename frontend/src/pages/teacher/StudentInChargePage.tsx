import FrontLayout from '../../components/layouts/FrontLayout'
import ListStudentInCharge from '../../components/teacher/ListStudentInCharge'
import { motion } from 'framer-motion'

function StudentInChargePage() {
    return (
        <FrontLayout>
            <main className="flex-grow p-4 sm:p-6 lg:p-10 bg-white">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        backgroundColor: '#800020',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                    }}
                >
                    รายชื่อนักศึกษาที่ดูแล
                </motion.div>
                <ListStudentInCharge />
            </main>
            
        </FrontLayout>
    )
}

export default StudentInChargePage