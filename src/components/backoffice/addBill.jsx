import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Nav from "../nav-bar/nav";
import Footer from "../footer-page/footer";
import { FaEdit, FaSave, FaTrashAlt, FaPlus, FaSearch } from "react-icons/fa";

export default function AddBill() {
  const [bills, setBills] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ service_id: "", cost: "", bill_desc: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลใบแจ้งหนี้ทั้งหมด
  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:3000/repairOrder/getRepairOrders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      setBills(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bills:", error);
      Swal.fire("Error", "ไม่สามารถดึงข้อมูลใบแจ้งหนี้ได้", "error");
      setLoading(false);
    }
  };

  // ดึงรายการ service จาก database
  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:3000/repairOrder/getServices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      Swal.fire("Error", "ไม่สามารถดึงข้อมูลบริการได้", "error");
    }
  };

  useEffect(() => {
    fetchBills();
    fetchServices();
  }, []);

  // อัปเดตค่าฟอร์ม
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // เพิ่มใบแจ้งหนี้
  const handleAdd = async () => {
    // ตรวจสอบความถูกต้องของข้อมูล
    if (!form.service_id || !form.cost) {
      Swal.fire("กรุณากรอกข้อมูล", "โปรดระบุรหัสบริการและราคา", "warning");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/repairOrder/addRepairOrder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          title: "สำเร็จ",
          text: "เพิ่มรายการค่าบริการเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        fetchBills();
        setForm({ service_id: "", cost: "", bill_desc: "" });
      } else {
        Swal.fire("เกิดข้อผิดพลาด", data.error, "error");
      }
    } catch (error) {
      console.error("Error adding repair order:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มข้อมูลได้", "error");
    }
  };

  // ลบใบแจ้งหนี้
  const handleDelete = async (order_id) => {
    try {
      // ยืนยันการลบ
      const result = await Swal.fire({
        title: "ยืนยันการลบ",
        text: "คุณต้องการลบรายการนี้ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ใช่, ลบเลย",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        const res = await fetch(
          "http://localhost:3000/repairOrder/deleteRepairOrder",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: order_id }),
          }
        );
        const data = await res.json();
        if (data.success) {
          Swal.fire("ลบสำเร็จ", "รายการถูกลบเรียบร้อยแล้ว", "success");
          fetchBills();
        } else {
          Swal.fire("เกิดข้อผิดพลาด", data.error, "error");
        }
      }
    } catch (error) {
      console.error("Error deleting repair order:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
    }
  };

  // เริ่มแก้ไขข้อมูล
  const handleEdit = (bill) => {
    setEditingId(bill.order_id);
    setEditForm({ ...bill });
  };

  // บันทึกการแก้ไข
  const handleSaveEdit = async () => {
    if (!editForm.service_id || !editForm.cost) {
      Swal.fire("กรุณากรอกข้อมูล", "โปรดระบุรหัสบริการและราคา", "warning");
      return;
    }
    
    try {
      const res = await fetch(
        "http://localhost:3000/repairOrder/updateRepairOrder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );
      const data = await res.json();

      if (data.success) {
        Swal.fire({
          title: "อัปเดตสำเร็จ",
          text: "ข้อมูลได้รับการอัปเดตเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        setEditingId(null);
        fetchBills();
      } else {
        Swal.fire("เกิดข้อผิดพลาด", data.error, "error");
      }
    } catch (error) {
      console.error("Error updating repair order:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตข้อมูลได้", "error");
    }
  };

  // ยกเลิกการแก้ไข
  const cancelEdit = () => {
    setEditingId(null);
  };

  // กรองข้อมูลตามคำค้นหา
  const filteredBills = bills.filter(
    (bill) =>
      bill.order_id.toString().includes(searchTerm) ||
      bill.service_id.toString().includes(searchTerm) ||
      bill.bill_desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div
        className="pt-24 md:pt-28 min-h-screen bg-gray-50"
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
        <Nav />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 border-b pb-2">
              ระบบจัดการข้อมูลค่าบริการ
            </h2>

            {/* ฟอร์มเพิ่มใบแจ้งหนี้ */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                <FaPlus className="mr-2" /> เพิ่มรายการค่าบริการใหม่
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รหัสบริการ</label>
                  <select
                    name="service_id"
                    value={form.service_id}
                    onChange={handleChange}
                    className="border border-gray-300 p-3 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- เลือกรหัสบริการ --</option>
                    {services.map((service) => (
                      <option key={service.service_id} value={service.service_id}>
                        {service.service_id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ค่าใช้จ่าย (บาท)</label>
                  <input
                    type="number"
                    name="cost"
                    placeholder="ระบุค่าใช้จ่าย"
                    value={form.cost}
                    onChange={handleChange}
                    className="border border-gray-300 p-3 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รายละเอียด</label>
                  <input
                    type="text"
                    name="bill_desc"
                    placeholder="ระบุรายละเอียด"
                    value={form.bill_desc}
                    onChange={handleChange}
                    className="border border-gray-300 p-3 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleAdd}
                className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center w-full md:w-auto md:ml-auto"
              >
                <FaPlus className="mr-2" /> เพิ่มรายการ
              </button>
            </div>

            {/* ค้นหา */}
            <div className="flex items-center mb-6">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="ค้นหาด้วยรหัสหรือคำอธิบาย..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 p-3 pl-10 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* ตารางแสดงใบแจ้งหนี้ */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">รหัสออเดอร์</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">รหัสบริการ</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">ค่าใช้จ่าย (บาท)</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">รายละเอียด</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <span className="ml-2">กำลังโหลดข้อมูล...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredBills.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-500">
                          ไม่พบข้อมูลรายการค่าบริการ
                        </td>
                      </tr>
                    ) : (
                      filteredBills.map((bill) => (
                        <tr key={bill.order_id} className="hover:bg-gray-50">
                          {editingId === bill.order_id ? (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {bill.order_id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="text"
                                  value={editForm.service_id}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, service_id: e.target.value })
                                  }
                                  className="border border-gray-300 p-2 rounded-md w-24"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="number"
                                  value={editForm.cost}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, cost: e.target.value })
                                  }
                                  className="border border-gray-300 p-2 rounded-md w-24"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="text"
                                  value={editForm.bill_desc}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, bill_desc: e.target.value })
                                  }
                                  className="border border-gray-300 p-2 rounded-md w-48"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                  onClick={handleSaveEdit}
                                  className="text-blue-600 hover:text-blue-800 mr-2"
                                >
                                  <FaSave />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrashAlt />
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap">{bill.order_id}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{bill.service_id}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{bill.cost}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{bill.bill_desc}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                  onClick={() => handleEdit(bill)}
                                  className="text-blue-600 hover:text-blue-800 mr-2"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDelete(bill.order_id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrashAlt />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}