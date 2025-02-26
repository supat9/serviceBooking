import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/nav";
import Footer from "../footer-page/footer";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function EditService() {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [serviceData, setServiceData] = useState({
    service_id: "",
    service_type: "",
    service_desc: "",
    service_status: "",
    service_time: "",
    service_date: "",
    vehicle_id: "",
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
    fetchServices();
  }, [navigate]);

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:3000/service/getService", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        // Format service_date to 'yyyy-mm-dd'
        const formattedServices = data.map((service) => ({
          ...service,
          service_date: new Date(service.service_date)
            .toISOString()
            .split("T")[0], // Format to 'yyyy-mm-dd'
        }));
        setServices(formattedServices);
      } else {
        Swal.fire({
          title: "ไม่สามารถดึงข้อมูลบริการได้",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        icon: "error",
      });
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceData({
      service_id: service.service_id,
      service_type: service.service_type,
      service_desc: service.service_desc,
      service_status: service.service_status,
      service_time: service.service_time,
      service_date: service.service_date,
      vehicle_id: service.vehicle_id,
    });
  };

  const handleDeleteService = (serviceId) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบบริการนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteService(serviceId);
      }
    });
  };

  const deleteService = async (serviceId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/service/deleteService",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ service_id: serviceId }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "ลบบริการสำเร็จ",
          icon: "success",
        });
        setServices(
          services.filter((service) => service.service_id !== serviceId)
        );
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.error,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการลบบริการ",
        icon: "error",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();

    if (!serviceData.service_status || !serviceData.service_id) {
      return Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        icon: "warning",
      });
    }

    try {
      const response = await fetch(
        "http://localhost:3000/service/updateServices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_id: editingService.service_id,
            service_status: serviceData.service_status,
            service_desc: serviceData.service_desc,
            service_time: serviceData.service_time,
            service_date: serviceData.service_date,
            service_type: serviceData.service_type,
            vehicle_id: serviceData.vehicle_id, // Ensure vehicle_id is passed here
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "อัปเดตข้อมูลบริการเรียบร้อย",
          icon: "success",
        });
        setServices(
          services.map((service) =>
            service.service_id === editingService.service_id
              ? { ...service, ...serviceData }
              : service
          )
        );
        setEditingService(null);
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.error,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating service:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลบริการ",
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
              จัดการบริการ
            </h1>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border border-gray-300">
                      Service Id
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      Vehicle Id
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      Service Type
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      Description
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Status</th>
                    <th className="px-4 py-2 border border-gray-300">
                      Service Time
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      Service Date
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr
                      key={service.service_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 border border-gray-300">
                        {service.service_id}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {service.vehicle_id}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {service.service_type}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {service.service_desc}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {service.service_status}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {service.service_time}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {service.service_date}
                      </td>

                      <td className="px-4 py-2 border border-gray-300">
                        <button
                          onClick={() => handleEditService(service)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteService(service.service_id)
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

            {editingService && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">
                  แก้ไขข้อมูลบริการ
                </h2>
                <form onSubmit={handleUpdateService} className="space-y-4">
                  <div>
                    <label className="block text-lg">Service Type:</label>
                    <input
                      type="text"
                      name="service_type"
                      value={serviceData.service_type}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg">Description:</label>
                    <input
                      type="text"
                      name="service_desc"
                      value={serviceData.service_desc}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg">Service Status:</label>
                    <select
                      name="service_status"
                      value={serviceData.service_status}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg">Service Time:</label>
                    <input
                      type="time"
                      name="service_time"
                      value={serviceData.service_time}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg">Service Date:</label>
                    <input
                      type="date"
                      name="service_date"
                      value={serviceData.service_date}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4"
                  >
                    อัปเดตข้อมูลบริการ
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
