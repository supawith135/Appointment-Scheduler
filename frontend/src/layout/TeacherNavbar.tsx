import { useNavigate, useLocation } from 'react-router-dom';

function TeacherNavbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClickHistory = () => {
        if (location.pathname !== '/teacher/history') {
            navigate('/teacher/history');
        }
    };

    return (
        <div className="navbar bg-white shadow-xl h-10">
            <div className="flex-1"></div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <a className="font-Kanit text-black hover:bg-orange-400 hover:text-white">
                            การนัดหมาย
                        </a>
                    </li>
                    <li>
                        <a className="font-Kanit text-black hover:bg-orange-400 hover:text-white">
                            สร้างเวลานัดหมาย
                        </a>
                    </li>

                    <li>
                        <a
                            className={`font-Kanit text-black ${location.pathname === '/teacher/history'
                                ? 'bg-orange-400 text-white'
                                : 'text-black hover:bg-orange-400'
                                }`}
                            onClick={handleClickHistory}
                        >
                            ประวัติจองคิว
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default TeacherNavbar;
