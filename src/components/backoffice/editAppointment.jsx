import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav from "../nav-bar/nav";
import Footer from "../footer-page/footer";
import { FaTrashAlt } from "react-icons/fa";

export default function EditAppointment() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
      Swal.fire("Error", "กรุณาเข้าสู่ระบบก่อนทำรายการ", "error").then(() => {
        navigate("/login");
      });
      return;
    }

    if (userData.permission === "customer" || userData.permission === "mechanic") {
      Swal.fire("Error", "ไม่สามารถเข้าถึงหน้านี้ได้", "error").then(() => {
        navigate("/#home");
      });
      return;
    }

    fetchAppointments();
  }, [navigate]);

  const fetchAppointments = async () => {
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
      } else {
        Swal.fire({
          title: "ไม่สามารถดึงข้อมูลการนัดหมายได้",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        icon: "error",
      });
    }
  };

  const handleDeleteAppointment = (appointmentId) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบการนัดหมายนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
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
        });
        setAppointments(appointments.filter((appointment) => appointment.appointment_id !== appointmentId));
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.error,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการลบการนัดหมาย",
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
            <h1 className="text-3xl text-center font-bold mb-6">จัดการข้อมูลการนัดหมาย</h1>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border border-gray-300">Appointment Id</th>
                    <th className="px-4 py-2 border border-gray-300">Service Id</th>
                    <th className="px-4 py-2 border border-gray-300">Full Name</th>
                    <th className="px-4 py-2 border border-gray-300">License Plate</th>
                    <th className="px-4 py-2 border border-gray-300">Brand</th>
                    <th className="px-4 py-2 border border-gray-300">Model</th>
                    <th className="px-4 py-2 border border-gray-300">Appointment Date</th>
                    <th className="px-4 py-2 border border-gray-300">Appointment Time</th>
                    <th className="px-4 py-2 border border-gray-300">Status</th>
                    <th className="px-4 py-2 border border-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.appointment_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-300">{appointment.appointment_id}</td>
                      <td className="px-4 py-2 border border-gray-300">{appointment.serviceId}</td>
                      <td className="px-4 py-2 border border-gray-300">{appointment.fullname}</td>
                      <td className="px-4 py-2 border border-gray-300">{appointment.licensePlate}</td>
                      <td className="px-4 py-2 border border-gray-300">{appointment.brand}</td>
                      <td className="px-4 py-2 border border-gray-300">{appointment.model}</td>
                      <td className="px-4 py-2 border border-gray-300">{appointment.appointmentDate}</td>
                      <td className="px-4 py-2 border border-gray-300">{appointment.appointmentTime}</td>
                      <td className="px-4 py-2 border border-gray-300">{appointment.status}</td>
                      <td className="px-4 py-2 border border-gray-300">
                        <button
                          onClick={() => handleDeleteAppointment(appointment.appointment_id)}
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
          </div>
         
        </div>
        <Footer />
    </>
  );
}
