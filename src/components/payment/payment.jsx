import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Nav from "../nav-bar/nav";
import { useNavigate } from "react-router-dom";
import Footer from "../footer-page/footer";

export default function Payment() {
  const navigate = useNavigate();
  const [loginFlag, setLoginFlag] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [slipData, setSlipData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
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
      fetchRepairOrders();
    }
  }, [navigate]);

  const fetchRepairOrders = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log("userData ", userData);
    try {
      const response = await fetch(
        "http://localhost:3000/repairOrder/getRepairOrders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData.user_id })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        Swal.fire("Error", "Failed to fetch repair orders", "error");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      Swal.fire("Error", "Server connection failed", "error");
    }
  };

  const handleFileChange = (e, orderId) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedOrder(orderId);
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e, orderId) => {
    e.preventDefault();
    if (!selectedFile || orderId !== selectedOrder) {
      Swal.fire("คำเตือน", "กรุณาเลือกไฟล์สลิปก่อนอัปโหลด", "warning");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("order_id", orderId);

    try {
      const response = await fetch(
        "http://localhost:3000/payment/uploadPayment",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSlipData(data);
        Swal.fire({
          title: "อัปโหลดสำเร็จ",
          text: "อัปโหลดสลิปการชำระเงินเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonColor: "#4CAF50"
        });
      } else {
        setErrorMessage(data.message || "การอัปโหลดล้มเหลว");
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: data.message || "การอัปโหลดล้มเหลว",
          icon: "error",
          confirmButtonColor: "#F44336"
        });
      }
      console.log("Slip Data:", slipData);
    } catch {
      setErrorMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        icon: "error",
        confirmButtonColor: "#F44336"
      });
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชั่นแสดงสถานะการชำระเงิน
  const renderPaymentStatus = (order) => {
    if (slipData && selectedOrder === order.order_id) {
      if (slipData.data.amount === order.cost) {
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-green-600 font-medium">อัปโหลดสำเร็จ</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-yellow-600 font-medium">จำนวนเงินไม่ตรงกับค่าซ่อมรถ</span>
          </div>
        );
      }
    } else {
      return (
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-red-600 font-medium">รอการอัปโหลด</span>
        </div>
      );
    }
  };

  return (
    <>
      <div
        className="pt-24 md:pt-28 min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
        <Nav />
        {loginFlag ? (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-black text-4xl font-bold mb-6 text-center">
              ประวัติการชำระเงิน
            </h1>

            {/* คำอธิบายและคำแนะนำ */}
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200 text-blue-800">
              <h2 className="text-lg font-semibold mb-2">คำแนะนำการชำระเงิน</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>อัปโหลดภาพสลิปการโอนเงินในช่อง Upload Payment Slip</li>
                <li>ตรวจสอบให้แน่ใจว่าจำนวนเงินที่โอนตรงกับค่าซ่อมรถที่แสดงในตาราง</li>
                <li>หลังจากอัปโหลดสำเร็จ สถานะจะเปลี่ยนเป็น "อัปโหลดสำเร็จ"</li>
              </ul>
            </div>

            {/* Responsive table container */}
            <div className="bg-white bg-opacity-90 rounded-lg shadow-xl">
              {/* Table for medium and larger screens */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-500 text-white">
                      <th className="py-3 px-4 border">Order ID</th>
                      <th className="py-3 px-4 border">ค่าซ่อมรถ</th>
                      <th className="py-3 px-4 border">รายละเอียด</th>
                      <th className="py-3 px-4 border">Upload Payment Slip</th>
                      <th className="py-3 px-4 border">สถานะ</th>
                      <th className="py-3 px-4 border">ผู้โอน</th>
                      <th className="py-3 px-4 border">ผู้รับ</th>
                      <th className="py-3 px-4 border">จำนวนเงินที่โอน</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order, index) => (
                        <tr
                          key={index}
                          className={`border ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition duration-200`}
                        >
                          <td className="py-3 px-4 border text-center font-medium">
                            {order.order_id}
                          </td>
                          <td className="py-3 px-4 border text-right">
                            {order.cost.toLocaleString()} ฿
                          </td>
                          <td className="py-3 px-4 border">
                            {order.bill_desc}
                          </td>
                          <td className="py-3 px-4 border">
                            <div className="flex flex-col space-y-2">
                              <label className="flex items-center justify-center w-full px-4 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200 transition duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                เลือกไฟล์สลิป
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(e, order.order_id)}
                                />
                              </label>
                              
                              {selectedFile && selectedOrder === order.order_id && (
                                <div className="text-center text-sm text-gray-600 truncate">
                                  {selectedFile.name}
                                </div>
                              )}
                              
                              <button
                                onClick={(e) => handleSubmit(e, order.order_id)}
                                disabled={loading}
                                className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 disabled:opacity-50"
                              >
                                {loading && selectedOrder === order.order_id ? (
                                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                )}
                                อัปโหลด
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 border">
                            {renderPaymentStatus(order)}
                          </td>
                          <td className="py-3 px-4 border">
                            {slipData && selectedOrder === order.order_id
                              ? slipData.data.sender?.displayName || "-"
                              : "-"}
                          </td>
                          <td className="py-3 px-4 border">
                            {slipData && selectedOrder === order.order_id
                              ? slipData.data.receiver?.displayName || "-"
                              : "-"}
                          </td>
                          <td className="py-3 px-4 border text-right">
                            {slipData && selectedOrder === order.order_id
                              ? `${slipData.data.amount?.toLocaleString() || "-"} ฿`
                              : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="py-8 px-4 text-center text-gray-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-lg font-semibold">ไม่พบประวัติการชำระเงิน</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
                
                {/* Table for smaller screens */}
                <div className="md:hidden">
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <div key={index} className="bg-white bg-opacity-90 rounded-lg shadow-xl p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-semibold">Order ID: {order.order_id}</h2>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-orange-600 font-medium">ค่าซ่อมรถ: {order.cost.toLocaleString()} ฿</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-orange-600 font-medium">รายละเอียด: {order.bill_desc}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-orange-600 font-medium">สถานะ: {renderPaymentStatus(order)}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-orange-600 font-medium">ผู้โอน: {slipData && selectedOrder === order.order_id ? slipData.data.sender?.displayName || "-" : "-"}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-orange-600 font-medium">ผู้รับ: {slipData && selectedOrder === order.order_id ? slipData.data.receiver?.displayName || "-" : "-"}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-orange-600 font-medium">จำนวนเงินที่โอน: {slipData && selectedOrder === order.order_id ? `${slipData.data.amount?.toLocaleString() || "-"} ฿` : "-"}</span>
                        </div>
                        <div className="flex flex-col space-y-2 mt-4">
                          <label className="flex items-center justify-center w-full px-4 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200 transition duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            เลือกไฟล์สลิป
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, order.order_id)}
                            />
                          </label>
                          {selectedFile && selectedOrder === order.order_id && (
                            <div className="text-center text-sm text-gray-600 truncate">
                              {selectedFile.name}
                            </div>
                          )}
                          <button
                            onClick={(e) => handleSubmit(e, order.order_id)}
                            disabled={loading}
                            className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 disabled:opacity-50"
                          >
                            {loading && selectedOrder === order.order_id ? (
                              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a
                                8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            )}
                            อัปโหลด
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-4 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-semibold text-center">ไม่พบประวัติการชำระเงิน</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
             
            </div>
          )}
        </div>
        <Footer />
    </>
  );
}