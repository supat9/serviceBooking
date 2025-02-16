import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // ใช้ navigate
import Nav from "../nav-bar/Nav.jsx";

export default function Track() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [loginFlag, setLoginFlag] = useState(false);

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

  return (
    <>
      <Nav />
      {loginFlag ? (
        <div className=" max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-black text-2xl font-bold mb-4">
            ประวัติการทำรายการ
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border border-gray-700">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="py-2 px-4 border border-gray-700">
                    ป้ายทะเบียน
                  </th>
                  <th className="py-2 px-4 border border-gray-700">
                    วันที่นัดหมาย
                  </th>
                  <th className="py-2 px-4 border border-gray-700">
                    เวลานัดหมาย
                  </th>
                  <th className="py-2 px-4 border border-gray-700">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {appointments?.map((item, index) => {
                  const appointmentDate = new Date(item.appointmentDate);
                  return (
                    <tr key={index}>
                      <td className="py-2 px-4 border border-gray-700">
                        {item.fullname}
                      </td>
                      <td className="py-2 px-4 border border-gray-700">
                        {item.licensePlate}
                      </td>
                      <td className="py-2 px-4 border border-gray-700">
                        {appointmentDate.toLocaleDateString("th-TH", {
                          timeZone: "Asia/Bangkok",
                        })}
                      </td>
                      <td className="py-2 px-4 border border-gray-700">
                        {item.appointmentTime}
                      </td>
                      <td className="py-2 px-4 border border-gray-700">
                        {item.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {appointments.length === 0 && (
              <p className="text-white mt-4">ยังไม่มีข้อมูลนัดหมาย</p>
            )}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
