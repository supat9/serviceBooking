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

  // Fetch all repair orders
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

  // Fetch services from database
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

  // Update form values
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new repair order
  const handleAdd = async () => {
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

  // Delete repair order
  const handleDelete = async (order_id) => {
    try {
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

  // Start editing
  const handleEdit = (bill) => {
    setEditingId(bill.order_id);
    setEditForm({ ...bill });
  };

  // Save edits
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

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Filter bills by search term
  const filteredBills = bills.filter(
    (bill) =>
      bill.order_id.toString().includes(searchTerm) ||
      bill.service_id.toString().includes(searchTerm) ||
      bill.bill_desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <div className="bg-gray-50 min-h-screen" style={{ backgroundImage: "url('/src/assets/background.png')" }}>
      <Nav />
      <div className="container mx-auto px-4 py-8 pt-24 md:pt-28">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl text-center font-bold text-gray-800">ระบบจัดการข้อมูลค่าบริการ</h2>
          </div>

          {/* Add Form */}
          <div className="p-6 bg-white border-b border-gray-200">
            
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รหัสบริการ</label>
                <select
                  name="service_id"
                  value={form.service_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">ค่าใช้จ่าย (บาท)</label>
                <input
                  type="number"
                  name="cost"
                  placeholder="ระบุค่าใช้จ่าย"
                  value={form.cost}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                <input
                  type="text"
                  name="bill_desc"
                  placeholder="ระบุรายละเอียด"
                  value={form.bill_desc}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAdd}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center transition-colors duration-200"
              >
                <FaPlus className="mr-2" /> เพิ่มรายการ
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาด้วยรหัสหรือคำอธิบาย..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 pl-10 focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสออเดอร์</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสบริการ</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ค่าใช้จ่าย (บาท)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รายละเอียด</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-500">กำลังโหลดข้อมูล...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
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
                              className="border border-gray-300 rounded-md shadow-sm p-1 text-sm w-24"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={editForm.cost}
                              onChange={(e) =>
                                setEditForm({ ...editForm, cost: e.target.value })
                              }
                              className="border border-gray-300 rounded-md shadow-sm p-1 text-sm w-24"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={editForm.bill_desc}
                              onChange={(e) =>
                                setEditForm({ ...editForm, bill_desc: e.target.value })
                              }
                              className="border border-gray-300 rounded-md shadow-sm p-1 text-sm w-full"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={handleSaveEdit}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="บันทึก"
                            >
                              <FaSave />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-500 hover:text-red-700 p-1 ml-2"
                              title="ยกเลิก"
                            >
                              <FaTrashAlt />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.order_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.service_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.cost}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.bill_desc}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleEdit(bill)}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="แก้ไข"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(bill.order_id)}
                              className="text-red-500 hover:text-red-700 p-1 ml-2"
                              title="ลบ"
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
    </>
  );
}