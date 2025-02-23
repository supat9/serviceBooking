import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/nav";
import Footer from "../footer-page/footer";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // ใช้ react-icons

export default function EditUser() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    password: "",
    permission: "", // set permission field
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
      Swal.fire("Error", "กรุณาเข้าสู่ระบบก่อนทำรายการ", "error").then(() => {
        navigate("/login");
      });
      return;
    }

    if (userData.permission === "customer" || userData.permission === "mechanic") {
      Swal.fire("Error", "ไม่สามารถเข้าถึงหน้านี้ได้", "error").then(() => {
        navigate("/#home");
      });
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/getAllUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.user);
      } else {
        Swal.fire({
          title: "ไม่สามารถดึงข้อมูลผู้ใช้ได้",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        icon: "error",
      });
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserData({
      name: user.name,
      address: user.address,
      contact: user.contact,
      email: user.email,
      password: "",
      permission: user.permission, // set permission when editing
    });
  };

  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบผู้ใช้นี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId);
      }
    });
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch("http://localhost:3000/auth/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "ลบผู้ใช้สำเร็จ",
          icon: "success",
        });
        fetchUsers();
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.message,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการลบผู้ใช้",
        icon: "error",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (
      !userData.name ||
      !userData.address ||
      !userData.contact ||
      !userData.email
    ) {
      return Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        icon: "warning",
      });
    }

    try {
      const response = await fetch("http://localhost:3000/auth/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: editingUser.username,
          ...userData,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "โปรไฟล์ได้รับการอัปเดต",
          icon: "success",
        });
        fetchUsers();
        setEditingUser(null);
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.message,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์",
        icon: "error",
      });
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
        <div className="min-h-screen flex flex-col">
          <Nav />
          <div className="flex-grow max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl text-center font-bold mb-6">จัดการผู้ใช้</h1>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-gray-200">
                  <th className="px-4 py-2 border border-gray-300">UserId</th>
                    <th className="px-4 py-2 border border-gray-300">ชื่อผู้ใช้</th>
                    <th className="px-4 py-2 border border-gray-300">ชื่อ-นามสกุล</th>
                    <th className="px-4 py-2 border border-gray-300">ที่อยู่</th>
                    <th className="px-4 py-2 border border-gray-300">อีเมล</th>
                    <th className="px-4 py-2 border border-gray-300">หมายเลขโทรศัพท์</th>
                    <th className="px-4 py-2 border border-gray-300">สิทธิ์ของผู้ใช้</th>
                    <th className="px-4 py-2 border border-gray-300">จัดการผู้ใช้</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.user_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 border border-gray-300">
                        {user.user_id}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {user.username}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {user.name}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {user.address}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {user.email}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {user.contact}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {user.permission}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.user_id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {editingUser && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">แก้ไขโปรไฟล์</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-lg">ชื่อ:</label>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg">ที่อยู่:</label>
                    <input
                      type="text"
                      name="address"
                      value={userData.address}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg">หมายเลขโทรศัพท์:</label>
                    <input
                      type="text"
                      name="contact"
                      value={userData.contact}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg">อีเมล:</label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg">Permission:</label>
                    <select
                      name="permission"
                      value={userData.permission}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="mechanic">Mechanic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg">
                      รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน):
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4"
                  >
                    อัปเดตโปรไฟล์
                  </button>
                </form>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
