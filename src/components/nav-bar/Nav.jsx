import { useState, useEffect } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; // Import icons

import Swal from "sweetalert2";

export default function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("userData");

    if (token && storedUser) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData(null);
    Swal.fire({
      icon: "success",
      title: "ออกจากระบบแล้ว",
      text: "คุณได้ออกจากระบบเรียบร้อยแล้ว",
      timer: 1000,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "/#home";
    });
  };

  return (
    <nav className="bg-black sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="src/assets/logo.png"
            alt="Logo"
            style={{ width: "170px", height: "90px" }}
            className="ml-4"
          />
        </div>

        {/* เมนูหลัก (Desktop) */}
        <ul className="hidden md:flex md:flex-row space-x-8 flex-grow justify-center">
          <li>
            <Link
              smooth
              to="/#home"
              className="relative text-white font-bold hover:text-orange-400 
             after:content-[''] after:absolute after:left-0 after:bottom-0 
             after:w-0 after:h-[2px] after:bg-orange-400 
             after:transition-all after:duration-300 
             hover:after:w-full"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              smooth
              to="/#news"
              className="relative text-white font-bold hover:text-orange-400 
             after:content-[''] after:absolute after:left-0 after:bottom-0 
             after:w-0 after:h-[2px] after:bg-orange-400 
             after:transition-all after:duration-300 
             hover:after:w-full"
            >
              News
            </Link>
          </li>
          <li>
            <Link
              smooth
              to="/#contact"
              className="relative text-white font-bold hover:text-orange-400 
             after:content-[''] after:absolute after:left-0 after:bottom-0 
             after:w-0 after:h-[2px] after:bg-orange-400 
             after:transition-all after:duration-300 
             hover:after:w-full"
            >
              Contact Us
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className="relative text-white font-bold hover:text-orange-400 
             after:content-[''] after:absolute after:left-0 after:bottom-0 
             after:w-0 after:h-[2px] after:bg-orange-400 
             after:transition-all after:duration-300 
             hover:after:w-full"
            >
              Service
            </Link>
          </li>
          <li>
            <Link
              to="/TrackServices"
              className="relative text-white font-bold hover:text-orange-400 
             after:content-[''] after:absolute after:left-0 after:bottom-0 
             after:w-0 after:h-[2px] after:bg-orange-400 
             after:transition-all after:duration-300 
             hover:after:w-full"
            >
              Track Service
            </Link>
          </li>
          <li>
            <Link
              to="/payment"
              className="relative text-white font-bold hover:text-orange-400 
             after:content-[''] after:absolute after:left-0 after:bottom-0 
             after:w-0 after:h-[2px] after:bg-orange-400 
             after:transition-all after:duration-300 
             hover:after:w-full"
            >
              Payment
            </Link>
          </li>
        </ul>

        {/* Profile + Logout (Desktop) */}
        <div className="hidden md:flex ml-auto items-center space-x-10">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="flex items-center text-white hover:text-orange-400 font-bold"
              >
                <FaUserCircle className="mr-2 text-xl" />
                {userData?.username}
              </Link>

              <button
                onClick={handleLogout}
                className="bg-orange-500 text-black font-bold px-6 py-2 rounded-full shadow-md
             hover:bg-orange-700 hover:shadow-lg transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 text-black font-bold px-6 py-2 rounded-full shadow-md
             hover:bg-orange-700 hover:shadow-lg transition duration-300"
            >
              Login / Sign up
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-orange-400"
          >
            {isOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* เมนู Mobile */}
      {isOpen && (
        <div className="md:hidden bg-black text-white absolute top-0 left-0 w-full  z-50 p-6 flex flex-col">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-3 top-10 text-white hover:text-orange-400 p-2 w-8 h-8"
          >
            <FaTimes className="w-full h-full" />
          </button>

          {/* โลโก้ */}
          <div className="flex justify-center mb-6">
            <img
              src="src/assets/logo.png"
              alt="Logo"
              style={{ width: "150px" }}
            />
          </div>

          {/* รายการเมนู (จัดให้อยู่ตรงกลาง) */}
          <ul className="flex flex-col items-center space-y-6">
            <li>
              <Link
                to="/#home"
                className="block text-white hover:text-orange-400 font-bold"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/#news"
                className="block text-white hover:text-orange-400 font-bold"
                onClick={() => setIsOpen(false)}
              >
                News
              </Link>
            </li>
            <li>
              <Link
                to="/#contact"
                className="block text-white hover:text-orange-400 font-bold"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="block text-white hover:text-orange-400 font-bold"
                onClick={() => setIsOpen(false)}
              >
                Service
              </Link>
            </li>
            <li>
              <Link
                to="/TrackServices"
                className="block text-white hover:text-orange-400 font-bold"
                onClick={() => setIsOpen(false)}
              >
                Track Service
              </Link>
            </li>
            <li>
              <Link
                to="/Payment"
                className="block text-white hover:text-orange-400 font-bold"
                onClick={() => setIsOpen(false)}
              >
                Payment
              </Link>
            </li>

            {/* Profile + Logout (Mobile) */}
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center text-white hover:text-orange-400 font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUserCircle className="mr-2 text-xl " />
                    {userData?.username}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block text-white hover:text-orange-400 font-bold"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="block text-white hover:text-orange-400 font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Sign up
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
