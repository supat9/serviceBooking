import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // ใช้ navigate
import Nav from "../nav-bar/nav.jsx";
import Footer from "../footer-page/footer.jsx";
import { jwtDecode } from "jwt-decode";

export default function AppointmentForm() {
  const [activeTab, setActiveTab] = useState("vehicle");
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    // ข้อมูลยานพาหนะ
    carPlate: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    // ข้อมูลการนัดหมายเข้ารับบริการ
    repairType: [],
    appointmentDate: "",
    appointmentTime: "",
    additionalDetails: "",
    privacyPolicy: false,
  });

  const repairTypeList = [
    { label: "เช็คระยะ", value: "maintenance" },
    { label: "ซ่อมทั่วไป", value: "general_repair" },
    { label: "ซ่อมสีตัวถัง", value: "body_paint" },
    { label: "งานรับประกัน", value: "warranty" },
    { label: "เปลี่ยนถ่ายน้ำมันเครื่อง", value: "oil_change" },
    { label: "ปัญหาเครื่องยนต์", value: "engine_issue" },
  ];

  const navigate = useNavigate();
  const [loginFlag, setLoginFlag] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  useEffect(() => {
    let userData = localStorage.getItem("accessToken")
      ? jwtDecode(localStorage.getItem("accessToken"))
      : null;
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
      setLoggedInUser(userData);
      setLoginFlag(true);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "repairType") {
      setFormData((prevState) => ({
        ...prevState,
        repairType: checked
          ? [...prevState.repairType, value]
          : prevState.repairType.filter((item) => item !== value),
      }));
    } else if (type === "checkbox" && name === "privacyPolicy") {
      setFormData((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const showPrivacyPolicy = () => {
    Swal.fire({
      title:
        '<h2 style="font-size: 24px; font-weight: bold; color: #333;">นโยบายส่วนบุคคล</h2>',
      html: `
        <div style="text-align: center; font-size: 18px; line-height: 1.8; color: #555;">
          <p>เราให้ความสำคัญกับความเป็นส่วนตัวของข้อมูลลูกค้า <br>ข้อมูลที่คุณให้กับเราจะถูกนำไปใช้เพื่อให้บริการตามที่ร้องขอเท่านั้น</br></p>
          <p>ข้อมูลทั้งหมดจะถูกจัดเก็บในระบบที่ปลอดภัยและมีมาตรการป้องกันข้อมูลรั่วไหล</p>
          <p>หากคุณมีข้อสงสัยเกี่ยวกับนโยบายส่วนบุคคลของเรา <br>กรุณาติดต่อฝ่ายบริการลูกค้า</br></p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "ปิด",
      confirmButtonColor: "#6366F1",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      carPlate,
      brand,
      model,
      year,
      mileage,
      repairType,
      appointmentDate,
      appointmentTime,
      privacyPolicy,
    } = formData;

    if (
      !carPlate ||
      !brand ||
      !model ||
      !year ||
      !mileage ||
      repairType.length === 0 ||
      !appointmentDate ||
      !appointmentTime ||
      !privacyPolicy
    ) {
      Swal.fire(
        "กรุณากรอกข้อมูลให้ครบถ้วน",
        "โปรดตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
        "error"
      );
      return;
    }

    if (year < 1900 || year > new Date().getFullYear()) {
      Swal.fire("ปีรถยนต์ไม่ถูกต้อง", "กรุณากรอกปีรถยนต์ที่ถูกต้อง", "error");
      return;
    }

    if (mileage <= 0) {
      Swal.fire("เลขไมล์ไม่ถูกต้อง", "กรุณากรอกเลขไมล์ที่ถูกต้อง", "error");
      return;
    }

    // If validation passes, proceed with submitting the form
    const userId = loggedInUser.user_id;
    try {
      // 1. เพิ่มข้อมูลรถยนต์ (Vehicle)
      const vehicleResponse = await fetch(
        "http://localhost:3000/vehicle/addVehicle",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            license_plate: formData.carPlate,
            brand: formData.brand,
            model: formData.model,
            year: formData.year,
            miles: formData.mileage,
            user_id: userId,
          }),
        }
      );
      const vehicleData = await vehicleResponse.json();
      if (!vehicleResponse.ok) {
        throw new Error(vehicleData.error || "ไม่สามารถเพิ่มข้อมูลรถยนต์ได้");
      }

      // 2. เพิ่มข้อมูลบริการ (Service)
      const serviceResponse = await fetch(
        "http://localhost:3000/service/addService",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_type: formData.repairType.join(", "),
            service_desc: formData.additionalDetails,
            service_status: "Pending",
            service_time: formData.appointmentTime,
            service_date: formData.appointmentDate,
            vehicle_id: vehicleData.data.vehicle_id,
          }),
        }
      );
      const serviceData = await serviceResponse.json();
      if (!serviceResponse.ok) {
        throw new Error(serviceData.error || "ไม่สามารถเพิ่มข้อมูลบริการได้");
      }

      // 3. เพิ่มข้อมูลนัดหมาย (Appointment)
      const appointmentResponse = await fetch(
        "http://localhost:3000/appointment/addAppointment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointment_date: formData.appointmentDate,
            service_id: serviceData.data.service_id,
          }),
        }
      );
      const appointmentData = await appointmentResponse.json();
      if (!appointmentResponse.ok) {
        throw new Error(
          appointmentData.error || "ไม่สามารถเพิ่มข้อมูลการนัดหมายได้"
        );
      }

      // Success message
      Swal.fire({
        title: "ส่งข้อมูลสำเร็จ!",
        text: "ระบบได้รับข้อมูลของคุณแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      }).then(() => {
        navigate("/TrackServices");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("เกิดข้อผิดพลาด", error.message, "error");
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center "
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
        <Nav />
        {loginFlag ? (
          <div className="max-w-3xl mx-auto p-6 bg-white mt-2   rounded-lg shadow-3xl">
            <div className="flex justify-center border-b mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("vehicle")}
                className={`px-4 py-2 text-2xl font-bold focus:outline-none ${
                  activeTab === "vehicle"
                    ? "border-b-4 border-red-600 text-red-600"
                    : "text-gray-600"
                }`}
              >
                ข้อมูลยานพาหนะ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("appointment")}
                className={`px-4 py-2 text-2xl font-bold focus:outline-none ${
                  activeTab === "appointment"
                    ? "border-b-4 border-red-600 text-red-600"
                    : "text-gray-600"
                }`}
              >
                ข้อมูลการนัดหมาย
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === "vehicle" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-xl">
                      ป้ายทะเบียน <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="carPlate"
                      value={formData.carPlate}
                      onChange={handleChange}
                      className="w-full border p-2 rounded-lg text-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-xl">
                      ยี่ห้อ <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full border p-2 rounded-lg text-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-xl">
                      รุ่น <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full border p-2 rounded-lg text-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-xl">
                      ปี <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full border p-2 rounded-lg text-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-xl">
                      เลขไมล์ <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      className="w-full border p-2 rounded-lg text-xl"
                      required
                    />
                  </div>
                  <div className="flex justify-between mt-6 md:col-span-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("customer")}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg text-2xl transition duration-300 hover:bg-gray-700 shadow-md hover:shadow-lg"
                    >
                      กลับ
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("appointment")}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg text-lg sm:text-2xl transition duration-300 hover:bg-red-700 shadow-md hover:shadow-lg"
                    >
                      ถัดไป
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "appointment" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-1">
                    <label className="block font-medium text-lg sm:text-xl">
                      ประเภทงานซ่อม <span className="text-red-600">*</span>
                    </label>
                    <div className="space-y-2 text-lg sm:text-xl">
                      {repairTypeList.map((item) => (
                        <div key={item.value} className="flex items-center">
                          <input
                            type="checkbox"
                            name="repairType"
                            value={item.value}
                            onChange={handleChange}
                            className="mr-2 w-5 h-5"
                          />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-lg sm:text-xl">
                      วันที่นัดหมาย <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      className="w-full p-2 rounded-lg border text-lg sm:text-xl"
                      required
                      min={today} // Prevent past dates
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-lg sm:text-xl">
                      เวลานัดหมาย <span className="text-red-600">*</span>
                    </label>
                    <div className="space-y-2 text-lg sm:text-xl">
                      {["08:00", "10:00", "13:00"].map((time) => (
                        <div key={time} className="flex items-center">
                          <input
                            type="radio"
                            name="appointmentTime"
                            value={time}
                            onChange={handleChange}
                            className="mr-2 w-5 h-5"
                            required
                          />
                          <span>{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-medium text-lg sm:text-xl">
                      บันทึกรายละเอียดงานซ่อมทั่วไปและอื่นๆ
                    </label>
                    <textarea
                      name="additionalDetails"
                      value={formData.additionalDetails}
                      onChange={handleChange}
                      className="w-full p-2 rounded-lg border text-lg sm:text-xl"
                      rows="4"
                    ></textarea>
                  </div>

                  <div className="md:col-span-2 flex items-center text-lg sm:text-xl">
                    <input
                      type="checkbox"
                      name="privacyPolicy"
                      checked={formData.privacyPolicy}
                      onChange={handleChange}
                      className="mr-2 w-5 h-5"
                      required
                    />
                    <span>
                      คุณได้อ่านและยอมรับ{" "}
                      <a
                        href="#"
                        className="text-red-600 cursor-pointer"
                        onClick={showPrivacyPolicy}
                      >
                        นโยบายส่วนบุคคล
                      </a>{" "}
                      ของเรา
                    </span>
                  </div>

                  <div className="col-span-2 flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab("vehicle")}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg text-2xl transition duration-300 hover:bg-gray-700 shadow-md hover:shadow-lg"
                    >
                      กลับ
                    </button>
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-6 py-2 rounded-lg text-lg sm:text-2xl transition duration-300 hover:bg-red-700 shadow-md hover:shadow-lg"
                    >
                      ส่งข้อมูล
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <Footer />
    </>
  );
}
