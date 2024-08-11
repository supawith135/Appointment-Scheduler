import React from 'react'
import { useNavigate } from 'react-router-dom'
function Logout() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <button
            className=" bg-red-500 text-white py-2 px-4 rounded"
            onClick={handleLogout}>
            Logout
        </button>
    )
}

export default Logout