import React from 'react';
import { FaEye, FaTrash } from 'react-icons/fa'; // Import icons from react-icons
// Define TypeScript interface for the data
interface Appointment {
    id: number;
    firstname: string;
    lastname: string;
    reasons: string;
    status: string;
}

const data: Appointment[] = [
    { id: 1, firstname: 'Aek', lastname: 'Chai', reasons: 'Discussion about project', status: 'รอการเข้าพบ' },
    { id: 2, firstname: 'Somchai', lastname: 'Sukhum', reasons: 'Course counseling', status: 'รอการเข้าพบ' },
    { id: 3, firstname: 'Anan', lastname: 'Praphat', reasons: 'Exam review', status: 'ไม่ได้เข้าพบ' },
    { id: 4, firstname: 'Nicha', lastname: 'Wong', reasons: 'Career advice', status: 'เข้าพบสำเร็จ' },
    { id: 5, firstname: 'Pim', lastname: 'Sawatdee', reasons: 'Personal issues', status: 'เข้าพบสำเร็จ' },
    { id: 6, firstname: 'Kanya', lastname: 'Kiat', reasons: 'Research assistance', status: 'เข้าพบสำเร็จ' },
    { id: 7, firstname: 'Lek', lastname: 'Thong', reasons: 'Scholarship inquiry', status: 'เข้าพบสำเร็จ' },
];

const TeacherHistoryTable: React.FC = () => {
    // Function to determine cell color based on status
    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'รอการเข้าพบ':
                return 'yellow'; // Light yellow
            case 'เข้าพบสำเร็จ':
                return 'green'; // Light green
            case 'ไม่ได้เข้าพบ':
                return 'red'; // Light red
            default:
                return 'white'; // Default background color
        }
    };

    // Handle view details
    const handleViewDetails = (id: number) => {
        console.log(`View details for appointment ID: ${id}`);
        // Implement your view details logic here
    };

    // Handle delete action
    // const handleDelete = (id: number) => {
    //     console.log(`Delete appointment ID: ${id}`);
    //     // Implement your delete logic here
    // };

    return (
        <div className='border rounded-lg shadow-xl p-5'>
            <div className="overflow-x-auto">
                <table className="table-md ">
                    {/* head */}
                    <thead>
                        <tr className='text-black'>
                            <th>ID</th>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Reasons</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className='font-Kanit text-black'>
                        {data.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.id}</td>
                                <td>{entry.firstname}</td>
                                <td>{entry.lastname}</td>
                                <td>{entry.reasons}</td>
                                <td >
                                    <div className={`py-1 px-2 rounded-md text-center bg-${getStatusColor(entry.status)}-200 border-solid border-2 border-${getStatusColor(entry.status)}-400 `}>{entry.status}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-center'>
                                    <button
                                        onClick={() => handleViewDetails(entry.id)}
                                        className='text-blue-500 hover:text-blue-700 mx-2'
                                    >
                                        <FaEye />
                                    </button>
                                    {/* <button
                                        onClick={() => handleDelete(entry.id)}
                                        className='text-red-500 hover:text-red-700 mx-2'
                                    >
                                        <FaTrash />
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TeacherHistoryTable;
