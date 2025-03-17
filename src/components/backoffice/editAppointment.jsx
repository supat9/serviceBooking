import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/nav";
import Footer from "../footer-page/footer";
import { FaTrashAlt, FaSearch, FaCalendarAlt, FaFilter } from "react-icons/fa";

export default function EditAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
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

    if (userData.permission === "customer" || userData.permission === "mechanic") {
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

    fetchAppointments();
  }, [navigate]);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, filterStatus, appointments]);

  const filterAppointments = () => {
    let filtered = [...appointments];

    // กรองตามคำค้นหา
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.appointment_id.toString().includes(searchTerm) ||
          appointment.serviceId.toString().includes(searchTerm)
      );
    }

    // กรองตามสถานะ
    if (filterStatus !== "all") {
      filtered = filtered.filter((appointment) => appointment.status === filterStatus);
    }

    setFilteredAppointments(filtered);
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/appointment/getAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        const formattedAppointments = data.map((appointment) => ({
          ...appointment,
          appointmentDate: new Date(appointment.appointmentDate).toISOString().split("T")[0], // Format to 'YYYY-MM-DD'
        }));
        setAppointments(formattedAppointments);
        setFilteredAppointments(formattedAppointments);
      } else {
        Swal.fire({
          title: "ไม่สามารถดึงข้อมูลการนัดหมายได้",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
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

  const handleDeleteAppointment = (appointmentId, licensePlate) => {
    Swal.fire({
      title: "ยืนยันการลบการนัดหมาย",
      html: `คุณต้องการลบการนัดหมายของรถทะเบียน <b>${licensePlate}</b> หรือไม่?<br>การดำเนินการนี้ไม่สามารถเรียกคืนได้`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAppointment(appointmentId);
      }
    });
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch("http://localhost:3000/appointment/deleteAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointment_id: appointmentId }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "ลบการนัดหมายสำเร็จ",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        setAppointments(appointments.filter((appointment) => appointment.appointment_id !== appointmentId));
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.error || "ไม่สามารถลบการนัดหมายได้",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการลบการนัดหมาย",
        text: "กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800 border border-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800 border border-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusTranslation = (status) => {
    switch (status) {
      case "pending":
        return "รอยืนยัน";
      case "confirmed":
        return "ยืนยันแล้ว";
      case "completed":
        return "เสร็จสิ้น";
      case "cancelled":
        return "ยกเลิก";
      default:
        return status;
    }
  };

  const formatDate = (dateStr) => {
    const parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
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
              จัดการข้อมูลการนัดหมาย
            </h1>

            {/* ส่วนค้นหาและกรองข้อมูล */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ค้นหาการนัดหมาย (ชื่อ, ทะเบียนรถ, ยี่ห้อ, รุ่น, ID)"
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
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="pending">รอยืนยัน</option>
                  <option value="confirmed">ยืนยันแล้ว</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>

              <button
                onClick={fetchAppointments}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition duration-300"
              >
                <FaCalendarAlt />
                <span>โหลดข้อมูลใหม่</span>
              </button>
            </div>

            {/* แสดงรายการการนัดหมาย */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">ไม่พบข้อมูลการนัดหมาย</p>
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
                        Service ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ชื่อลูกค้า
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ทะเบียนรถ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ยี่ห้อ/รุ่น
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        วันที่นัด
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        เวลา
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สถานะ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        การดำเนินการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.appointment_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.appointment_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.serviceId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.fullname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.licensePlate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.brand} {appointment.model}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(appointment.appointmentDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.appointmentTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                              appointment.status
                            )}`}
                          >
                            {getStatusTranslation(appointment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteAppointment(appointment.appointment_id, appointment.licensePlate)}
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
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}