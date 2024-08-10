import React from 'react'
import { useNavigate } from 'react-router-dom';

function TeacherHomePage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <h1 className="text-2xl font-semibold">Welcome, TeacherHomePage</h1>
            <button
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}

export default TeacherHomePage