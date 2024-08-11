import { useNavigate, useLocation } from 'react-router-dom';

function StuduntNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickHistory = () => {
    if (location.pathname !== '/student/history') {
      navigate('/student/history');
    }
  };

  return (
    <div className="navbar bg-white shadow-xl h-10">
      <div className="flex-1"></div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <details>
              <summary className="font-Kanit text-black hover:bg-orange-400 hover:text-white">
                การจองคิวนัดหมาย
              </summary>
              <ul className="bg-white rounded-t-none p-2">
                <li>
                  <a className="text-black font-Kanit hover:bg-orange-400 hover:text-white">
                    อาจารย์ที่ปรึกษา
                  </a>
                </li>
                <li>
                  <a className="text-black font-Kanit hover:bg-orange-400 hover:text-white">
                    อาจารย์สาขา
                  </a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a
              className={`font-Kanit text-black ${
                location.pathname === '/student/history'
                  ? 'bg-orange-400 text-white'
                  : 'text-black hover:bg-orange-400'
              }`}
              onClick={handleClickHistory}
            >
              ประวัติการจองคิว
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default StuduntNavbar;
