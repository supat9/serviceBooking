import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/nav";
import Footer from "../footer-page/footer";
import { FaEdit, FaTrashAlt, FaSearch, FaCarAlt } from "react-icons/fa";

export default function EditVehicle() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("all");
  const [loading, setLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState({
    license_plate: "",
    brand: "",
    model: "",
    year: "",
    miles: "",
    vehicle_id: "",
    user_id: "",
  });
  const [users, setUsers] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
      Swal.fire({
        title: "ไม่สามารถเข้าถึง",
        text: "กรุณาเข้าสู่ระบบก่อนทำรายการ",
        icon: "error",
        confirmButtonText: "เข้าสู่ระบบ",
        confirmButtonColor: "#3085d6"
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
        confirmButtonColor: "#3085d6"
      }).then(() => {
        navigate("/#home");
      });
      return;
    }
    
    fetchVehicles();
    fetchUsers();
  }, [navigate]);

  // Fixed: Added proper dependency array for filterVehicles effect
  useEffect(() => {
    filterVehicles();
  }, [searchTerm, filterBrand, vehicles]); // Only run when these values change

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
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filterVehicles = () => {
    let filtered = [...vehicles];

    // กรองตามคำค้นหา
    if (searchTerm) {
      filtered = filtered.filter(vehicle => 
        vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.year.toString().includes(searchTerm) ||
        vehicle.vehicle_id.toString().includes(searchTerm) ||
        vehicle.user_id.toString().includes(searchTerm)
      );
    }

    // กรองตามยี่ห้อรถ
    if (filterBrand !== "all") {
      filtered = filtered.filter(vehicle => vehicle.brand === filterBrand);
    }

    setFilteredVehicles(filtered);
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/vehicle/getVehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setVehicles(data);
        setFilteredVehicles(data);
        
        // สร้างรายการยี่ห้อรถที่มีในระบบ
        const brands = [...new Set(data.map(vehicle => vehicle.brand))];
        setAvailableBrands(brands);
      } else {
        Swal.fire({
          title: "ไม่สามารถดึงข้อมูลรถยนต์ได้",
          text: "กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonColor: "#3085d6"
        });
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        icon: "error",
        confirmButtonColor: "#3085d6"
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle editing vehicle
  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleData({
      license_plate: vehicle.license_plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      miles: vehicle.miles,
      vehicle_id: vehicle.vehicle_id,
      user_id: vehicle.user_id,
    });
    
    // เลื่อนไปที่ฟอร์มแก้ไข
    setTimeout(() => {
      document.getElementById("editForm")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDeleteVehicle = (vehicleId, licensePlate) => {
    Swal.fire({
      title: "ยืนยันการลบยานพาหนะ",
      html: `คุณต้องการลบรถทะเบียน <b>${licensePlate}</b> หรือไม่?<br>การดำเนินการนี้ไม่สามารถเรียกคืนได้`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteVehicle(vehicleId);
      }
    });
  };

  const deleteVehicle = async (vehicleId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/vehicle/deleteVehicle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vehicle_id: vehicleId }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "ลบยานพาหนะสำเร็จ",
          icon: "success",
          confirmButtonColor: "#3085d6"
        });
        setVehicles(
          vehicles.filter((vehicle) => vehicle.vehicle_id !== vehicleId)
        );
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.error || "ไม่สามารถลบยานพาหนะได้",
          icon: "error",
          confirmButtonColor: "#3085d6"
        });
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการลบยานพาหนะ",
        text: "กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#3085d6"
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();

    if (
      !vehicleData.license_plate ||
      !vehicleData.brand ||
      !vehicleData.model ||
      !vehicleData.year ||
      !vehicleData.miles
    ) {
      return Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
        icon: "warning",
        confirmButtonColor: "#3085d6"
      });
    }

    try {
      const response = await fetch(
        "http://localhost:3000/vehicle/updateVehicle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vehicle_id: editingVehicle.vehicle_id,
            user_id: vehicleData.user_id,
            license_plate: vehicleData.license_plate,
            brand: vehicleData.brand,
            model: vehicleData.model,
            year: vehicleData.year,
            miles: vehicleData.miles,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "อัปเดตสำเร็จ",
          text: "อัปเดตข้อมูลยานพาหนะเรียบร้อย",
          icon: "success",
          confirmButtonColor: "#3085d6"
        });
        fetchVehicles(); // รีเฟรชข้อมูลทั้งหมด
        setEditingVehicle(null);
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.error || "ไม่สามารถอัปเดตข้อมูลได้",
          icon: "error",
          confirmButtonColor: "#3085d6"
        });
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
        text: "กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#3085d6"
      });
    }
  };

  

  const handleCancelEdit = () => {
    setEditingVehicle(null);
  };

  // หาชื่อของเจ้าของรถจาก user_id
  const getUserNameById = (userId) => {
    const user = users.find(user => user.user_id === userId);
    return user ? user.name : `User ID: ${userId}`;
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
              จัดการข้อมูลยานพาหนะ
            </h1>

            {/* ส่วนค้นหาและกรองข้อมูล - Improved responsiveness */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ค้นหายานพาหนะ (ทะเบียน, ยี่ห้อ, รุ่น, ปี)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCarAlt className="text-gray-400" />
                </div>
                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">ยี่ห้อทั้งหมด</option>
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* แสดงข้อมูลตาราง - Improved responsiveness */}
           {/* แสดงรายการยานพาหนะ */}
{loading ? (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
  </div>
) : filteredVehicles.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-xl text-gray-500">ไม่พบข้อมูลยานพาหนะ</p>
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
            ทะเบียน
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ยี่ห้อ
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            รุ่น
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ปี
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            เลขไมล์
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            เจ้าของ
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            การดำเนินการ
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredVehicles.map((vehicle) => (
          <tr key={vehicle.vehicle_id}>
            <td className="px-6 py-4 whitespace-nowrap">
              {vehicle.vehicle_id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {vehicle.license_plate}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {vehicle.brand}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {vehicle.model}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {vehicle.year}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {vehicle.miles}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {getUserNameById(vehicle.user_id)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                onClick={() => handleEditVehicle(vehicle)}
                className="text-indigo-600 hover:text-indigo-900 mr-2"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteVehicle(vehicle.vehicle_id, vehicle.license_plate)}
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

            {/* แสดงฟอร์มแก้ไข - Improved responsiveness */}
            {editingVehicle && (
              <form
                id="editForm"
                onSubmit={handleUpdateVehicle}
                className="bg-gray-100 rounded-lg shadow-lg p-6 mt-8"
              >
                <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูลยานพาหนะ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="license_plate" className="block font-semibold">
                      ทะเบียนรถ
                    </label>
                    <input
                      type="text"
                      name="license_plate"
                      value={vehicleData.license_plate}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="brand" className="block font-semibold">
                      ยี่ห้อ
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={vehicleData.brand}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="model" className="block font-semibold">
                      รุ่น
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={vehicleData.model}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="year" className="block font-semibold">
                      ปี
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={vehicleData.year}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="miles" className="block font-semibold">
                      เลขไมล์
                    </label>
                    <input
                      type="number"
                      name="miles"
                      value={vehicleData.miles}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="user_id" className="block font-semibold">
                      เจ้าของ
                    </label>
                    <select
                      name="user_id"
                      value={vehicleData.user_id}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {users.map(user => (
                        <option key={user.user_id} value={user.user_id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
      </div>
      <Footer />
    </>
  );
}