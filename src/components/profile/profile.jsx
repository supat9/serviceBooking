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

  useEffect(() => {
    // ดึง userData จาก localStorage
    const userDataFromStorage = JSON.parse(localStorage.getItem("userData"));
    console.log("userData ", userDataFromStorage);

    // ตรวจสอบ userData
    if (!userDataFromStorage) {
      Swal.fire({
        icon: "error",
        title: "ไม่พบข้อมูลผู้ใช้",
        text: "กรุณาล็อกอินก่อนใช้งาน",
      }).then(() => navigate("/login"));
    } else {
      // เรียก API เพื่อดึงข้อมูลโปรไฟล์ของผู้ใช้
      fetch("http://localhost:3000/auth/getUserProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userDataFromStorage.user_id }), // ส่ง user_id ไปใน body
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
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถดึงข้อมูลโปรไฟล์ได้",
          });
        });
    }
  }, [navigate]);

  // ฟังก์ชันสำหรับการอัปเดตโปรไฟล์
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

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
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: data.message || "ไม่สามารถอัปเดตโปรไฟล์ได้",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถอัปเดตโปรไฟล์ได้",
      });
    }
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div
        className="flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10">
          <h1 className="text-black text-3xl font-bold mb-6 text-center">อัปเดตโปรไฟล์</h1>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="block text-xl font-medium text-gray-700">ชื่อ-นามสกุล:</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-700">ที่อยู่:</label>
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-700">หมายเลขโทรศัพท์:</label>
              <input
                type="number"
                name="contact"
                value={userData.contact}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-700">อีเมล:</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-700">รหัสผ่านใหม่:</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              อัปเดตโปรไฟล์
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
