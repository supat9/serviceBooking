import { useState, useEffect } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; // Import icons
import Swal from "sweetalert2";

export default function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("userData");

    if (token && storedUser) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUser));
    }

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-black shadow-lg py-1" : "bg-black/90 py-3"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
        {/* Logo with animation */}
        <div className="flex items-center">
          <img
            src="src/assets/logo.png"
            alt="Logo"
            className={`ml-4 transition-all duration-500 ${
              scrolled ? "w-32 h-14 md:w-36 md:h-16" : "w-36 h-16 md:w-40 md:h-20"
            }`}
          />
        </div>

        {/* Desktop/Tablet Menu with hover animations */}
        <ul className="hidden lg:flex lg:flex-row space-x-6 xl:space-x-8 flex-grow justify-center">
          {[
            { name: "Home", path: "/#home" },
            { name: "News", path: "/#news" },
            { name: "Contact Us", path: "/#contact" },
            { name: "Service", path: "/services" },
            { name: "Track Service", path: "/TrackServices" },
            { name: "Payment", path: "/payment" },
          ].map((item, index) => (
            <li key={index} className="group">
              <Link
                smooth
                to={item.path}
                className="relative text-white font-bold transition-colors duration-300 group-hover:text-orange-400"
              >
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Profile + Logout (Desktop/Tablet) */}
        <div className="hidden lg:flex ml-auto items-center space-x-4 xl:space-x-10">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="flex items-center text-white hover:text-orange-400 font-bold transition-all duration-300 hover:scale-105"
              >
                <FaUserCircle className="mr-2 text-xl" />
                {userData?.username}
              </Link>

              <button
                onClick={handleLogout}
                className="bg-orange-500 text-black font-bold px-4 py-2 xl:px-6 rounded-full shadow-md
                hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 text-black font-bold px-4 py-2 xl:px-6 rounded-full shadow-md
              hover:bg-orange-600 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Login / Sign up
            </Link>
          )}
        </div>

        {/* Tablet Layout - Icon Menu */}
        <div className="hidden md:flex lg:hidden ml-auto items-center space-x-6">
          {/* Navigation Icons for Tablet */}
          <Link
            smooth
            to="/#home"
            className="text-white hover:text-orange-400 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <Link
            to="/services"
            className="text-white hover:text-orange-400 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </Link>
          <Link
            to="/TrackServices"
            className="text-white hover:text-orange-400 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </Link>
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="text-white hover:text-orange-400 transition-colors duration-300"
            >
              <FaUserCircle className="h-6 w-6" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 text-black font-bold px-4 py-2 rounded-full shadow-md
              hover:bg-orange-600 hover:shadow-lg transition-all duration-300"
            >
              Login
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-orange-400 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-orange-400 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu with slide-in animation */}
      <div 
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-black z-50 transition-all duration-500 transform ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-3 top-10 text-white hover:text-orange-400 p-2 w-8 h-8 transition-colors duration-300"
            aria-label="Close menu"
          >
            <FaTimes className="w-full h-full" />
          </button>

          {/* Logo in mobile menu */}
          <div className="flex justify-center mb-6">
            <img
              src="src/assets/logo.png"
              alt="Logo"
              className="w-36 animate-fadeIn"
            />
          </div>

          {/* Menu items with fade-in animation */}
          <ul className="flex flex-col items-center space-y-6 mt-10">
            {[
              { name: "Home", path: "/#home", delay: "100" },
              { name: "News", path: "/#news", delay: "200" },
              { name: "Contact Us", path: "/#contact", delay: "300" },
              { name: "Service", path: "/services", delay: "400" },
              { name: "Track Service", path: "/TrackServices", delay: "500" },
              { name: "Payment", path: "/payment", delay: "600" },
            ].map((item, index) => (
              <li 
                key={index} 
                className="transform translate-y-4 opacity-0 animate-fadeInUp"
                style={{ 
                  animationDelay: `${item.delay}ms`,
                  animationFillMode: "forwards" 
                }}
              >
                <Link
                  to={item.path}
                  className="block text-white hover:text-orange-400 font-bold transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}

            {/* Profile + Logout (Mobile/Tablet) */}
            {isLoggedIn ? (
              <>
                <li 
                  className="transform translate-y-4 opacity-0 animate-fadeInUp"
                  style={{ 
                    animationDelay: "700ms",
                    animationFillMode: "forwards" 
                  }}
                >
                  <Link
                    to="/profile"
                    className="flex items-center text-white hover:text-orange-400 font-bold transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUserCircle className="mr-2 text-xl" />
                    {userData?.username}
                  </Link>
                </li>
                <li 
                  className="transform translate-y-4 opacity-0 animate-fadeInUp"
                  style={{ 
                    animationDelay: "800ms",
                    animationFillMode: "forwards" 
                  }}
                >
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="bg-orange-500 text-black font-bold px-6 py-2 rounded-full shadow-md
                    hover:bg-orange-600 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li 
                className="transform translate-y-4 opacity-0 animate-fadeInUp"
                style={{ 
                  animationDelay: "700ms",
                  animationFillMode: "forwards" 
                }}
              >
                <Link
                  to="/login"
                  className="bg-orange-500 text-black font-bold px-6 py-2 rounded-full shadow-md
                  hover:bg-orange-600 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Sign up
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}