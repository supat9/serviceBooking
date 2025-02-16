import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/Nav";

export default function RepairOrder() {
  const [appointments, setAppointments] = useState([]);
  const [editStatus, setEditStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
      Swal.fire("Error", "กรุณาเข้าสู่ระบบก่อนทำรายการ", "error").then(() => {
        navigate("/login");
      });
      return;
    }

    if (userData.permission === "customer") {
      Swal.fire("Error", "ไม่สามารถเข้าถึงหน้านี้ได้", "error").then(() => {
        navigate("/#home");
      });
      return;
    }

    fetchAppointmentsData(userData.user_id);
  }, [navigate]);

  const fetchAppointmentsData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:3000/appointment/getAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data) {
        setAppointments(data);
      }
    } catch  {
      Swal.fire("Error", "ไม่สามารถโหลดข้อมูลนัดหมายได้", "error");
    }
  };

  const handleStatusChange = (index, newStatus) => {
    setEditStatus((prev) => ({
      ...prev,
      [index]: newStatus,
    }));
  };

  const handleSaveStatus = async (appointmentId, index) => {
    const newStatus = editStatus[index];

    if (!newStatus) {
      Swal.fire("Warning", "กรุณาเลือกสถานะใหม่", "warning");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:3000/service/updateService", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service_id: appointmentId,
          service_status: newStatus,
        }),
      });

      const result = await response.json();
      if (result.success) {
        Swal.fire("Success", "อัปเดตสถานะสำเร็จ", "success");
        fetchAppointmentsData();
      } else {
        Swal.fire("Error", "ไม่สามารถอัปเดตสถานะได้", "error");
      }
    } catch {
      Swal.fire("Error", "เกิดข้อผิดพลาดในการอัปเดตสถานะ", "error");
    }
  };

  return (
    <>
      <Nav />
      <div>
        <h1 className="text-black text-2xl font-bold mb-4">ประวัติการทำรายการ</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border border-gray-700">ชื่อ-นามสกุลของลูกค้า</th>
                <th className="py-2 px-4 border border-gray-700">วันที่นัดหมาย</th>
                <th className="py-2 px-4 border border-gray-700">เวลานัดหมาย</th>
                <th className="py-2 px-4 border border-gray-700">ป้ายทะเบียน</th>
                <th className="py-2 px-4 border border-gray-700">ยี่ห้อรถ</th>
                <th className="py-2 px-4 border border-gray-700">รุ่นรถ</th>
                <th className="py-2 px-4 border border-gray-700">ปี</th>
                <th className="py-2 px-4 border border-gray-700">ประเภทงานซ่อม</th>
                <th className="py-2 px-4 border border-gray-700">รายละเอียด</th>
                <th className="py-2 px-4 border border-gray-700">สถานะ</th>
                <th className="py-2 px-4 border border-gray-700">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((item, index) => {
                  const appointmentDate = new Date(item.appointmentDate);
                  return (
                    <tr key={index}>
                      <td className="py-2 px-4 border border-gray-700">{item.fullname}</td>
                      <td className="py-2 px-4 border border-gray-700">
                        {appointmentDate.toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok" })}
                      </td>
                      <td className="py-2 px-4 border border-gray-700">{item.appointmentTime}</td>
                      <td className="py-2 px-4 border border-gray-700">{item.licensePlate}</td>
                      <td className="py-2 px-4 border border-gray-700">{item.brand}</td>
                      <td className="py-2 px-4 border border-gray-700">{item.model}</td>
                      <td className="py-2 px-4 border border-gray-700">{item.year}</td>
                      <td className="py-2 px-4 border border-gray-700">{item.serviceType}</td>
                      <td className="py-2 px-4 border border-gray-700">{item.serviceDesc}</td>
                      <td className="py-2 px-4 border border-gray-700">
                        <select
                          value={editStatus[index] || item.status}
                          onChange={(e) => handleStatusChange(index, e.target.value)}
                          className="text-black p-1 rounded"
                        >
                          <option value="Pending">รอดำเนินการ</option>
                          <option value="In Progress">กำลังดำเนินการ</option>
                          <option value="Completed">เสร็จสิ้น</option>
                          <option value="Cancelled">ยกเลิก</option>
                        </select>
                      </td>
                      <td className="py-2 px-4 border border-gray-700">
                        <button
                          onClick={() => handleSaveStatus(item.service_id, index)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        >
                          บันทึก
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-4">ยังไม่มีข้อมูลนัดหมาย</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
