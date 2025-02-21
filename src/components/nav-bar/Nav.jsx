import { useState, useEffect } from "react"; 
import { HashLink as Link } from "react-router-hash-link";
import Swal from "sweetalert2";

export default function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(""); // เพิ่ม state เก็บ section ปัจจุบัน

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }

    const handleScroll = () => {
      const sections = ["home", "news", "contact"];
      let currentSection = "";

      sections.forEach((section) => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
          const rect = sectionElement.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
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

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-black sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 relative z-20">
        <div className="flex items-center">
          <img
            src="src/assets/logo.png"
            alt="Logo"
            style={{ width: "170px", height: "90px" }}
            className="ml-4"
          />
        </div>

        <ul
          className={`${
            isOpen ? "flex flex-col min-h-screen" : "hidden"
          } md:flex md:flex-row md:space-x-8 bg-black md:bg-transparent absolute md:relative top-0 left-0 w-full justify-center items-center p-4 md:p-0 z-50`}
        >
          {isOpen && (
            <li className="md:hidden mb-4">
              <img
                src="src/assets/logo.png"
                alt="Logo"
                style={{ width: "170px", height: "90px" }}
              />
            </li>
          )}

          {isOpen && (
            <li className="absolute top-9 right-9 md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white hover:text-orange-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </li>
          )}

          <li>
            <Link
              smooth
              to="/#home"
              onClick={handleLinkClick}
              className={`text-white block font-bold ${
                activeSection === "home" ? "text-orange-400" : "hover:text-orange-400"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              smooth
              to="/#news"
              onClick={handleLinkClick}
              className={`text-white block font-bold ${
                activeSection === "news" ? "text-orange-400" : "hover:text-orange-400"
              }`}
            >
              News
            </Link>
          </li>
          <li>
            <Link
              smooth
              to="/#contact"
              onClick={handleLinkClick}
              className={`text-white block font-bold ${
                activeSection === "contact" ? "text-orange-400" : "hover:text-orange-400"
              }`}
            >
              Contact Us
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              onClick={handleLinkClick}
              className="text-white hover:text-orange-400 block font-bold"
            >
              Service
            </Link>
          </li>
          <li>
            <Link
              to="/TrackServices"
              onClick={handleLinkClick}
              className="text-white hover:text-orange-400 block font-bold"
            >
              Track Service
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  handleLinkClick();
                }}
                className="text-white hover:text-orange-400 block font-bold"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="text-white hover:text-orange-400 block font-bold"
              >
                Login / Sign up
              </Link>
            )}
          </li>
        </ul>

        <div className="md:hidden">
          <button
            id="menu-toggle"
            className="text-white hover:text-orange-400 p-6"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
