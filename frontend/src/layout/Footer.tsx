//React Router Dom
import { Link } from 'react-router-dom';
//React Icon
import { BiLogoFacebook } from "react-icons/bi";
import { MdEmail } from "react-icons/md";

function Footer() {
    return (
        <footer className="flex bg-stone-500 h-20 items-center">
            <div className="w-4/12" /> {/* Empty space */}
            <div className="w-4/12 text-gray-200 text-sm text-center hidden sm:block">
                © 2024 Institute of Engineering, Suranaree University of Technology
            </div>
            <div className="w-4/12 flex justify-end mr-4 gap-2">
                <Link to="https://www.facebook.com/cpesut">
                    <BiLogoFacebook className="text-2xl text-gray-200 hover:text-cyan-700" />
                </Link>
                {/* mailto:info@example.com — ที่อยู่ผู้รับอีเมล
                    ?subject=Hello — กำหนดหัวข้อของอีเมล
                    &body=How are you? — กำหนดเนื้อหาของอีเมล */}
                <Link to={`mailto:cpe@sut.ac.th?subject=Subject&body=Message Body`}>
                    <MdEmail className="text-2xl text-gray-200 hover:text-cyan-700 " aria-label="Email Us" />
                </Link>
            </div>
        </footer>
    );
}

export default Footer;
