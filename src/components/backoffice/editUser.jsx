import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/nav";
import Footer from "../footer-page/footer";
import {
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaUserPlus,
  FaFilter,
} from "react-icons/fa";

export default function EditUser() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    password: "",
    permission: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
      Swal.fire({
        title: "ไม่สามารถเข้าถึง",
        text: "กรุณาเข้าสู่ระบบก่อนทำรายการ",
        icon: "error",
        confirmButtonText: "เข้าสู่ระบบ",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    if (
      userData.permission === "customer" ||
      userData.permission === "mechanic"
    ) {
      Swal.fire({
        title: "ไม่มีสิทธิ์เข้าถึง",
        text: "คุณไม่มีสิทธิ์เข้าถึงหน้านี้",
        icon: "error",
        confirmButtonText: "กลับหน้าหลัก",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/#home");
      });
      return;
    }
    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, filterRole, users]);

  const filterUsers = () => {
    let filtered = [...users];

    // กรองตามคำค้นหา
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.user_id.toString().includes(searchTerm)
      );
    }

    // กรองตามสิทธิ์
    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.permission === filterRole);
    }

    setFilteredUsers(filtered);
  };

  const fetchUsers = async () => {
    setLoading(true);
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
        setFilteredUsers(data.user);
      } else {
        Swal.fire({
          title: "ไม่สามารถดึงข้อมูลผู้ใช้ได้",
          text: data.message || "กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setLoading(false);
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
      permission: user.permission,
    });

    // เลื่อนไปที่ฟอร์มแก้ไข
    setTimeout(() => {
      document
        .getElementById("editForm")
        .scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDeleteUser = (userId, username) => {
    Swal.fire({
      title: "ยืนยันการลบผู้ใช้",
      html: `คุณต้องการลบผู้ใช้ <b>${username}</b> หรือไม่?<br>การดำเนินการนี้ไม่สามารถเรียกคืนได้`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId);
      }
    });
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch("http://localhost:3000/auth/deleteUser", {
        method: "POST",
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
          confirmButtonColor: "#3085d6",
        });
        fetchUsers();
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.message || "ไม่สามารถลบผู้ใช้ได้",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการลบผู้ใช้",
        text: "กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#3085d6",
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
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
        icon: "warning",
        confirmButtonColor: "#3085d6",
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
          title: "อัปเดตสำเร็จ",
          text: "โปรไฟล์ผู้ใช้ได้รับการอัปเดตแล้ว",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        fetchUsers();
        setEditingUser(null);
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.message || "ไม่สามารถอัปเดตได้",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์",
        text: "กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleAddNewUser = () => {
    navigate("/register"); // ไปยังหน้าสมัครสมาชิก หรือแก้ไขตามความเหมาะสม
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border border-red-800";
      case "mechanic":
        return "bg-blue-100 text-blue-800 border border-blue-800";
      case "customer":
        return "bg-green-100 text-green-800 border border-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleTranslation = (role) => {
    switch (role) {
      case "admin":
        return "ผู้ดูแลระบบ";
      case "mechanic":
        return "ช่างซ่อม";
      case "customer":
        return "ลูกค้า";
      default:
        return role;
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <>
      <div
        className="pt-24 md:pt-28 min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
        <Nav />
        <div className="flex-grow max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl text-center font-bold mb-6">
              จัดการข้อมูลผู้ใช้
            </h1>

            {/* ส่วนค้นหาและกรองข้อมูล */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ค้นหาผู้ใช้ (ชื่อ, อีเมล, username, ID)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                  <option value="mechanic">ช่างซ่อม</option>
                  <option value="customer">ลูกค้า</option>
                </select>
              </div>

              <button
                onClick={handleAddNewUser}
                className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition duration-300"
              >
                <FaUserPlus />
                <span>เพิ่มผู้ใช้ใหม่</span>
              </button>
            </div>

            {/* แสดงรายการผู้ใช้ */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">ไม่พบข้อมูลผู้ใช้</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ชื่อผู้ใช้
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ชื่อ-นามสกุล
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        อีเมล
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สิทธิ์
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        การดำเนินการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.user_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.user_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                              user.permission
                            )}`}
                          >
                            {getRoleTranslation(user.permission)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteUser(user.user_id, user.username)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* แก้ไขข้อมูลผู้ใช้ */}
          {editingUser && (
            <div
              id="editForm"
              className="bg-white rounded-lg shadow-lg p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">แก้ไขข้อมูลผู้ใช้</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ชื่อ-นามสกุล
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ที่อยู่
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={userData.address}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      เบอร์โทรศัพท์
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={userData.contact}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      อีเมล
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700
                      "
                    >
                      รหัสผ่าน
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      สิทธิ์
                    </label>
                    <select
                      name="permission"
                      value={userData.permission}
                      onChange={handleChange}
                      className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="admin">ผู้ดูแลระบบ</option>
                      <option value="mechanic">ช่างซ่อม</option>
                      <option value="customer">ลูกค้า</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
                  >
                    บันทึก
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg ml-2"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
