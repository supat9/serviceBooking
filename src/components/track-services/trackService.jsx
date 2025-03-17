import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/nav.jsx";
import Footer from "../footer-page/footer.jsx";

export default function TrackServices() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [loginFlag, setLoginFlag] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

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

  // ฟังก์ชั่นสำหรับหาข้อมูลสถานะ (สี, ป้ายชื่อ) ตามค่าสถานะ
  const getStatusInfo = (statusValue) => {
    for (const groupKey in statusGroups) {
      const foundStatus = statusGroups[groupKey].options.find(
        (option) => option.value === statusValue
      );
      if (foundStatus) {
        return { ...foundStatus, group: groupKey };
      }
    }
    // ถ้าไม่พบสถานะที่ตรง ใช้ค่าดีฟอลต์
    return { label: statusValue, color: "bg-gray-200", group: "unknown" };
  };

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    console.log("userData ", userData);
    if (!userData) {
      Swal.fire("Error", "กรุณาเข้าสู่ระบบก่อนทำรายการ", "error").then(
        (result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        }
      );
      return;
    } else {
      setLoginFlag(true);
      fetchAppointmentsData();
    }
  }, [navigate]);

  const fetchAppointmentsData = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log("userData ", userData);
    try {
      const response = await fetch(
        "http://localhost:3000/appointment/getAppointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userData.user_id }),
        }
      );
      const data = await response.json();
      console.log("Fetched appointments:", data);
      if (data) {
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // ฟังก์ชันสำหรับกรองข้อมูลตามสถานะ
  const filteredAppointments = appointments.filter((item) => {
    if (activeFilter === "all") return true;

    const statusInfo = getStatusInfo(item.status);
    return statusInfo.group === activeFilter;
  });

  return (
    <>
      <div
        className="pt-24 md:pt-28 min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
        <Nav />
        {loginFlag ? (
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

              {/* เพิ่มปุ่มกรองตามกลุ่มสถานะ */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 py-2 rounded-lg transition ${
                      activeFilter === "all"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    ทั้งหมด
                  </button>
                  {Object.keys(statusGroups).map((groupKey) => (
                    <button
                      key={groupKey}
                      onClick={() => setActiveFilter(groupKey)}
                      className={`px-4 py-2 rounded-lg transition ${
                        activeFilter === groupKey
                          ? "bg-gray-800 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {statusGroups[groupKey].name}
                    </button>
                  ))}
                </div>
            </div>

            <div className="overflow-x-auto bg-white bg-opacity-90 rounded-lg shadow-xl">
              <table className="min-w-full border-collapse">
                {/* หัวตาราง สีส้ม */}
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="py-3 px-4 border">Service ID</th>
                    <th className="py-3 px-4 border">ชื่อ-นามสกุล</th>
                    <th className="py-3 px-4 border">ป้ายทะเบียน</th>
                    <th className="py-3 px-4 border">วันที่นัดหมาย</th>
                    <th className="py-3 px-4 border">เวลานัดหมาย</th>
                    <th className="py-3 px-4 border">สถานะ</th>
                  </tr>
                </thead>

                {/* เนื้อหาตาราง สีขาว-เทา และมี hover effect */}
                <tbody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((item, index) => {
                      const appointmentDate = new Date(item.appointmentDate);
                      const statusInfo = getStatusInfo(item.status);

                      return (
                        <tr
                          key={index}
                          className={`border ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition duration-200`}
                        >
                          <td className="py-3 px-4 border text-center">
                            {item.serviceId}
                          </td>
                          <td className="py-3 px-4 border">{item.fullname}</td>
                          <td className="py-3 px-4 border">
                            {item.licensePlate}
                          </td>
                          <td className="py-3 px-4 border">
                            {appointmentDate.toLocaleDateString("th-TH", {
                              timeZone: "Asia/Bangkok",
                            })}
                          </td>
                          <td className="py-3 px-4 border">
                            {item.appointmentTime}
                          </td>
                          <td className="py-3 px-4 border">
                            <div className="flex items-center justify-center">
                              <span
                                className={`inline-block w-3 h-3 rounded-full ${statusInfo.color} mr-2`}
                              ></span>
                              <span>{statusInfo.label}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-6 px-4 text-center text-gray-500"
                      >
                        {activeFilter !== "all"
                          ? `ไม่พบข้อมูลในสถานะ "${
                              statusGroups[activeFilter]?.name || ""
                            }"`
                          : "ยังไม่มีข้อมูลนัดหมาย"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <Footer />
    </>
  );
}