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
    const handleDelete = (id: number) => {
        console.log(`Delete appointment ID: ${id}`);
        // Implement your delete logic here
    };

    return (
        <div className="border rounded-lg shadow-lg p-4 bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reasons</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((entry) => (
                            <tr key={entry.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.firstname}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.lastname}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.reasons}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`py-1 px-2 text-sm font-medium rounded-md bg-${getStatusColor(entry.status)}-200 text-${getStatusColor(entry.status)}-800`}>
                                        {entry.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleViewDetails(entry.id)}
                                        className='text-blue-500 hover:text-blue-700 mx-2'
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className='text-red-500 hover:text-red-700 mx-2'
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherHistoryTable;
