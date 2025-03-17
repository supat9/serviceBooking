import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/nav";
import Footer from "../footer-page/footer";
import { FaEdit, FaTrashAlt, FaSearch, FaFilter,} from "react-icons/fa";

export default function EditService() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    // Filter services based on search term and status filter
    let filtered = [...services];
    
    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.service_id.toString().includes(searchTerm) ||
        service.vehicle_id.toString().includes(searchTerm) ||
        service.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.service_desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(service => service.service_status === statusFilter);
    }
    
    setFilteredServices(filtered);
  }, [services, searchTerm, statusFilter]);

  const fetchServices = async () => {
    setLoading(true);
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
        setFilteredServices(formattedServices);
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
    } finally {
      setLoading(false);
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
    
    // Scroll to the edit form
    setTimeout(() => {
      document.getElementById("editForm").scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDeleteService = (serviceId) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบบริการนี้หรือไม่? การดำเนินการนี้ไม่สามารถเรียกคืนได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
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
          timer: 1500,
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
            vehicle_id: serviceData.vehicle_id,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "อัปเดตข้อมูลบริการเรียบร้อย",
          icon: "success",
          timer: 1500,
        });
        const updatedServices = services.map((service) =>
          service.service_id === editingService.service_id
            ? { ...service, ...serviceData }
            : service
        );
        setServices(updatedServices);
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

  const cancelEdit = () => {
    setEditingService(null);
  };

  const refreshData = () => {
    fetchServices();
    setSearchTerm("");
    setStatusFilter("all");
  };

  const getStatusClass = (status) => {
    switch(status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 font-medium px-2 py-1 rounded-full text-xs";
      case "in-progress":
        return "bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-full text-xs";
      case "completed":
        return "bg-green-100 text-green-800 font-medium px-2 py-1 rounded-full text-xs";
      default:
        return "bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded-full text-xs";
    }
  };

  return (
    <>
     <div
        className="pt-24 md:pt-28 min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
        <Nav />
        
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl text-center font-bold text-gray-800">
                จัดการข้อมูลบริการ
              </h1>
              <button
                onClick={refreshData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
              >
                <FaSearch /> รีเฟรชข้อมูล
              </button>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาด้วย ID, ประเภทบริการ, หรือคำอธิบาย..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              <div className="md:w-64">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="all">ทุกสถานะ</option>
          
                  </select>
                  <FaFilter className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Service Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              {loading ? (
                <div className="py-10 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-gray-600">ไม่พบข้อมูลบริการที่ตรงกับเงื่อนไขการค้นหา</p>
                </div>
              ) : (
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                      <th className="px-6 py-3 border-b border-gray-200">Service ID</th>
                      <th className="px-6 py-3 border-b border-gray-200">Vehicle ID</th>
                      <th className="px-6 py-3 border-b border-gray-200">ประเภทบริการ</th>
                      <th className="px-6 py-3 border-b border-gray-200">รายละเอียด</th>
                      <th className="px-6 py-3 border-b border-gray-200">สถานะ</th>
                      <th className="px-6 py-3 border-b border-gray-200">เวลาบริการ</th>
                      <th className="px-6 py-3 border-b border-gray-200">วันที่บริการ</th>
                      <th className="px-6 py-3 border-b border-gray-200">การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredServices.map((service) => (
                      <tr
                        key={service.service_id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {service.service_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {service.vehicle_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {service.service_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {service.service_desc}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusClass(service.service_status)}>
                            {service.service_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {service.service_time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {service.service_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <button
                            onClick={() => handleEditService(service)}
                            className="text-blue-600 hover:underline mr-2"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.service_id)}
                            className="text-red-600 hover:underline"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
            
            {/* Edit Service Form */}
            {editingService && (
              <div id="editForm" className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  แก้ไขข้อมูลบริการ
                </h2>
                <form onSubmit={handleUpdateService}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">
                        Service ID
                      </label>
                      <input
                        type="text"
                        id="service_id"
                        name="service_id"
                        value={serviceData.service_id}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label htmlFor="vehicle_id" className="block text-sm font-medium text-gray-700">
                        Vehicle ID
                      </label>
                      <input
                        type="text"
                        id="vehicle_id"
                        name="vehicle_id"
                        value={serviceData.vehicle_id}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="service_type" className="block text-sm font-medium text-gray-700">
                        ประเภทบริการ
                      </label>
                      <input
                        type="text"
                        id="service_type"
                        name="service_type"
                        value={serviceData.service_type}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="service_desc" className="block text-sm font-medium text-gray-700">
                        รายละเอียด
                      </label>
                      <input
                        type="text"
                        id="service_desc"
                        name="service_desc"
                        value={serviceData.service_desc}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    {/* <div>
                      <label htmlFor="service_status" className="block text-sm font-medium text-gray-700">
                        สถานะ
                      </label>
                      <select
                        id="service_status"
                        name="service_status"
                        value={serviceData.service_status}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">เลือกสถานะ</option>
                        <option value="pending">รอดำเนินการ</option>
                        <option value="in-progress">กำลังดำเนินการ</option>
                        <option value="completed">เสร็จสิ้น</option>
                      </select>
                    </div> */}
                    <div>
                      <label htmlFor="service_time" className="block text-sm font-medium text-gray-700">
                        เวลาบริการ
                      </label>
                      <input
                        type="time"
                        id="service_time"
                        name="service_time"
                        value={serviceData.service_time}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="service_date" className="block text-sm font-medium text-gray-700">
                        วันที่บริการ
                      </label>
                      <input
                        type="date"
                        id="service_date"
                        name="service_date"
                        value={serviceData.service_date}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                    >
                       บันทึกข้อมูล
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200 ml-2"
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