import { Link } from 'react-router-dom';
import { BiLogoFacebook } from 'react-icons/bi';
import { MdEmail } from 'react-icons/md';

function Footer() {
    return (
        <footer className="flex flex-col sm:flex-row bg-SUT-Grey h-20 items-center justify-between p-4">
            <div className="hidden sm:block text-gray-200 text-sm text-center flex-grow">
                © 2024 Institute of Engineering, Suranaree University of Technology
            </div>
            <div className="flex justify-center sm:justify-end gap-4">
                <Link to="https://www.facebook.com/cpesut" aria-label="Facebook Page">
                    <BiLogoFacebook className="text-2xl text-gray-200 hover:text-ENGi-Red transition-colors duration-300" />
                </Link>
                <Link to={`mailto:cpe@sut.ac.th?subject=Subject&body=Message Body`} aria-label="Email Us">
                    <MdEmail className="text-2xl text-gray-200 hover:text-ENGi-Red transition-colors duration-300" />
                </Link>
            </div>
        </footer>
    );
}

export default Footer;
