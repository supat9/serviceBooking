import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Nav from "../nav-bar/nav";
import Footer from "../footer-page/footer";
import { FaEdit, FaSave, FaTrashAlt } from "react-icons/fa";

export default function AddBill() {
  const [bills, setBills] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ service_id: "", cost: "", bill_desc: "" });
  const [editingId, setEditingId] = useState(null); // เก็บ ID ที่กำลังแก้ไข
  const [editForm, setEditForm] = useState({}); // เก็บข้อมูลที่กำลังแก้ไข

  // ดึงข้อมูลใบแจ้งหนี้ทั้งหมด
  const fetchBills = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/repairOrder/getRepairOrders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
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
        Swal.fire("Success", "Repair Order Added", "success");
        fetchBills();
        setForm({ service_id: "", cost: "", bill_desc: "" });
      } else {
        Swal.fire("Error", data.error, "error");
      }
    } catch (error) {
      console.error("Error adding repair order:", error);
    }
  };

  // ลบใบแจ้งหนี้
  const handleDelete = async (order_id) => {
    try {
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
        Swal.fire("Deleted!", "Repair Order Deleted", "success");
        fetchBills();
      } else {
        Swal.fire("Error", data.error, "error");
      }
    } catch (error) {
      console.error("Error deleting repair order:", error);
    }
  };

  // เริ่มแก้ไขข้อมูล
  const handleEdit = (bill) => {
    setEditingId(bill.order_id);
    setEditForm({ ...bill });
  };

  // บันทึกการแก้ไข
  const handleSaveEdit = async () => {
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
        Swal.fire("Updated!", "Repair Order Updated", "success");
        setEditingId(null);
        fetchBills();
      } else {
        Swal.fire("Error", data.error, "error");
      }
    } catch (error) {
      console.error("Error updating repair order:", error);
    }
  };

  return (
    <>
        <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/background.png')" }}
      >
      <Nav />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          จัดการข้อมูลค่าบริการ
        </h2>

        {/* ฟอร์มเพิ่มใบแจ้งหนี้ */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-3 gap-4">
            <select
              name="service_id"
              value={form.service_id}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.service_id} value={service.service_id}>
                  {service.service_id}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="cost"
              placeholder="Cost"
              value={form.cost}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />
            <input
              type="text"
              name="bill_desc"
              placeholder="Description"
              value={form.bill_desc}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />
            <button
              onClick={handleAdd}
              className="col-span-3 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-800 transition"
            >
              Add Repair Order
            </button>
          </div>
        </div>

        {/* ตารางแสดงใบแจ้งหนี้ */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Service ID</th>
                <th className="px-4 py-2">ค่าใช้จ่าย</th>
                <th className="px-4 py-2">รายละเอียด</th>
                <th className="px-4 py-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.order_id} className="border-b">
                  {editingId === bill.order_id ? (
                    <>
                      <td className="px-4 py-2">{bill.order_id}</td>
                      <td className="px-4 py-2">
                        <select
                          name="service_id"
                          value={editForm.service_id}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              service_id: e.target.value,
                            })
                          }
                          className="border p-2 rounded-md w-full"
                        >
                          {services.map((service) => (
                            <option
                              key={service.service_id}
                              value={service.service_id}
                            >
                              {service.service_id}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name="cost"
                          value={editForm.cost}
                          onChange={(e) =>
                            setEditForm({ ...editForm, cost: e.target.value })
                          }
                          className="border p-2 rounded-md w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="bill_desc"
                          value={editForm.bill_desc}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              bill_desc: e.target.value,
                            })
                          }
                          className="border p-2 rounded-md w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-500 hover:text-green-700 mx-2"
                        >
                          <FaSave size={18} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{bill.order_id}</td>
                      <td className="px-4 py-2">{bill.service_id}</td>
                      <td className="px-4 py-2">{bill.cost}</td>
                      <td className="px-4 py-2">{bill.bill_desc}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEdit(bill)}
                          className="text-yellow-500 hover:text-yellow-700 mx-2"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(bill.order_id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </td>
                    </>
                  )}
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
