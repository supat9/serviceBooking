import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/nav";
import Footer from "../footer-page/footer";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Use react-icons

export default function EditVehicle() {
  const [vehicles, setVehicles] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [vehicleData, setVehicleData] = useState({
    license_plate: "",
    brand: "",
    model: "",
    year: "",
    miles: "",
    vehicle_id: "", // vehicle_id is included for updating
    user_id: "", // user_id is included for updating
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

    if (
      userData.permission === "customer" ||
      userData.permission === "mechanic"
    ) {
      Swal.fire("Error", "ไม่สามารถเข้าถึงหน้านี้ได้", "error").then(() => {
        navigate("/#home");
      });
      return;
    }
    fetchVehicles();
  }, [navigate]);

  const fetchVehicles = async () => {
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
      } else {
        Swal.fire({
          title: "ไม่สามารถดึงข้อมูลรถยนต์ได้",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        icon: "error",
      });
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
      vehicle_id: vehicle.vehicle_id, // Make sure to pass vehicle_id
      user_id: vehicle.user_id, // Make sure to pass user_id
    });
  };

  // Function to handle deleting a vehicle
  const handleDeleteVehicle = (vehicleId) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบรถคันนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
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
          title: "ลบรถสำเร็จ",
          icon: "success",
        });
        setVehicles(
          vehicles.filter((vehicle) => vehicle.vehicle_id !== vehicleId)
        );
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.error,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการลบรถ",
        icon: "error",
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
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        icon: "warning",
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
            user_id: editingVehicle.user_id,
            ...vehicleData,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "อัปเดตข้อมูลรถเรียบร้อย",
          icon: "success",
        });
        setVehicles(
          vehicles.map((vehicle) =>
            vehicle.vehicle_id === editingVehicle.vehicle_id
              ? { ...vehicle, ...vehicleData }
              : vehicle
          )
        );
        setEditingVehicle(null);
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.error,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลรถ",
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
          <Nav />
          <div className="flex-grow max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl text-center font-bold mb-6">
              จัดการข้อมูลยานพาหนะ
            </h1>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-gray-200 text-sm">
                    <th className="px-2 py-1 border border-gray-300">
                      Vehicle Id
                    </th>
                    <th className="px-2 py-1 border border-gray-300">
                      User Id
                    </th>
                    <th className="px-2 py-1 border border-gray-300">
                      ป้ายทะเบียน
                    </th>
                    <th className="px-2 py-1 border border-gray-300">ยี่ห้อ</th>
                    <th className="px-2 py-1 border border-gray-300">รุ่น</th>
                    <th className="px-2 py-1 border border-gray-300">ปี</th>
                    <th className="px-2 py-1 border border-gray-300">
                      เลขไมล์
                    </th>
                    <th className="px-2 py-1 border border-gray-300">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr
                      key={vehicle.vehicle_id}
                      className="border-b hover:bg-gray-50 text-sm"
                    >
                      <td className="px-2 py-1 border border-gray-300">
                        {vehicle.vehicle_id}
                      </td>
                      <td className="px-2 py-1 border border-gray-300">
                        {vehicle.user_id}
                      </td>
                      <td className="px-2 py-1 border border-gray-300">
                        {vehicle.license_plate}
                      </td>
                      <td className="px-2 py-1 border border-gray-300">
                        {vehicle.brand}
                      </td>
                      <td className="px-2 py-1 border border-gray-300">
                        {vehicle.model}
                      </td>
                      <td className="px-2 py-1 border border-gray-300">
                        {vehicle.year}
                      </td>
                      <td className="px-2 py-1 border border-gray-300">
                        {vehicle.miles}
                      </td>
                      <td className="px-2 py-1 border border-gray-300 whitespace-nowrap">
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteVehicle(vehicle.vehicle_id)
                          }
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

            {editingVehicle && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">แก้ไขข้อมูลรถ</h2>
                <form onSubmit={handleUpdateVehicle} className="space-y-4">
                  <div>
                    <label className="block text-lg">License Plate:</label>
                    <input
                      type="text"
                      name="license_plate"
                      value={vehicleData.license_plate}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg">Brand:</label>
                    <input
                      type="text"
                      name="brand"
                      value={vehicleData.brand}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg">Model:</label>
                    <input
                      type="text"
                      name="model"
                      value={vehicleData.model}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg">Year:</label>
                    <input
                      type="text"
                      name="year"
                      value={vehicleData.year}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg">Miles:</label>
                    <input
                      type="text"
                      name="miles"
                      value={vehicleData.miles}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4"
                  >
                    อัปเดตข้อมูลรถ
                  </button>
                </form>
              </div>
            )}
          </div>
          
      </div>
      <Footer />
    </>
  );
}
