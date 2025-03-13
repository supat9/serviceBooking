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
      alert("Please select a file first");
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
        Swal.fire("Success", "Payment slip uploaded successfully", "success");
      } else {
        setErrorMessage(data.message || "Upload failed");
      }
      console.log("Slip Data:", slipData);
    } catch {
      setErrorMessage("Error connecting to server");
    } finally {
      setLoading(false);
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
              ประวัติการชำระเงิน
            </h1>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-black">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="py-2 px-4 border border-black">Order ID</th>
                    <th className="py-2 px-4 border border-black">ค่าซ่อมรถ</th>
                    <th className="py-2 px-4 border border-black">
                      รายละเอียด
                    </th>
                    <th className="py-2 px-4 border border-black">
                      Upload Payment Slip
                    </th>
                    <th className="py-2 px-4 border border-black">สถานะ</th>
                    <th className="py-2 px-4 border border-black">ผู้โอน</th>
                    <th className="py-2 px-4 border border-black">ผู้รับ</th>
                    <th className="py-2 px-4 border border-black">
                      จำนวนเงินที่โอน
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <tr
                        key={index}
                        className={`border border-black ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        } hover:bg-gray-300 transition duration-200`}
                      >
                        <td className="py-2 px-4 border border-black">
                          {order.order_id}
                        </td>
                        <td className="py-2 px-4 border border-black">
                          {order.cost} ฿
                        </td>
                        <td className="py-2 px-4 border border-black">
                          {order.bill_desc}
                        </td>
                        <td className="py-2 px-4 border border-black">
                          <input
                            type="file"
                            accept="image/*"
                            className="mb-2"
                            onChange={(e) =>
                              handleFileChange(e, order.order_id)
                            }
                          />
                          <button
                            onClick={(e) => handleSubmit(e, order.order_id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            Upload
                          </button>
                        </td>
                        <td className="py-2 px-4 border border-black">
                          {slipData && selectedOrder === order.order_id
                            ? slipData.data.amount === order.cost
                              ? "อัปโหลดสำเร็จ"
                              : "จำนวนเงินไม่ตรงกับค่าซ่อมรถ"
                            : "รอการอัปโหลด"}
                        </td>
                        <td className="py-2 px-4 border border-black">
                          {slipData?.data?.sender?.displayName}
                        </td>
                        <td className="py-2 px-4 border border-black">
                          {slipData?.data?.receiver?.displayName}
                        </td>
                        <td className="py-2 px-4 border border-black">
                          {slipData?.data?.amount} ฿
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="py-4 px-4 text-center text-gray-500 bg-white"
                      >
                        ยังไม่มีการชำระเงิน
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
