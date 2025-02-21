import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // ใช้ navigate
import Nav from "../nav-bar/Nav.jsx";
import Footer from "../footer-page/footer.jsx";

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
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
        <Nav />
        {loginFlag ? (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-black text-4xl font-bold mb-6 text-center">
              ประวัติการทำรายการ
            </h1>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-black">
                {/* หัวตาราง สีส้ม */}
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="py-2 px-4 border border-black">
                      ชื่อ-นามสกุล
                    </th>
                    <th className="py-2 px-4 border border-black">
                      ป้ายทะเบียน
                    </th>
                    <th className="py-2 px-4 border border-black">
                      วันที่นัดหมาย
                    </th>
                    <th className="py-2 px-4 border border-black">
                      เวลานัดหมาย
                    </th>
                    <th className="py-2 px-4 border border-black">สถานะ</th>
                  </tr>
                </thead>

                {/* เนื้อหาตาราง สีขาว-เทา และมี hover effect */}
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((item, index) => {
                      const appointmentDate = new Date(item.appointmentDate);
                      return (
                        <tr
                          key={index}
                          className={`border border-black ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } hover:bg-gray-300 transition duration-200`}
                        >
                          <td className="py-2 px-4 border border-black">
                            {item.fullname}
                          </td>
                          <td className="py-2 px-4 border border-black">
                            {item.licensePlate}
                          </td>
                          <td className="py-2 px-4 border border-black">
                            {appointmentDate.toLocaleDateString("th-TH", {
                              timeZone: "Asia/Bangkok",
                            })}
                          </td>
                          <td className="py-2 px-4 border border-black">
                            {item.appointmentTime}
                          </td>
                          <td className="py-2 px-4 border border-black">
                            {item.status}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-4 px-4 text-center text-gray-500 bg-white"
                      >
                        ยังไม่มีข้อมูลนัดหมาย
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
