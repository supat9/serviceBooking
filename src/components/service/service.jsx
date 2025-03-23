import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
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

  const timeSlots = [
    { time: "08:00", label: "เช้า (08:00 น.)" },
    { time: "10:00", label: "สาย (10:00 น.)" },
    { time: "13:00", label: "บ่าย (13:00 น.)" },
  ];

  const carBrands = [
    "Toyota",
    "Honda",
    "Mazda",
    "Nissan",
    "Mitsubishi",
    "Isuzu",
    "Suzuki",
    "Ford",
    "Chevrolet",
    "Mercedes-Benz",
    "BMW",
    "Audi",
    "Lexus",
    "Tesla",
    "อื่นๆ",
  ];

  const navigate = useNavigate();
  const [loginFlag, setLoginFlag] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let userData = localStorage.getItem("accessToken")
      ? jwtDecode(localStorage.getItem("accessToken"))
      : null;
    if (!userData) {
      Swal.fire({
        title: "โปรดเข้าสู่ระบบ",
        text: "กรุณาเข้าสู่ระบบก่อนทำรายการนัดหมาย",
        icon: "warning",
        confirmButtonText: "เข้าสู่ระบบ",
        confirmButtonColor: "#EF4444",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
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
        '<h2 style="font-size: 24px; font-weight: bold; color: #333;">นโยบายความเป็นส่วนตัว</h2>',
      html: `
        <div style="text-align: left; font-size: 16px; line-height: 1.8; color: #555; padding: 10px;">
          <h3 style="font-size: 18px; color: #EF4444; margin-bottom: 10px;">การเก็บรวบรวมข้อมูล</h3>
          <p>เราให้ความสำคัญกับความเป็นส่วนตัวของข้อมูลลูกค้า ข้อมูลที่คุณให้กับเราจะถูกนำไปใช้เพื่อให้บริการตามที่ร้องขอเท่านั้น</p>
          
          <h3 style="font-size: 18px; color: #EF4444; margin-bottom: 10px; margin-top: 15px;">การรักษาความปลอดภัย</h3>
          <p>ข้อมูลทั้งหมดจะถูกจัดเก็บในระบบที่ปลอดภัยและมีมาตรการป้องกันข้อมูลรั่วไหล</p>
          
          <h3 style="font-size: 18px; color: #EF4444; margin-bottom: 10px; margin-top: 15px;">การติดต่อ</h3>
          <p>หากคุณมีข้อสงสัยเกี่ยวกับนโยบายส่วนบุคคลของเรา กรุณาติดต่อฝ่ายบริการลูกค้า</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "เข้าใจแล้ว",
      confirmButtonColor: "#EF4444",
      showClass: {
        popup: "animate__animated animate__fadeIn",
      },
    });
  };

  const validateForm = () => {
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

    if (!carPlate || !brand || !model || !year || !mileage) {
      Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลยานพาหนะให้ครบถ้วน",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      setActiveTab("vehicle");
      return false;
    }

    if (
      repairType.length === 0 ||
      !appointmentDate ||
      !appointmentTime ||
      !privacyPolicy
    ) {
      Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลการนัดหมายให้ครบถ้วนและยอมรับนโยบายความเป็นส่วนตัว",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      setActiveTab("appointment");
      return false;
    }

    if (year < 1900 || year > new Date().getFullYear()) {
      Swal.fire({
        title: "ปีรถยนต์ไม่ถูกต้อง",
        text: "กรุณากรอกปีรถยนต์ระหว่าง 1900 ถึง " + new Date().getFullYear(),
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      setActiveTab("vehicle");
      return false;
    }

    if (mileage <= 0) {
      Swal.fire({
        title: "เลขไมล์ไม่ถูกต้อง",
        text: "กรุณากรอกเลขไมล์ที่มากกว่า 0",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
      setActiveTab("vehicle");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

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
            service_desc:
              formData.additionalDetails || "ไม่มีรายละเอียดเพิ่มเติม",
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
        html: `
          <div class="text-center">
            <p class="text-lg mb-3">ระบบได้รับข้อมูลการนัดหมายของคุณแล้ว</p>
            <div class="bg-gray-100 p-3 rounded-lg text-left mb-3">
              <p><strong>วันที่:</strong> ${formData.appointmentDate}</p>
              <p><strong>เวลา:</strong> ${formData.appointmentTime} น.</p>
              <p><strong>รถยนต์:</strong> ${formData.brand} ${formData.model}</p>
            </div>
            <p class="text-sm text-gray-600">คุณสามารถติดตามสถานะการซ่อมได้ในหน้าติดตามบริการ</p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "ไปที่หน้าติดตามบริการ",
        confirmButtonColor: "#EF4444",
        showClass: {
          popup: "animate__animated animate__fadeInUp",
        },
      }).then(() => {
        navigate("/TrackServices");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (activeTab === "vehicle") {
      return 50;
    } else if (activeTab === "appointment") {
      return 100;
    }
    return 0;
  };

  return (
    <>
      <div
        className="pt-24 md:pt-28 min-h-screen bg-fixed bg-cover bg-center flex flex-col"
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
        <Nav />
        <div className="flex-grow">

        {loginFlag ? (
          <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white mt-2 rounded-lg shadow-xl mb-8">
            <h1 className="text-2xl md:text-3xl text-center font-bold text-gray-800 mb-4">
              นัดหมายเข้ารับบริการ
            </h1>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className="bg-red-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>

            <div className="flex justify-center border-b mb-6 overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveTab("vehicle")}
                className={`px-4 py-2 text-lg md:text-xl font-bold focus:outline-none transition-all duration-300 ${
                  activeTab === "vehicle"
                    ? "border-b-4 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-red-500"
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-2">🚗</span>
                  ข้อมูลยานพาหนะ
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("appointment")}
                className={`px-4 py-2 text-lg md:text-xl font-bold focus:outline-none transition-all duration-300 ${
                  activeTab === "appointment"
                    ? "border-b-4 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-red-500"
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-2">📅</span>
                  ข้อมูลการนัดหมาย
                </span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="min-h-[560px]">
                {" "}
                {/* Add fixed minimum height container */}
                {activeTab === "vehicle" && (
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-l-4 border-red-600 pl-3">
                      กรอกรายละเอียดยานพาหนะ
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="transition-all duration-300 hover:shadow-md bg-white p-3 rounded-lg">
                        <label className="block font-medium text-lg text-gray-700 mb-2">
                          ป้ายทะเบียน <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="carPlate"
                          value={formData.carPlate}
                          onChange={handleChange}
                          placeholder="กท-1234"
                          className="w-full border border-gray-300 p-3 rounded-lg text-lg focus:ring focus:ring-red-200 focus:border-red-400 transition"
                          required
                        />
                      </div>

                      <div className="transition-all duration-300 hover:shadow-md bg-white p-3 rounded-lg">
                        <label className="block font-medium text-lg text-gray-700 mb-2">
                          ยี่ห้อ <span className="text-red-600">*</span>
                        </label>
                        <select
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-3 rounded-lg text-lg focus:ring focus:ring-red-200 focus:border-red-400 transition"
                          required
                        >
                          <option value="">-- เลือกยี่ห้อรถยนต์ --</option>
                          {carBrands.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="transition-all duration-300 hover:shadow-md bg-white p-3 rounded-lg">
                        <label className="block font-medium text-lg text-gray-700 mb-2">
                          รุ่น <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="model"
                          value={formData.model}
                          onChange={handleChange}
                          placeholder="Altis, Civic, City"
                          className="w-full border border-gray-300 p-3 rounded-lg text-lg focus:ring focus:ring-red-200 focus:border-red-400 transition"
                          required
                        />
                      </div>

                      <div className="transition-all duration-300 hover:shadow-md bg-white p-3 rounded-lg">
                        <label className="block font-medium text-lg text-gray-700 mb-2">
                          ปี <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          placeholder="2023"
                          min="1900"
                          max={new Date().getFullYear()}
                          className="w-full border border-gray-300 p-3 rounded-lg text-lg focus:ring focus:ring-red-200 focus:border-red-400 transition"
                          required
                        />
                      </div>

                      <div className="transition-all duration-300 hover:shadow-md bg-white p-3 rounded-lg md:col-span-2">
                        <label className="block font-medium text-lg text-gray-700 mb-2">
                          เลขไมล์ (กิโลเมตร){" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          name="mileage"
                          value={formData.mileage}
                          onChange={handleChange}
                          placeholder="10000"
                          min="1"
                          className="w-full border border-gray-300 p-3 rounded-lg text-lg focus:ring focus:ring-red-200 focus:border-red-400 transition"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        onClick={() => setActiveTab("appointment")}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg transition duration-300 hover:bg-red-700 shadow-md hover:shadow-lg flex items-center"
                      >
                        ถัดไป <span className="ml-2">→</span>
                      </button>
                    </div>
                  </div>
                )}
                {activeTab === "appointment" && (
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-l-4 border-red-600 pl-3">
                      กรอกรายละเอียดการนัดหมาย
                    </h2>

                    {/* Repair Type Section */}
                    <div className="mb-6">
                      <label className="block font-medium text-lg text-gray-700 mb-3">
                        ประเภทงานซ่อม <span className="text-red-600">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {repairTypeList.map((item) => (
                          <div
                            key={item.value}
                            className="bg-white rounded-lg p-3 border border-gray-200 transition hover:shadow-md"
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`repair-${item.value}`}
                                name="repairType"
                                value={item.value}
                                onChange={handleChange}
                                className="w-5 h-5 text-red-600 focus:ring-red-500"
                              />
                              <label
                                htmlFor={`repair-${item.value}`}
                                className="ml-3 flex items-center"
                              >
                                <span className="text-lg">{item.label}</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Appointment Date and Time Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-white rounded-lg p-4 border border-gray-200 transition hover:shadow-md">
                        <label className="block font-medium text-lg text-gray-700 mb-3">
                          วันที่นัดหมาย <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-gray-500 text-lg">📅</span>
                          </div>
                          <input
                            type="date"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 rounded-lg border border-gray-300 text-lg focus:ring focus:ring-red-200 focus:border-red-400 transition"
                            required
                            min={today}
                          />
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200 transition hover:shadow-md">
                        <label className="block font-medium text-lg text-gray-700 mb-3">
                          เวลานัดหมาย <span className="text-red-600">*</span>
                        </label>
                        <div className="flex flex-col space-y-3">
                          {timeSlots.map((slot) => (
                            <div
                              key={slot.time}
                              className="flex items-center p-2 rounded-lg transition hover:bg-gray-100"
                            >
                              <input
                                type="radio"
                                id={`time-${slot.time}`}
                                name="appointmentTime"
                                value={slot.time}
                                onChange={handleChange}
                                className="w-5 h-5 text-red-600 focus:ring-red-500"
                                required
                              />
                              <label
                                htmlFor={`time-${slot.time}`}
                                className="ml-3 flex items-center"
                              >
                                <span className="text-lg">{slot.label}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Additional Details Section */}
                    <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200 transition hover:shadow-md">
                      <label className="block font-medium text-lg text-gray-700 mb-3">
                        รายละเอียดเพิ่มเติม
                      </label>
                      <textarea
                        name="additionalDetails"
                        value={formData.additionalDetails}
                        onChange={handleChange}
                        placeholder="อธิบายปัญหาหรือรายละเอียดเพิ่มเติมที่ต้องการให้ช่างทราบ..."
                        className="w-full p-3 rounded-lg border border-gray-300 text-lg focus:ring focus:ring-red-200 focus:border-red-400 transition"
                        rows="4"
                      ></textarea>
                    </div>

                    {/* Privacy Policy Section */}
                    <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="privacyPolicy"
                          name="privacyPolicy"
                          checked={formData.privacyPolicy}
                          onChange={handleChange}
                          className="mt-1 w-5 h-5 text-red-600 focus:ring-red-500"
                          required
                        />
                        <label
                          htmlFor="privacyPolicy"
                          className="ml-3 text-base"
                        >
                          ฉันได้อ่านและยอมรับ{" "}
                          <a
                            href="#"
                            className="text-red-600 font-medium hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              showPrivacyPolicy();
                            }}
                          >
                            นโยบายความเป็นส่วนตัว
                          </a>{" "}
                          ของทางศูนย์บริการ
                        </label>
                      </div>
                    </div>

                    {/* Button Section */}
                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={() => setActiveTab("vehicle")}
                        className="bg-gray-600 text-white px-4 py-3 rounded-lg text-lg transition duration-300 hover:bg-gray-700 shadow-md hover:shadow-lg flex items-center"
                      >
                        <span className="mr-2">←</span> กลับ
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`bg-red-600 text-white px-6 py-3 rounded-lg text-lg transition duration-300 hover:bg-red-700 shadow-md hover:shadow-lg flex items-center ${
                          isLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoading ? <>กำลังส่งข้อมูล...</> : <>ส่งข้อมูล</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Summary Box */}
            {Object.values(formData).some(
              (value) =>
                value !== "" &&
                value !== false &&
                (Array.isArray(value) ? value.length > 0 : true)
            ) && (
              <div className="mt-6 bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  ข้อมูลที่กรอก
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.carPlate && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">ทะเบียน:</span>
                      <span>{formData.carPlate}</span>
                    </div>
                  )}
                  {formData.brand && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">ยี่ห้อ:</span>
                      <span>{formData.brand}</span>
                    </div>
                  )}
                  {formData.model && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">รุ่น:</span>
                      <span>{formData.model}</span>
                    </div>
                  )}
                  {formData.year && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">ปี:</span>
                      <span>{formData.year}</span>
                    </div>
                  )}
                  {formData.mileage && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">เลขไมล์:</span>
                      <span>{formData.mileage} กม.</span>
                    </div>
                  )}
                  {formData.repairType.length > 0 && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">ประเภทงานซ่อม:</span>
                      <span>{formData.repairType.join(", ")}</span>
                    </div>
                  )}
                  {formData.appointmentDate && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">วันที่นัดหมาย:</span>
                      <span>{formData.appointmentDate}</span>
                    </div>
                  )}
                  {formData.appointmentTime && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">เวลานัดหมาย:</span>
                      <span>{formData.appointmentTime} น.</span>
                    </div>
                  )}
                  {formData.additionalDetails && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">
                        รายละเอียดเพิ่มเติม:
                      </span>
                      <span>{formData.additionalDetails}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white mt-2 rounded-lg shadow-xl mb-8">
            <h1 className="text-2xl md:text-3xl text-center font-bold text-gray-800 mb-4">
              โปรดเข้าสู่ระบบ
            </h1>
            <p className="text-center text-lg text-gray-600">
              กรุณาเข้าสู่ระบบก่อนทำรายการนัดหมาย
            </p>
          </div>
        )}
              </div>

      </div>
      <Footer />
    </>
  );
}
