import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/nav.jsx";
import Footer from "../footer-page/footer.jsx";

export default function Profile() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    user_id: "",
    name: "",
    address: "",
    contact: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ดึง userData จาก localStorage
    const userDataFromStorage = JSON.parse(localStorage.getItem("userData"));
    
    // ตรวจสอบ userData
    if (!userDataFromStorage) {
      Swal.fire({
        icon: "error",
        title: "ไม่พบข้อมูลผู้ใช้",
        text: "กรุณาล็อกอินก่อนใช้งาน",
      }).then(() => navigate("/login"));
    } else {
      // เรียก API เพื่อดึงข้อมูลโปรไฟล์ของผู้ใช้
      setIsLoading(true);
      fetch("http://localhost:3000/auth/getUserProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userDataFromStorage.user_id }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUserData(data.user);
          } else {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: "ไม่สามารถดึงข้อมูลโปรไฟล์ได้",
            });
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถดึงข้อมูลโปรไฟล์ได้",
          });
          setIsLoading(false);
        });
    }
  }, [navigate]);

  // ฟังก์ชันสำหรับการอัปเดตโปรไฟล์
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:3000/auth/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "โปรไฟล์อัปเดตสำเร็จ",
          text: data.message,
          confirmButtonColor: "#f97316",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: data.message || "ไม่สามารถอัปเดตโปรไฟล์ได้",
          confirmButtonColor: "#f97316",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถอัปเดตโปรไฟล์ได้",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Nav />
      <div
        className="pt-24 md:pt-28 flex-1 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
        <div className="max-w-3xl mx-auto p-6 md:p-8 bg-white rounded-xl shadow-2xl mt-6 md:mt-10 mb-6 md:mb-10 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500 opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500 opacity-10 rounded-full -ml-16 -mb-16"></div>
          
          <h1 className="text-black text-2xl md:text-3xl font-bold mb-2 text-center">อัปเดตโปรไฟล์</h1>
          <p className="text-gray-500 text-center mb-8">แก้ไขข้อมูลส่วนตัวของคุณ</p>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="form-group">
                <label className="block text-lg md:text-xl font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    ชื่อ-นามสกุล:
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="กรุณากรอกชื่อ-นามสกุล"
                />
              </div>
              
              <div className="form-group">
                <label className="block text-lg md:text-xl font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    ที่อยู่:
                  </span>
                </label>
                <textarea
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="กรุณากรอกที่อยู่"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label className="block text-lg md:text-xl font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    หมายเลขโทรศัพท์:
                  </span>
                </label>
                <input
                  type="number"
                  name="contact"
                  value={userData.contact}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="กรุณากรอกหมายเลขโทรศัพท์"
                />
              </div>
              
              <div className="form-group">
                <label className="block text-lg md:text-xl font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    อีเมล:
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="กรุณากรอกอีเมล"
                />
              </div>
              
              <div className="form-group">
                <label className="block text-lg md:text-xl font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    รหัสผ่านใหม่:
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="กรุณากรอกรหัสผ่านใหม่"
                />
                <p className="text-sm text-gray-500 mt-1">หากไม่ต้องการเปลี่ยนรหัสผ่าน ให้เว้นว่างไว้</p>
              </div>
              
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full p-4 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg hover:from-orange-500 hover:to-orange-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex justify-center items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.5"></path>
                      </svg>
                      กำลังอัปเดตโปรไฟล์...
                    </span>
                  ) : (
                    "อัปเดตโปรไฟล์"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}