import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/nav";
import Footer from "../footer-page/footer";

export default function RepairOrder() {
  const [appointments, setAppointments] = useState([]);
  const [editStatus, setEditStatus] = useState({});
  const navigate = useNavigate();

  // กำหนดกลุ่มสถานะและสีที่เกี่ยวข้อง
  const statusGroups = {
    waiting: {
      name: "รอดำเนินการ",
      options: [
        { value: "Pending", label: "รอดำเนินการ", color: "bg-yellow-200" },
        { value: "Approved", label: "อนุมัติแล้ว", color: "bg-yellow-400" },
        { value: "Scheduled", label: "นัดหมายแล้ว", color: "bg-yellow-500" },
      ],
    },
    inProgress: {
      name: "กำลังดำเนินการ",
      options: [
        { value: "In Progress", label: "กำลังซ่อม", color: "bg-blue-300" },
        {
          value: "Parts Ordered",
          label: "สั่งอะไหล่แล้ว",
          color: "bg-blue-400",
        },
        { value: "Waiting Parts", label: "รออะไหล่", color: "bg-blue-500" },
        { value: "Diagnostic", label: "ตรวจวินิจฉัย", color: "bg-blue-600" },
      ],
    },
    completed: {
      name: "เสร็จสิ้น",
      options: [
        { value: "Completed", label: "เสร็จสิ้น", color: "bg-green-400" },
        { value: "QC Passed", label: "ผ่านการตรวจสอบ", color: "bg-green-500" },
        {
          value: "Ready for Pickup",
          label: "พร้อมรับรถ",
          color: "bg-green-600",
        },
        { value: "Delivered", label: "ส่งมอบแล้ว", color: "bg-green-700" },
      ],
    },
    cancelled: {
      name: "ยกเลิก/เลื่อน",
      options: [
        { value: "Cancelled", label: "ยกเลิก", color: "bg-red-400" },
        { value: "Postponed", label: "เลื่อนนัดหมาย", color: "bg-red-300" },
        {
          value: "Customer Declined",
          label: "ลูกค้าปฏิเสธ",
          color: "bg-red-500",
        },
      ],
    },
  };

  // แบนสถานะทั้งหมดเพื่อใช้ในการแสดงผล
  const allStatuses = Object.values(statusGroups).flatMap(
    (group) => group.options
  );

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
      const response = await fetch(
        "http://localhost:3000/appointment/getAppointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      if (data) {
        setAppointments(data);
      }
    } catch {
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
      const response = await fetch(
        "http://localhost:3000/service/updateService",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            service_id: appointmentId,
            service_status: newStatus,
          }),
        }
      );

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

  // ฟังก์ชั่นหาสีตามสถานะ
  const getStatusColor = (status) => {
    const statusObj = allStatuses.find((s) => s.value === status);
    return statusObj ? statusObj.color : "bg-gray-200";
  };

  const getStatusLabel = (status) => {
    const statusObj = allStatuses.find((s) => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  return (
    <>
      <div
        className="pt-24 md:pt-28 min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
        <Nav />
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-black text-4xl font-bold mb-6 text-center">
              รายการการซ่อมรถ
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(statusGroups).map(([key, group]) => (
                <div
                  key={key}
                  className="border rounded-lg p-4 shadow-md bg-gray-50 hover:bg-gray-100 transition duration-200"
                >
                  <h3 className="font-bold mb-3 text-gray-800">{group.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((status) => (
                      <div
                        key={status.value}
                        className="flex items-center bg-white px-3 py-1 rounded-md border shadow-sm"
                      >
                        <div
                          className={`w-4 h-4 rounded-full ${status.color} mr-2`}
                        ></div>
                        <span className="text-sm text-gray-700">
                          {status.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full border border-gray-300">
              {/* หัวตารางสีส้ม */}
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="py-2 px-4 border border-gray-300">
                    วันที่นัดหมาย
                  </th>
                  <th className="py-2 px-4 border border-gray-300">
                    เวลานัดหมาย
                  </th>
                  <th className="py-2 px-4 border border-gray-300">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="py-2 px-4 border border-gray-300">
                    ป้ายทะเบียน
                  </th>
                  <th className="py-2 px-4 border border-gray-300">ยี่ห้อรถ</th>
                  <th className="py-2 px-4 border border-gray-300">รุ่นรถ</th>
                  <th className="py-2 px-4 border border-gray-300">ปี</th>
                  <th className="py-2 px-4 border border-gray-300">
                    ประเภทงานซ่อม
                  </th>
                  <th className="py-2 px-4 border border-gray-300">
                    รายละเอียด
                  </th>
                  <th className="py-2 px-4 border border-gray-300">สถานะ</th>
                  <th className="py-2 px-4 border border-gray-300">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((item, index) => {
                    const appointmentDate = new Date(item.appointmentDate);
                    const currentStatus = editStatus[index] || item.status;
                    return (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 transition duration-200`}
                      >
                        <td className="py-2 px-4 border border-gray-300">
                          {appointmentDate.toLocaleDateString("th-TH", {
                            timeZone: "Asia/Bangkok",
                          })}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {item.appointmentTime}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {item.fullname}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {item.licensePlate}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {item.brand}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {item.model}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {item.year}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {item.serviceType}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          {item.serviceDesc}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          <div className="flex flex-col gap-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                currentStatus
                              )} text-gray-900`}
                            >
                              {getStatusLabel(currentStatus)}
                            </span>
                            <select
                              value={currentStatus}
                              onChange={(e) =>
                                handleStatusChange(index, e.target.value)
                              }
                              className="text-black p-1 rounded border border-gray-300 text-sm"
                            >
                              {/* จัดกลุ่มตัวเลือกในแต่ละกลุ่ม */}
                              {Object.entries(statusGroups).map(
                                ([key, group]) => (
                                  <optgroup key={key} label={group.name}>
                                    {group.options.map((status) => (
                                      <option
                                        key={status.value}
                                        value={status.value}
                                      >
                                        {status.label}
                                      </option>
                                    ))}
                                  </optgroup>
                                )
                              )}
                            </select>
                          </div>
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          <button
                            onClick={() =>
                              handleSaveStatus(item.serviceId, index)
                            }
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
                    <td colSpan="11" className="text-center py-4 bg-white">
                      ยังไม่มีข้อมูลนัดหมาย
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
